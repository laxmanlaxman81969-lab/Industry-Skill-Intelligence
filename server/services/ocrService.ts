// Real OCR Service using Tesseract.js
// Invoked for image resumes (PNG, JPG, JPEG, WEBP) and scanned PDFs (< 40 words or garbled)

export interface OCRResult {
  text: string;
  confidence: number; // 0.0 to 1.0
}

export class OCRService {
  private static instance: OCRService;

  public static getInstance(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }

  /**
   * Run Tesseract OCR on an image buffer.
   * Cleans OCR artifacts and calculates average confidence.
   */
  public async performOCR(
    imageBuffer: Buffer,
    onProgress?: (progress: number, status: string) => void
  ): Promise<OCRResult> {
    console.log('[OCR] Initializing Tesseract OCR worker...');
    if (onProgress) onProgress(10, 'Initializing OCR engine...');

    let worker: any = null;
    const ocrPromise = (async () => {
      const { createWorker } = await import('tesseract.js');
      worker = await createWorker('eng', 1, {
        cachePath: process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME ? '/tmp' : undefined
      });
      if (onProgress) onProgress(35, 'Running OCR on document...');

      const ret = await worker.recognize(imageBuffer);
      if (onProgress) onProgress(90, 'OCR recognition complete');

      const rawText = ret.data.text || '';
      const confidence = ret.data.confidence != null ? Math.round(ret.data.confidence) / 100 : 0.85;

      console.log(`[OCR] Extracted ${rawText.length} characters (confidence: ${Math.round(confidence * 100)}%).`);

      const cleanedText = this.cleanOcrText(rawText);
      return {
        text: cleanedText,
        confidence
      };
    })();

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('OCR engine timed out after 10 seconds.')), 10000);
    });

    try {
      return await Promise.race([ocrPromise, timeoutPromise]);
    } catch (err: any) {
      console.error('[OCR] OCR execution failed or timed out:', err.message);
      throw new Error('OCR text recognition failed on document. Please ensure the image/scan is clear and legible.');
    } finally {
      if (worker) {
        try {
          await worker.terminate();
        } catch {}
      }
    }
  }

  /**
   * Cleans typical OCR artifacts while preserving resume structure.
   */
  private cleanOcrText(text: string): string {
    return text
      // Replace non-breaking spaces
      .replace(/\u00A0/g, ' ')
      // Fix broken bullet points from OCR (e.g. ~ , o , * at start of lines)
      .replace(/^[\s~*•\-o]\s+/gm, '• ')
      // Normalize line breaks
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Remove excessive vertical spaces
      .replace(/\n{4,}/g, '\n\n\n')
      // Clean isolated stray noise characters
      .replace(/(?:^|\n)[^\w\s\n•]{1,2}(?:\n|$)/g, '\n')
      .trim();
  }
}
