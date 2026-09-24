// Real File Parser Service
// Supports PDF (pdf-parse + OCR fallback), DOCX (mammoth), TXT, and DOC
// Computes SHA-256 hash, enforces 10MB limit, uses persistent parse cache

import crypto from 'crypto';
import { createRequire } from 'module';
import mammoth from 'mammoth';
import { ParsedResumeDocument } from '../types';
import { Database } from '../db/database';
import { OCRService } from './ocrService';
import { SectionDetector } from './sectionDetector';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const MIN_WORDS_REQUIRED = 15; // Realistic threshold supporting concise image resumes and scanned profiles

export interface FileParseResult {
  document: ParsedResumeDocument;
  isCached: boolean;
  message?: string;
}

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

  public async parseFile(
    buffer: Buffer,
    fileName: string,
    mimeType?: string,
    onStatusUpdate?: (status: string) => void
  ): Promise<FileParseResult> {
    // 1. File Size Validation
    if (buffer.length > MAX_FILE_SIZE_BYTES) {
      throw new Error('File exceeds the 10 MB limit.');
    }

    if (buffer.length === 0) {
      throw new Error('The uploaded file is empty.');
    }

    // 2. Extension & MIME Validation (Supports PDF, DOCX, DOC, TXT, PNG, JPG, JPEG, WEBP)
    const ext = (fileName.split('.').pop() || '').toLowerCase();
    const validExtensions = ['pdf', 'docx', 'doc', 'txt', 'png', 'jpg', 'jpeg', 'webp'];
    if (!validExtensions.includes(ext)) {
      throw new Error('Unsupported file type. Please upload PDF, DOCX, DOC, TXT, PNG, JPG, or WEBP.');
    }

    // 3. Deterministic SHA-256 Hash Calculation
    const fileHash = this.computeFileHash(buffer);

    // 4. Check Persistent Parse Cache
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

    try {
      if (ext === 'txt') {
        rawText = buffer.toString('utf-8');
        extractionMethod = 'text-direct';
      } else if (ext === 'docx') {
        const mammothResult = await mammoth.extractRawText({ buffer });
        rawText = mammothResult.value || '';
        extractionMethod = 'mammoth-docx';
      } else if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) {
        console.log(`[Parser] Image resume detected (${ext}). Running Tesseract OCR...`);
        if (onStatusUpdate) onStatusUpdate('Running OCR on image resume...');
        try {
          rawText = await this.ocr.performOCR(buffer, (_pct, msg) => {
            if (onStatusUpdate) onStatusUpdate(msg);
          });
          extractionMethod = 'tesseract-ocr';
          ocrUsed = true;
        } catch (ocrErr: any) {
          console.error('[Parser] Image OCR failed:', ocrErr);
          throw new Error('Failed to read text from image resume. Please ensure the image is clear and legible.');
        }
      } else if (ext === 'pdf') {
        try {
          const pdfData = await pdfParse(buffer);
          rawText = pdfData.text || '';
          extractionMethod = 'pdf-parse';
        } catch (pdfErr) {
          console.warn('[Parser] Standard PDF extraction encountered error, attempting OCR:', pdfErr);
          rawText = '';
        }

        // Check if PDF appears to be a scanned document (< 50 words)
        const wordCount = rawText.trim().split(/\s+/).filter(Boolean).length;
        if (wordCount < 40) {
          console.log(`[Parser] Scanned or empty PDF detected (${wordCount} words). Triggering OCR...`);
          if (onStatusUpdate) onStatusUpdate('Running OCR on scanned document...');
          try {
            rawText = await this.ocr.performOCR(buffer, (_pct, msg) => {
              if (onStatusUpdate) onStatusUpdate(msg);
            });
            extractionMethod = 'tesseract-ocr';
            ocrUsed = true;
          } catch (ocrErr) {
            console.warn('[Parser] OCR failed, keeping standard extraction:', ocrErr);
          }
        }
      } else if (ext === 'doc') {
        // Binary DOC text extraction
        const str = buffer.toString('binary');
        // Filter readable ascii sequences of length >= 4
        const matches = str.match(/[\x20-\x7E\s]{4,}/g);
        if (matches && matches.length > 0) {
          rawText = matches.join(' ');
          extractionMethod = 'text-direct';
        } else {
          throw new Error('The uploaded document appears to be corrupted or unreadable.');
        }
      }
    } catch (err: any) {
      if (err.message && (err.message.includes('limit') || err.message.includes('corrupted') || err.message.includes('Unsupported') || err.message.includes('legible'))) {
        throw err;
      }
      throw new Error('The uploaded document appears to be corrupted or unreadable.');
    }

    // 5. Text Normalization
    const normalizedText = this.normalizeExtractedText(rawText);
    const words = normalizedText.split(/\s+/).filter(Boolean);

    // 6. Minimum Word Validation
    if (words.length < MIN_WORDS_REQUIRED) {
      throw new Error('Resume too short to analyze. Please provide a more complete resume.');
    }

    // 7. Section Detection & Language Detection
    const detectedSections = SectionDetector.detectSections(normalizedText);
    const langResult = SectionDetector.detectLanguage(normalizedText);

    const doc: ParsedResumeDocument = {
      fileHash,
      fileName,
      fileSize: buffer.length,
      fileMimeType: mimeType || `application/${ext}`,
      extractedText: normalizedText,
      wordCount: words.length,
      extractionMethod,
      ocrUsed,
      detectedSections,
      detectedLanguage: langResult.language,
      isLanguageSupported: langResult.isSupported,
      parsedAt: new Date().toISOString()
    };

    // 8. Save to Persistent Parse Cache
    this.db.saveParsedDocument(doc);

    return {
      document: doc,
      isCached: false
    };
  }

  private normalizeExtractedText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Remove unprintable control characters except newline and tab
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // Replace multiple consecutive blank lines with maximum two
      .replace(/\n{3,}/g, '\n\n')
      // Replace non-breaking spaces
      .replace(/\u00A0/g, ' ')
      .trim();
  }
}
