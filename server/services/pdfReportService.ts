// Real PDF Report Generator using pdf-lib
// Generates official, downloadable PDF reports directly from the stored analysis record

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { AnalysisRecord } from '../types';

function cleanPdfText(text: string): string {
  return (text || '')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export class PDFReportService {
  public static async generateReport(analysis: AnalysisRecord): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 format
    const { width, height } = page.getSize();

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const primaryColor = rgb(0.12, 0.35, 0.85); // Blue
    const darkSlate = rgb(0.09, 0.13, 0.22);
    const grayText = rgb(0.39, 0.45, 0.55);
    const lightBg = rgb(0.96, 0.97, 0.99);

    let y = height - 50;

    // Header Title
    page.drawText('INDUSTRY SKILL INTELLIGENCE', {
      x: 50,
      y,
      size: 10,
      font: fontBold,
      color: primaryColor
    });

    y -= 20;
    page.drawText('Official AI Skill Analyzer Benchmark Report', {
      x: 50,
      y,
      size: 16,
      font: fontBold,
      color: darkSlate
    });

    y -= 15;
    page.drawText(
      cleanPdfText(`Generated: ${new Date(analysis.createdAt).toLocaleDateString()} | Benchmark Date: ${analysis.benchmarkRefreshDate}`),
      {
        x: 50,
        y,
        size: 9,
        font: fontRegular,
        color: grayText
      }
    );

    // Decorative line
    y -= 15;
    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1,
      color: rgb(0.88, 0.91, 0.95)
    });

    // Candidate & Target Role Card
    y -= 25;
    page.drawText(cleanPdfText(`Candidate Name: ${analysis.candidateName || 'Candidate'}`), {
      x: 50,
      y,
      size: 11,
      font: fontBold,
      color: darkSlate
    });

    page.drawText(cleanPdfText(`Target Role: ${analysis.roleName}`), {
      x: 320,
      y,
      size: 11,
      font: fontBold,
      color: primaryColor
    });

    // Score Summary Box
    y -= 50;
    page.drawRectangle({
      x: 50,
      y,
      width: width - 100,
      height: 40,
      color: lightBg,
      borderColor: rgb(0.85, 0.89, 0.95),
      borderWidth: 1
    });

    page.drawText(`Overall Readiness Score: ${analysis.scoreBreakdown.overallScore} / 100`, {
      x: 65,
      y: y + 14,
      size: 13,
      font: fontBold,
      color: primaryColor
    });

    page.drawText(`Confidence: ${analysis.confidenceRating}`, {
      x: 420,
      y: y + 14,
      size: 10,
      font: fontBold,
      color: darkSlate
    });

    // Score Breakdown
    y -= 25;
    page.drawText('Score Breakdown Across 4 Tiers:', {
      x: 50,
      y,
      size: 10,
      font: fontBold,
      color: darkSlate
    });

    y -= 15;
    const { skillCoverage, depthOfExperience, practicalEvidence, educationCertification } = analysis.scoreBreakdown;
    page.drawText(
      cleanPdfText(`* Skill Coverage: ${skillCoverage}/40 pts   * Depth of Experience: ${depthOfExperience}/25 pts   * Practical Evidence: ${practicalEvidence}/20 pts   * Education/Cert: ${educationCertification}/15 pts`),
      {
        x: 50,
        y,
        size: 8.5,
        font: fontRegular,
        color: darkSlate
      }
    );

    // Matched Skills with Evidence
    y -= 30;
    page.drawText(`Validated Matched Skills (${analysis.matchedSkills.length}):`, {
      x: 50,
      y,
      size: 11,
      font: fontBold,
      color: darkSlate
    });

    y -= 15;
    for (const match of analysis.matchedSkills.slice(0, 6)) {
      page.drawText(cleanPdfText(`[MATCH] ${match.skill} (Weight: ${match.taxonomyWeight}/10, ${match.confidence})`), {
        x: 60,
        y,
        size: 9,
        font: fontBold,
        color: primaryColor
      });
      y -= 12;

      const snippet = match.evidenceQuote.length > 90 ? match.evidenceQuote.substring(0, 87) + '...' : match.evidenceQuote;
      page.drawText(cleanPdfText(`   Evidence: "${snippet}"`), {
        x: 60,
        y,
        size: 8,
        font: fontRegular,
        color: grayText
      });
      y -= 14;
    }

    // Missing Critical Skills
    y -= 10;
    page.drawText(`Critical & Important Skill Gaps (${analysis.missingSkills.length}):`, {
      x: 50,
      y,
      size: 11,
      font: fontBold,
      color: rgb(0.85, 0.2, 0.2) // Red
    });

    y -= 15;
    for (const missing of analysis.missingSkills.slice(0, 5)) {
      page.drawText(cleanPdfText(`[GAP] ${missing.skill} - Severity: ${missing.severity} (Taxonomy Weight: ${missing.taxonomyWeight}/10)`), {
        x: 60,
        y,
        size: 9,
        font: fontBold,
        color: darkSlate
      });
      y -= 12;

      const desc = missing.whyItMatters.length > 95 ? missing.whyItMatters.substring(0, 92) + '...' : missing.whyItMatters;
      page.drawText(cleanPdfText(`   Why it matters: ${desc}`), {
        x: 60,
        y,
        size: 8,
        font: fontRegular,
        color: grayText
      });
      y -= 14;
    }

    // Recommended Actions
    y -= 10;
    page.drawText('Recommended Skill Roadmap Actions:', {
      x: 50,
      y,
      size: 10,
      font: fontBold,
      color: darkSlate
    });

    y -= 14;
    for (const item of analysis.whatToLearnNext.slice(0, 3)) {
      page.drawText(cleanPdfText(`-> ${item.actionDescription}`), {
        x: 60,
        y,
        size: 8.5,
        font: fontRegular,
        color: primaryColor
      });
      y -= 12;
    }

    // Footer
    page.drawText('Verified by Industry Skill Intelligence Automated Analysis Pipeline | Confidential', {
      x: 100,
      y: 25,
      size: 8,
      font: fontRegular,
      color: grayText
    });

    return await pdfDoc.save();
  }
}
