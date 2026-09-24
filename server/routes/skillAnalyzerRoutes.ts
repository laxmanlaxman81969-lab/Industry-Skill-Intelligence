// REST API Routes for AI Skill Analyzer
// Endpoints for real upload, parsing, Claude extraction, comparison, fast recompare, history, and PDF download

import { Router, Request, Response } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { Database } from '../db/database';
import { FileParserService } from '../services/fileParserService';
import { ClaudeExtractionService } from '../services/claudeExtractionService';
import { ComparisonEngine } from '../services/comparisonEngine';
import { ScoringService } from '../services/scoringService';
import { PDFReportService } from '../services/pdfReportService';
import { AnalysisRecord, ServerResumeRecord } from '../types';

export const skillAnalyzerRouter = Router();

// Configure Multer for in-memory file uploads (max 10MB)
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = (file.originalname.split('.').pop() || '').toLowerCase();
    const allowed = ['pdf', 'docx', 'doc', 'txt', 'png', 'jpg', 'jpeg', 'webp'];
    if (allowed.includes(ext) || file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Please upload PDF, DOCX, DOC, TXT, PNG, JPG, or WEBP.'));
    }
  }
});

const db = Database.getInstance();
const parserService = FileParserService.getInstance();
const claudeService = ClaudeExtractionService.getInstance();

// Helper: compute opportunity-specific skill overlap from extracted skills vs opportunity skill list
function computeOpportunityOverlap(
  extractedSkillNames: string[],
  requiredSkills: string[],
  preferredSkills: string[]
): { matched: string[]; missing: string[]; partial: string[] } {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const extractedNorm = extractedSkillNames.map(normalize);

  const matched: string[] = [];
  const missing: string[] = [];
  const partial: string[] = [];

  for (const req of requiredSkills) {
    const norm = normalize(req);
    if (extractedNorm.some((e) => e === norm || e.includes(norm) || norm.includes(e))) {
      matched.push(req);
    } else {
      // Check for partial word overlap
      const reqWords = norm.split(/\s+/);
      const hasPartial = extractedNorm.some((e) => reqWords.some((w) => w.length > 2 && e.includes(w)));
      if (hasPartial) {
        partial.push(req);
      } else {
        missing.push(req);
      }
    }
  }

  return { matched, missing, partial };
}

// Helper: auto-build or update a ServerResumeRecord from an analysis
function buildOrUpdateResumeRecord(
  existing: ServerResumeRecord | null,
  analysis: AnalysisRecord
): ServerResumeRecord {
  const userId = (analysis.userId || 'default_user').toLowerCase();
  const resumeId = `resume-${analysis.fileHash}-${userId}`;
  const extraction = analysis.structuredExtraction;
  const now = new Date().toISOString();

  if (existing) {
    const updatedIds = [analysis.analysisId, ...existing.analysisIds.filter((id) => id !== analysis.analysisId)];
    return {
      ...existing,
      lastAnalyzedAt: now,
      latestAnalysisId: analysis.analysisId,
      latestAtsScore: analysis.atsScore?.score ?? existing.latestAtsScore,
      latestSkillGapScore: analysis.skillGapScore?.score ?? existing.latestSkillGapScore,
      candidateName: extraction?.candidateName || existing.candidateName,
      detectedSkillsCount: analysis.extractionSummary.verifiedSkillsCount || existing.detectedSkillsCount,
      projectCount: analysis.extractionSummary.projectCount || existing.projectCount,
      experienceCount: extraction?.workHistory?.length ?? existing.experienceCount,
      analysisIds: updatedIds.slice(0, 50) // cap at 50 analyses per resume
    };
  }

  return {
    resumeId,
    userId,
    fileHash: analysis.fileHash,
    fileName: analysis.fileName,
    fileSize: analysis.fileSize || 0,
    fileMimeType: analysis.fileMimeType || 'application/pdf',
    uploadedAt: now,
    lastAnalyzedAt: now,
    latestAnalysisId: analysis.analysisId,
    latestAtsScore: analysis.atsScore?.score ?? null,
    latestSkillGapScore: analysis.skillGapScore?.score ?? null,
    candidateName: extraction?.candidateName || null,
    detectedSkillsCount: analysis.extractionSummary.verifiedSkillsCount || 0,
    projectCount: analysis.extractionSummary.projectCount || 0,
    experienceCount: extraction?.workHistory?.length ?? 0,
    analysisIds: [analysis.analysisId]
  };
}

// 1. GET /api/skill-analyzer/status
skillAnalyzerRouter.get('/status', (_req: Request, res: Response) => {
  res.json({
    success: true,
    claudeConfigured: claudeService.isConfigured(),
    totalTaxonomies: db.getTaxonomies().length,
    totalAnalysesStored: db.getTotalAnalysesCount()
  });
});

// 2. GET /api/skill-analyzer/roles
skillAnalyzerRouter.get('/roles', (_req: Request, res: Response) => {
  const taxonomies = db.getTaxonomies();
  const roles = taxonomies.map((t) => ({
    roleId: t.roleId,
    roleName: t.roleName,
    category: t.category,
    description: t.description,
    taxonomyVersion: t.taxonomyVersion,
    lastUpdated: t.lastUpdated,
    coreSkillCount: t.coreSkills.length
  }));
  res.json({ success: true, roles });
});

// 3. GET /api/skill-analyzer/taxonomy/:roleId
skillAnalyzerRouter.get('/taxonomy/:roleId', (req: Request, res: Response) => {
  const taxonomy = db.getTaxonomyByRoleId(req.params.roleId);
  if (!taxonomy) {
    return res.status(404).json({ success: false, error: 'Role taxonomy not found.' });
  }
  res.json({ success: true, taxonomy });
});

// 3b. GET /api/skill-analyzer/opportunities
skillAnalyzerRouter.get('/opportunities', (_req: Request, res: Response) => {
  const opportunities = db.getOpportunities();
  res.json({ success: true, opportunities });
});

// 3c. GET /api/skill-analyzer/opportunities/:id
skillAnalyzerRouter.get('/opportunities/:id', (req: Request, res: Response) => {
  const opportunity = db.getOpportunityById(req.params.id);
  if (!opportunity) {
    return res.status(404).json({ success: false, error: 'Opportunity not found.' });
  }
  res.json({ success: true, opportunity });
});

// 4. POST /api/skill-analyzer/upload
skillAnalyzerRouter.post('/upload', (req: Request, res: Response) => {
  upload.single('resume')(req, res, async (err: any) => {
    if (err) {
      console.warn('[Route: Upload] Multer rejected file:', err.message);
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload failed. Supported formats: PDF, DOCX, DOC, TXT, PNG, JPG, WEBP.'
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded.' });
      }

      const parseResult = await parserService.parseFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      res.json({
        success: true,
        fileHash: parseResult.document.fileHash,
        fileName: parseResult.document.fileName,
        fileSize: parseResult.document.fileSize,
        wordCount: parseResult.document.wordCount,
        isCached: parseResult.isCached,
        message: parseResult.message,
        detectedLanguage: parseResult.document.detectedLanguage,
        isLanguageSupported: parseResult.document.isLanguageSupported,
        ocrUsed: parseResult.document.ocrUsed,
        extractedTextPreview: parseResult.document.extractedText.slice(0, 500)
      });
    } catch (parseErr: any) {
      console.error('[Route: Upload] Parse error:', parseErr);
      res.status(400).json({
        success: false,
        error: parseErr.message || 'File parsing failed. Please check the document format.'
      });
    }
  });
});

// 5. POST /api/skill-analyzer/analyze
skillAnalyzerRouter.post('/analyze', async (req: Request, res: Response) => {
  try {
    const {
      fileHash,
      roleId = 'java-backend-developer',
      userId = 'default_user',
      customText,
      fileName = 'Resume.pdf',
      isDemoMode = false,
      // Opportunity context (optional)
      opportunityId,
      opportunityTitle,
      opportunityCompany,
      opportunityRequiredSkills,
      opportunityPreferredSkills,
      opportunityDescription
    } = req.body;

    let parsedDoc = fileHash ? db.getCachedParse(fileHash) : null;

    // Handle direct text paste if provided
    if (!parsedDoc && customText && customText.trim()) {
      const buffer = Buffer.from(customText.trim(), 'utf-8');
      const parseRes = await parserService.parseFile(buffer, fileName, 'text/plain');
      parsedDoc = parseRes.document;
    }

    if (!parsedDoc) {
      return res.status(400).json({
        success: false,
        error: 'No parsed document found. Please upload a resume first.'
      });
    }

    let finalOppTitle = opportunityTitle;
    let finalOppCompany = opportunityCompany;
    let finalOppReqSkills = opportunityRequiredSkills;
    let finalOppPrefSkills = opportunityPreferredSkills;
    let finalOppDesc = opportunityDescription;
    let effectiveRoleId = roleId;

    if (opportunityId) {
      const oppRecord = db.getOpportunityById(opportunityId);
      if (oppRecord) {
        finalOppTitle = finalOppTitle || oppRecord.title;
        finalOppCompany = finalOppCompany || oppRecord.companyName;
        finalOppReqSkills = (finalOppReqSkills && finalOppReqSkills.length > 0)
          ? finalOppReqSkills
          : oppRecord.requiredSkills.map((s) => s.skill);
        finalOppPrefSkills = (finalOppPrefSkills && finalOppPrefSkills.length > 0)
          ? finalOppPrefSkills
          : (oppRecord.preferredSkills || []);
        finalOppDesc = finalOppDesc || oppRecord.description;

        // Auto-match taxonomy to opportunity role if default role was provided
        if (!roleId || roleId === 'java-backend-developer') {
          const matchedTax = db.getTaxonomyByRoleId(oppRecord.role || oppRecord.title);
          if (matchedTax) {
            effectiveRoleId = matchedTax.roleId;
          }
        }
      }
    }

    const taxonomy = db.getTaxonomyByRoleId(effectiveRoleId);
    if (!taxonomy) {
      return res.status(400).json({ success: false, error: 'Invalid role taxonomy selected.' });
    }

    const analysisId = `an-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    // 1. Check if extraction is already cached for this file hash
    let extraction = db.getExtractionByHash(parsedDoc.fileHash);
    let claudeResultWarnings: string[] = [];

    const requiresExtractionRefresh = !extraction || extraction.extractionVersion !== 2 || extraction.skillsClaimed.some((skill) => !skill.originalSkill);
    if (requiresExtractionRefresh) {
      const claudeResult = await claudeService.extractSkills(
        parsedDoc.extractedText,
        parsedDoc.detectedSections,
        analysisId
      );
      extraction = claudeResult.extraction;
      claudeResultWarnings = claudeResult.warnings;
      db.saveExtraction(parsedDoc.fileHash, extraction);
    } else {
      extraction = claudeService.validateAndVerifyEvidence(extraction, parsedDoc.extractedText);
      db.saveExtraction(parsedDoc.fileHash, extraction);
    }

    // 2. Deterministic Benchmark Comparison against selected role taxonomy
    const comparison = ComparisonEngine.compare(extraction, taxonomy);

    // 3. Transparent 0-100 Score Calculation
    const scoring = ScoringService.calculateScore(
      comparison,
      taxonomy,
      extraction,
      parsedDoc.wordCount
    );

    const allWarnings = [
      ...claudeResultWarnings,
      ...scoring.warnings
    ];

    if (!parsedDoc.isLanguageSupported) {
      allWarnings.push(`This resume appears to be written primarily in ${parsedDoc.detectedLanguage}. Analysis support may vary.`);
    }

    // 4. Compute opportunity-specific skill overlap (when opportunity context is provided)
    let opportunityMatchedSkills: string[] | undefined;
    let opportunityMissingSkills: string[] | undefined;
    let opportunityPartialSkills: string[] | undefined;

    if (finalOppReqSkills && Array.isArray(finalOppReqSkills) && finalOppReqSkills.length > 0) {
      const verifiedSkillNames = extraction.skillsClaimed
        .filter((s) => s.verifiedInText)
        .map((s) => s.originalSkill || s.skill);
      const overlap = computeOpportunityOverlap(
        verifiedSkillNames,
        finalOppReqSkills,
        finalOppPrefSkills || []
      );
      opportunityMatchedSkills = overlap.matched;
      opportunityMissingSkills = overlap.missing;
      opportunityPartialSkills = overlap.partial;
    }

    // 5. Construct Final Persistent Analysis Record
    const analysisRecord: AnalysisRecord = {
      analysisId,
      userId,
      fileHash: parsedDoc.fileHash,
      fileName: parsedDoc.fileName,
      fileSize: parsedDoc.fileSize,
      roleId: taxonomy.roleId,
      roleName: taxonomy.roleName,
      taxonomyVersion: taxonomy.taxonomyVersion,
      benchmarkRefreshDate: taxonomy.lastUpdated,
      status: 'COMPLETED',
      confidenceRating: scoring.confidenceRating,
      confidenceExplanation: scoring.confidenceExplanation,
      warnings: allWarnings,
      scoreBreakdown: scoring.scoreBreakdown,
      atsScore: scoring.atsScore,
      skillGapScore: scoring.skillGapScore,
      matchedSkills: comparison.matchedSkills,
      missingSkills: comparison.missingSkills,
      partialSkills: comparison.partialSkills,
      uncertainSkills: comparison.uncertainSkills,
      irrelevantSkills: comparison.irrelevantSkills,
      whatToLearnNext: comparison.whatToLearnNext,
      candidateName: extraction.candidateName || 'Candidate',
      extractionSummary: {
        totalYearsExperience: extraction.totalYearsExperience,
        educationSummary: extraction.education.map((e) => `${e.degree} from ${e.institution}`).join(', '),
        projectCount: extraction.projects.length,
        certificationsCount: extraction.certifications.length,
        totalClaimedSkills: extraction.skillsClaimed.length,
        verifiedSkillsCount: extraction.skillsClaimed.filter((s) => s.verifiedInText).length
      },
      structuredExtraction: extraction,
      extractedResumeText: parsedDoc.extractedText,
      fileMimeType: parsedDoc.fileMimeType,
      ocrUsed: parsedDoc.ocrUsed,
      detectedLanguage: parsedDoc.detectedLanguage,
      isCachedParse: !!fileHash,
      isDemoMode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Opportunity context
      opportunityId,
      opportunityTitle: finalOppTitle,
      opportunityCompany: finalOppCompany,
      opportunityRequiredSkills: finalOppReqSkills,
      opportunityPreferredSkills: finalOppPrefSkills,
      opportunityDescription: finalOppDesc,
      opportunityMatchedSkills,
      opportunityMissingSkills,
      opportunityPartialSkills
    };

    // 6. Save analysis to Database
    db.saveAnalysis(analysisRecord);

    // 7. Auto-save or update server-side resume record
    const existing = db.getResumeRecordByHash(parsedDoc.fileHash, userId);
    const resumeRecord = buildOrUpdateResumeRecord(existing, analysisRecord);
    db.saveResumeRecord(resumeRecord);

    res.json({
      success: true,
      analysis: analysisRecord
    });
  } catch (err: any) {
    console.error('[Route: Analyze] Error:', err);
    res.status(500).json({
      success: false,
      error: err.message || "Couldn't confidently analyze this resume."
    });
  }
});

// 6. POST /api/skill-analyzer/recompare
skillAnalyzerRouter.post('/recompare', async (req: Request, res: Response) => {
  try {
    const { analysisId, newRoleId, userId = 'default_user' } = req.body;

    const previousAnalysis = db.getAnalysisById(analysisId);
    if (!previousAnalysis) {
      return res.status(404).json({ success: false, error: 'Previous analysis not found.' });
    }

    const parsedDoc = db.getCachedParse(previousAnalysis.fileHash);
    const extraction = db.getExtractionByHash(previousAnalysis.fileHash);

    if (!extraction || !parsedDoc) {
      return res.status(400).json({
        success: false,
        error: 'Extracted resume data not available. Please re-run analysis.'
      });
    }

    const newTaxonomy = db.getTaxonomyByRoleId(newRoleId);
    if (!newTaxonomy) {
      return res.status(400).json({ success: false, error: 'Invalid target role selected.' });
    }

    const comparison = ComparisonEngine.compare(extraction, newTaxonomy);
    const scoring = ScoringService.calculateScore(
      comparison,
      newTaxonomy,
      extraction,
      parsedDoc.wordCount
    );

    const newAnalysisId = `an-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const newRecord: AnalysisRecord = {
      ...previousAnalysis,
      analysisId: newAnalysisId,
      roleId: newTaxonomy.roleId,
      roleName: newTaxonomy.roleName,
      taxonomyVersion: newTaxonomy.taxonomyVersion,
      benchmarkRefreshDate: newTaxonomy.lastUpdated,
      scoreBreakdown: scoring.scoreBreakdown,
      atsScore: scoring.atsScore,
      skillGapScore: scoring.skillGapScore,
      matchedSkills: comparison.matchedSkills,
      missingSkills: comparison.missingSkills,
      partialSkills: comparison.partialSkills,
      uncertainSkills: comparison.uncertainSkills,
      irrelevantSkills: comparison.irrelevantSkills,
      whatToLearnNext: comparison.whatToLearnNext,
      confidenceRating: scoring.confidenceRating,
      confidenceExplanation: scoring.confidenceExplanation,
      warnings: scoring.warnings,
      // Preserve original opportunity context from previous analysis
      opportunityId: previousAnalysis.opportunityId,
      opportunityTitle: previousAnalysis.opportunityTitle,
      opportunityCompany: previousAnalysis.opportunityCompany,
      opportunityRequiredSkills: previousAnalysis.opportunityRequiredSkills,
      opportunityPreferredSkills: previousAnalysis.opportunityPreferredSkills,
      opportunityMatchedSkills: previousAnalysis.opportunityMatchedSkills,
      opportunityMissingSkills: previousAnalysis.opportunityMissingSkills,
      opportunityPartialSkills: previousAnalysis.opportunityPartialSkills,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.saveAnalysis(newRecord);

    // Update resume record
    const existing = db.getResumeRecordByHash(previousAnalysis.fileHash, userId);
    const resumeRecord = buildOrUpdateResumeRecord(existing, newRecord);
    db.saveResumeRecord(resumeRecord);

    res.json({
      success: true,
      analysis: newRecord,
      message: 'Role switched instantly using cached extraction.'
    });
  } catch (err: any) {
    console.error('[Route: Recompare] Error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to switch role comparison.'
    });
  }
});

// 7. GET /api/skill-analyzer/analysis/:analysisId
skillAnalyzerRouter.get('/analysis/:analysisId', (req: Request, res: Response) => {
  const analysis = db.getAnalysisById(req.params.analysisId);
  if (!analysis) {
    return res.status(404).json({ success: false, error: 'Analysis record not found.' });
  }
  res.json({ success: true, analysis });
});

// 8. GET /api/skill-analyzer/history
skillAnalyzerRouter.get('/history', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'default_user';
  const history = db.getUserAnalysisHistory(userId);
  res.json({
    success: true,
    history,
    count: history.length
  });
});

// 9. GET /api/skill-analyzer/analysis/:analysisId/report
skillAnalyzerRouter.get('/analysis/:analysisId/report', async (req: Request, res: Response) => {
  try {
    const analysis = db.getAnalysisById(req.params.analysisId);
    if (!analysis) {
      return res.status(404).json({ success: false, error: 'Analysis not found.' });
    }

    const pdfBuffer = await PDFReportService.generateReport(analysis);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Skill_Analyzer_Report_${analysis.roleId}_${analysis.analysisId.slice(-6)}.pdf"`
    );
    res.send(Buffer.from(pdfBuffer));
  } catch (err: any) {
    console.error('[Route: Report] Error:', err);
    res.status(500).json({ success: false, error: 'Failed to generate PDF report.' });
  }
});

// 10. GET /api/skill-analyzer/resumes  — All resumes for a user (server-persisted)
skillAnalyzerRouter.get('/resumes', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'default_user';
  const resumes = db.getUserResumes(userId);
  res.json({ success: true, resumes, count: resumes.length });
});

// 11. GET /api/skill-analyzer/resume/:fileHash  — Single resume record + all its analyses
skillAnalyzerRouter.get('/resume/:fileHash', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'default_user';
  const record = db.getResumeRecordByHash(req.params.fileHash, userId);
  if (!record) {
    return res.status(404).json({ success: false, error: 'Resume record not found.' });
  }
  const analyses = db.getAnalysesByFileHash(req.params.fileHash);
  res.json({ success: true, resume: record, analyses });
});

// 12. GET /api/skill-analyzer/resume/:fileHash/analyses  — Just the analyses list
skillAnalyzerRouter.get('/resume/:fileHash/analyses', (req: Request, res: Response) => {
  const analyses = db.getAnalysesByFileHash(req.params.fileHash);
  res.json({ success: true, analyses, count: analyses.length });
});

// 13. DELETE /api/skill-analyzer/resume/:resumeId
skillAnalyzerRouter.delete('/resume/:resumeId', (req: Request, res: Response) => {
  const deleted = db.deleteResumeRecord(req.params.resumeId);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Resume record not found.' });
  }
  res.json({ success: true, message: 'Resume record deleted.' });
});