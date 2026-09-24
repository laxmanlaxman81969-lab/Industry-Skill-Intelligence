// Real OCR Service using Tesseract.js
// Invoked when PDF text extraction detects scanned image pages or < 50 extracted words

import { createWorker } from 'tesseract.js';

export class OCRService {
  private static instance: OCRService;

  public static getInstance(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }

  public async performOCR(
    imageBuffer: Buffer,
    onProgress?: (progress: number, status: string) => void
  ): Promise<string> {
    console.log('[OCR] Initializing Tesseract OCR worker for scanned document...');
    if (onProgress) onProgress(10, 'Initializing OCR engine...');

    const worker = await createWorker('eng');
    try {
      if (onProgress) onProgress(40, 'Running OCR on scanned document...');
      const ret = await worker.recognize(imageBuffer);
      if (onProgress) onProgress(90, 'OCR recognition complete');
      console.log(`[OCR] Finished OCR. Extracted ${ret.data.text.length} characters.`);
      return ret.data.text || '';
    } catch (err) {
      console.error('[OCR] OCR execution failed:', err);
      throw new Error('OCR text recognition failed on scanned document.');
    } finally {
      await worker.terminate();
    }
  }
}
