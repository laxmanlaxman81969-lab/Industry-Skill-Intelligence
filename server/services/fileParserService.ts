// Real Universal File Parser Service
// Supports PDF (with automatic OCR fallback for scanned/garbled pages),
// DOCX (mammoth), DOC, TXT, RTF, ODT, HTML, and Images (PNG, JPG, JPEG, WEBP via Tesseract OCR)
// Enforces 10MB limit, magic byte validation, persistent parse caching, and resume authenticity checks

import crypto from 'crypto';
import zlib from 'zlib';
import { createRequire } from 'module';
import mammoth from 'mammoth';
import { ParsedResumeDocument } from '../types';
import { Database } from '../db/database';
import { OCRService } from './ocrService';
import { SectionDetector } from './sectionDetector';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const MIN_WORDS_REQUIRED = 15;

export interface FileParseResult {
  document: ParsedResumeDocument;
  isCached: boolean;
  message?: string;
}

export type DetectedFileType =
  | 'pdf'
  | 'docx'
  | 'doc'
  | 'txt'
  | 'rtf'
  | 'odt'
  | 'html'
  | 'png'
  | 'jpg'
  | 'webp'
  | 'executable'
  | 'unsupported';

export class FileParserService {
  private static instance: FileParserService;
  private db = Database.getInstance();
  private ocr = OCRService.getInstance();

  public static getInstance(): FileParserService {
    if (!FileParserService.instance) {
      FileParserService.instance = new FileParserService();
    }
    return FileParserService.instance;
  }

  public computeFileHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Detects real file format using file signatures (magic bytes) + extension validation.
   */
  public detectFileType(buffer: Buffer, fileName: string): DetectedFileType {
    const ext = (fileName.split('.').pop() || '').toLowerCase();

    // 1. Dangerous executable signatures - block immediately
    if (buffer.length >= 2) {
      // Windows PE (MZ)
      if (buffer[0] === 0x4D && buffer[1] === 0x5A) return 'executable';
    }
    if (buffer.length >= 4) {
      // ELF binary
      if (buffer[0] === 0x7F && buffer[1] === 0x45 && buffer[2] === 0x4C && buffer[3] === 0x46) return 'executable';
    }
    const dangerousExts = ['exe', 'dll', 'bat', 'cmd', 'ps1', 'sh', 'js', 'vbs', 'iso', 'apk', 'zip', 'rar', 'tar', 'gz', '7z'];
    if (dangerousExts.includes(ext)) {
      return 'executable';
    }

    // 2. Check Magic Bytes
    if (buffer.length >= 4) {
      // PDF: %PDF- (0x25 0x50 0x44 0x46)
      if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
        return 'pdf';
      }

      // PNG: \x89PNG (0x89 0x50 0x4E 0x47)
      if (buffer.length >= 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
        return 'png';
      }

      // JPEG: FF D8 FF
      if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
        return 'jpg';
      }

      // WEBP: RIFF....WEBP (0x52 0x49 0x46 0x46 ... 0x57 0x45 0x42 0x50)
      if (
        buffer.length >= 12 &&
        buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
        buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
      ) {
        return 'webp';
      }

      // RTF: {\rtf (0x7B 0x5C 0x72 0x74 0x66)
      if (buffer.length >= 5 && buffer[0] === 0x7B && buffer[1] === 0x5C && buffer[2] === 0x72 && buffer[3] === 0x74 && buffer[4] === 0x66) {
        return 'rtf';
      }

      // OLE2 DOC: \xD0\xCF\x11\xE0
      if (buffer[0] === 0xD0 && buffer[1] === 0xCF && buffer[2] === 0x11 && buffer[3] === 0xE0) {
        return 'doc';
      }

      // ZIP Containers: PK\x03\x04 (DOCX or ODT)
      if (buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04) {
        // Inspect ZIP header for Word or OpenDocument markers
        const sample = buffer.subarray(0, Math.min(buffer.length, 2048)).toString('binary');
        if (ext === 'odt' || sample.includes('oasis.opendocument') || sample.includes('content.xml')) {
          return 'odt';
        }
        return 'docx';
      }
    }

    // 3. HTML signatures
    const startStr = buffer.subarray(0, Math.min(buffer.length, 500)).toString('utf-8').trim().toLowerCase();
    if (startStr.startsWith('<!doctype html') || startStr.startsWith('<html') || (startStr.includes('<body') && startStr.includes('</'))) {
      return 'html';
    }

    // 4. Extension-based mapping fallback
    if (ext === 'pdf') return 'pdf';
    if (ext === 'docx') return 'docx';
    if (ext === 'doc') return 'doc';
    if (ext === 'txt') return 'txt';
    if (ext === 'rtf') return 'rtf';
    if (ext === 'odt') return 'odt';
    if (ext === 'html' || ext === 'htm') return 'html';
    if (ext === 'png') return 'png';
    if (ext === 'jpg' || ext === 'jpeg') return 'jpg';
    if (ext === 'webp') return 'webp';

    return 'unsupported';
  }

  /**
   * Main universal parse entry point.
   */
  public async parseFile(
    buffer: Buffer,
    fileName: string,
    mimeType?: string,
    onStatusUpdate?: (status: string) => void,
    sourceMeta?: { type: 'file' | 'url'; url?: string }
  ): Promise<FileParseResult> {
    // 1. File Size Validation (10 MB limit)
    if (buffer.length > MAX_FILE_SIZE_BYTES) {
      throw new Error('File exceeds the 10 MB limit.');
    }
    if (buffer.length === 0) {
      throw new Error('The uploaded file is empty.');
    }

    // 2. Format & Security Signature Detection
    const detectedType = this.detectFileType(buffer, fileName);
    if (detectedType === 'executable') {
      throw new Error('Executable and script files are not allowed for security reasons. Please upload a document or image resume.');
    }
    if (detectedType === 'unsupported') {
      throw new Error('This file format is not supported. Please upload PDF, DOCX, DOC, TXT, RTF, ODT, HTML, or an image resume (PNG, JPG, WEBP).');
    }

    // 3. Deterministic SHA-256 Hash
    const fileHash = this.computeFileHash(buffer);

    // 4. Persistent Parse Cache Check
    const cached = this.db.getCachedParse(fileHash);
    if (cached) {
      console.log(`[Parser] Cache hit for fileHash: ${fileHash} (${fileName})`);
      return {
        document: cached,
        isCached: true,
        message: 'Using previously parsed document.'
      };
    }

    if (onStatusUpdate) onStatusUpdate('Parsing document...');

    let rawText = '';
    let extractionMethod: ParsedResumeDocument['extractionMethod'] = 'text-direct';
    let ocrUsed = false;
    let ocrConfidence: number | undefined;

    try {
      // ── TXT ─────────────────────────────────────────────────────────────
      if (detectedType === 'txt') {
        rawText = this.decodeTextBuffer(buffer);
        extractionMethod = 'text-direct';
      }

      // ── DOCX ────────────────────────────────────────────────────────────
      else if (detectedType === 'docx') {
        if (onStatusUpdate) onStatusUpdate('Extracting DOCX content...');
        const mammothResult = await mammoth.extractRawText({ buffer });
        rawText = mammothResult.value || '';
        extractionMethod = 'mammoth-docx';
      }

      // ── RTF ─────────────────────────────────────────────────────────────
      else if (detectedType === 'rtf') {
        if (onStatusUpdate) onStatusUpdate('Parsing RTF document...');
        const rtfRaw = buffer.toString('latin1');
        rawText = this.extractRtfText(rtfRaw);
        extractionMethod = 'rtf-parser';
      }

      // ── ODT ─────────────────────────────────────────────────────────────
      else if (detectedType === 'odt') {
        if (onStatusUpdate) onStatusUpdate('Extracting OpenDocument text...');
        rawText = this.extractOdtText(buffer);
        extractionMethod = 'odt-parser';
      }

      // ── HTML ────────────────────────────────────────────────────────────
      else if (detectedType === 'html') {
        if (onStatusUpdate) onStatusUpdate('Extracting HTML resume...');
        const htmlStr = buffer.toString('utf-8');
        rawText = this.extractHtmlText(htmlStr);
        extractionMethod = 'html-parser';
      }

      // ── IMAGE RESUME (PNG / JPG / JPEG / WEBP) ──────────────────────────
      else if (['png', 'jpg', 'webp'].includes(detectedType)) {
        console.log(`[Parser] Image resume detected (${detectedType}). Running Tesseract OCR...`);
        if (onStatusUpdate) onStatusUpdate('Image resume detected. Running OCR...');
        const ocrResult = await this.ocr.performOCR(buffer, (_pct, msg) => {
          if (onStatusUpdate) onStatusUpdate(msg);
        });
        rawText = ocrResult.text;
        ocrConfidence = ocrResult.confidence;
        extractionMethod = 'tesseract-ocr';
        ocrUsed = true;

        const words = rawText.trim().split(/\s+/).filter(Boolean);
        if (words.length < 15) {
          throw new Error('Resume image quality is too low for reliable extraction. Please upload a clearer image.');
        }
      }

      // ── PDF ─────────────────────────────────────────────────────────────
      else if (detectedType === 'pdf') {
        if (onStatusUpdate) onStatusUpdate('Extracting PDF text...');
        try {
          const pdfData = await pdfParse(buffer);
          rawText = pdfData.text || '';
          extractionMethod = 'pdf-parse';
        } catch (pdfErr: any) {
          const errMsg = (pdfErr?.message || '').toLowerCase();
          if (errMsg.includes('password') || errMsg.includes('encrypted') || errMsg.includes('needpassword')) {
            throw new Error('This file is password protected and cannot be processed.');
          }
          console.warn('[Parser] Standard PDF extraction failed, attempting OCR fallback:', pdfErr);
          rawText = '';
        }

        // Quality check: Check if PDF is scanned, empty, or garbled
        if (!this.isPdfTextSufficient(rawText)) {
          console.log('[Parser] Scanned or low-density PDF detected. Automatically invoking OCR...');
          if (onStatusUpdate) onStatusUpdate('Scanned resume detected. Running OCR...');
          try {
            const ocrResult = await this.ocr.performOCR(buffer, (_pct, msg) => {
              if (onStatusUpdate) onStatusUpdate(msg);
            });
            if (ocrResult.text && ocrResult.text.trim().length > rawText.trim().length) {
              rawText = ocrResult.text;
              ocrConfidence = ocrResult.confidence;
              extractionMethod = 'tesseract-ocr';
              ocrUsed = true;
            }
          } catch (ocrErr) {
            console.warn('[Parser] PDF OCR fallback encountered error:', ocrErr);
          }
        }
      }

      // ── LEGACY DOC ──────────────────────────────────────────────────────
      else if (detectedType === 'doc') {
        if (onStatusUpdate) onStatusUpdate('Extracting legacy DOC...');
        rawText = this.extractDocText(buffer);
        extractionMethod = 'doc-parser';
      }
    } catch (err: any) {
      if (
        err.message &&
        (err.message.includes('password') ||
         err.message.includes('image quality is too low') ||
         err.message.includes('not supported') ||
         err.message.includes('limit') ||
         err.message.includes('Legacy DOC processing'))
      ) {
        throw err;
      }
      console.error('[Parser] File extraction error:', err);
      throw new Error('Unable to read this file. The file may be corrupted or unsupported.');
    }

    // 5. Text Normalization
    const normalizedText = this.normalizeExtractedText(rawText);
    const words = normalizedText.split(/\s+/).filter(Boolean);

    // 6. Minimum Word Threshold Validation (Rule: after extraction/OCR)
    if (words.length < MIN_WORDS_REQUIRED) {
      throw new Error('Resume does not contain enough information for analysis. Please provide a more complete resume.');
    }

    // 7. Non-Resume Document Detection
    if (!this.isLikelyResume(normalizedText)) {
      throw new Error('This document does not appear to contain sufficient resume information. Please upload a valid resume.');
    }

    // 8. Section & Language Detection
    const detectedSections = SectionDetector.detectSections(normalizedText);
    const langResult = SectionDetector.detectLanguage(normalizedText);

    // 9. Extraction Quality Rating
    const extractionQuality: 'High' | 'Medium' | 'Low' =
      ocrUsed && (ocrConfidence ?? 0) < 0.7
        ? 'Medium'
        : words.length >= 100 && Object.keys(detectedSections).length >= 2
        ? 'High'
        : words.length >= 40
        ? 'Medium'
        : 'Low';

    const doc: ParsedResumeDocument = {
      fileHash,
      fileName,
      fileSize: buffer.length,
      fileMimeType: mimeType || `application/${detectedType}`,
      extractedText: normalizedText,
      wordCount: words.length,
      extractionMethod,
      ocrUsed,
      ocrConfidence,
      sourceType: sourceMeta?.type || 'file',
      sourceUrl: sourceMeta?.url,
      extractionQuality,
      detectedSections,
      detectedLanguage: langResult.language,
      isLanguageSupported: langResult.isSupported,
      parsedAt: new Date().toISOString()
    };

    // 10. Save to Persistent Parse Cache
    this.db.saveParsedDocument(doc);

    return {
      document: doc,
      isCached: false
    };
  }

  /**
   * PDF quality verification to determine if OCR is required.
   */
  private isPdfTextSufficient(text: string): boolean {
    const trimmed = text.trim();
    if (!trimmed) return false;

    const words = trimmed.split(/\s+/).filter(Boolean);
    if (words.length < 40) return false;

    // Check alphabetic ratio (garbled/binary junk detection)
    const alphabeticChars = (trimmed.match(/[a-zA-Z]/g) || []).length;
    const totalChars = trimmed.length;
    if (alphabeticChars / totalChars < 0.40) return false;

    // Check for repetitive single-character loops
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    if (words.length > 30 && uniqueWords.size < 6) return false;

    return true;
  }

  /**
   * Determines if extracted text contains plausible resume signals.
   */
  private isLikelyResume(text: string): boolean {
    const lower = text.toLowerCase();

    // 1. Contact signals
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
    const hasPhone = /(?:\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(text);
    const hasProfile = /github\.com|linkedin\.com|portfolio/i.test(text);

    // 2. Section markers
    const hasSections = /skills|technical skills|experience|education|projects|certifications|summary|objective|employment|work history/i.test(lower);

    // 3. Resume vocabulary
    const resumeTerms = [
      'bachelor', 'b.tech', 'b.e.', 'master', 'm.tech', 'degree', 'university',
      'institute', 'college', 'resume', 'curriculum vitae', 'gpa', 'cgpa',
      'developer', 'engineer', 'analyst', 'programmer', 'intern', 'internship',
      'responsibilities', 'technologies', 'programming', 'software'
    ];
    let termCount = 0;
    for (const term of resumeTerms) {
      if (lower.includes(term)) termCount++;
    }

    return hasEmail || hasPhone || hasProfile || hasSections || termCount >= 2;
  }

  /**
   * Decodes buffer with UTF-8 / UTF-16 BOM detection.
   */
  private decodeTextBuffer(buffer: Buffer): string {
    if (buffer.length >= 2) {
      if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
        return buffer.toString('utf16le', 2);
      }
      if (buffer[0] === 0xFE && buffer[1] === 0xFF) {
        // Swap bytes for BE to LE
        const swapped = Buffer.from(buffer.subarray(2));
        swapped.swap16();
        return swapped.toString('utf16le');
      }
    }
    return buffer.toString('utf-8');
  }

  /**
   * Extracts text from OpenDocument Text (.odt) files.
   */
  private extractOdtText(buffer: Buffer): string {
    let offset = 0;
    let contentXml = '';

    while (offset < buffer.length - 4) {
      if (buffer[offset] === 0x50 && buffer[offset + 1] === 0x4B && buffer[offset + 2] === 0x03 && buffer[offset + 3] === 0x04) {
        const compMethod = buffer.readUInt16LE(offset + 8);
        const compSize = buffer.readUInt32LE(offset + 18);
        const fileNameLen = buffer.readUInt16LE(offset + 26);
        const extraLen = buffer.readUInt16LE(offset + 28);
        const fileName = buffer.toString('utf-8', offset + 30, offset + 30 + fileNameLen);
        const dataStart = offset + 30 + fileNameLen + extraLen;

        if (fileName === 'content.xml') {
          const fileData = buffer.subarray(dataStart, dataStart + compSize);
          if (compMethod === 8) {
            contentXml = zlib.inflateRawSync(fileData).toString('utf-8');
          } else if (compMethod === 0) {
            contentXml = fileData.toString('utf-8');
          }
          break;
        }
        offset = dataStart + compSize;
      } else {
        offset++;
      }
    }

    if (!contentXml) {
      throw new Error('Unable to extract content from ODT document. The file may be corrupt.');
    }

    return contentXml
      .replace(/<text:p[^>]*>/gi, '\n')
      .replace(/<text:h[^>]*>/gi, '\n\n')
      .replace(/<text:tab\/>/gi, '\t')
      .replace(/<text:line-break\/>/gi, '\n')
      .replace(/<table:table-cell[^>]*>/gi, ' ')
      .replace(/<table:table-row[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  /**
   * Extracts clean text from RTF markup.
   */
  private extractRtfText(rtf: string): string {
    let text = rtf;
    // Remove binary data / embedded pictures
    text = text.replace(/\{\\\*\\pict[\s\S]*?\}/g, '');
    // Remove font table, color table, stylesheet groups
    text = text.replace(/\{\\(?:fonttbl|colortbl|stylesheet|info)[\s\S]*?\}/g, '');
    // Convert paragraph and line breaks
    text = text.replace(/\\par(?:\r\n|\r|\n|\s)/g, '\n');
    text = text.replace(/\\line(?:\r\n|\r|\n|\s)/g, '\n');
    text = text.replace(/\\tab(?:\r\n|\r|\n|\s)/g, '\t');
    // Decode hexadecimal escapes \'hh
    text = text.replace(/\\'([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    // Remove other control words
    text = text.replace(/\\[a-zA-Z]+-?\d* ?/g, '');
    // Remove curly braces
    text = text.replace(/[{}]/g, '');
    return text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  /**
   * Extracts text from HTML documents while preserving layout structure.
   */
  private extractHtmlText(html: string): string {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '')
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<\/(h[1-6]|p|div|section|article|li|tr)>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(td|th)>/gi, '\t')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
      .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s+\n/g, '\n\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  /**
   * Extracts text runs from legacy binary DOC format.
   */
  private extractDocText(buffer: Buffer): string {
    // Word 97-2003 binary format text run extraction
    const raw = buffer.toString('binary');
    // Look for ASCII printable sequences >= 4 characters
    const matches = raw.match(/[\x20-\x7E\r\n\t]{4,}/g);
    if (!matches || matches.length < 5) {
      throw new Error('Legacy DOC processing is temporarily unavailable. Please save your file as DOCX or PDF and try again.');
    }
    const filtered = matches.filter(s => {
      const clean = s.trim();
      return clean.length >= 3 && !/^[A-Za-z0-9+/=]{20,}$/.test(clean);
    });
    const result = filtered.join(' ');
    if (result.split(/\s+/).length < MIN_WORDS_REQUIRED) {
      throw new Error('Legacy DOC processing is temporarily unavailable. Please save your file as DOCX or PDF and try again.');
    }
    return result;
  }

  private normalizeExtractedText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\u00A0/g, ' ')
      .trim();
  }
}
