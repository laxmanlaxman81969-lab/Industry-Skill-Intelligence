// Backend types for the AI Skill Analyzer pipeline

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Not Detected';
export type SkillImportance = 'Critical' | 'High' | 'Medium';
export type AnalysisConfidence = 'High' | 'Medium' | 'Low';
export type PipelineStatus =
  | 'UPLOADED'
  | 'PARSING'
  | 'OCR_PROCESSING'
  | 'PARSED'
  | 'AI_EXTRACTING'
  | 'AI_RETRYING'
  | 'EXTRACTED'
  | 'COMPARING'
  | 'SCORING'
  | 'SAVING'
  | 'COMPLETED'
  | 'FAILED'
  | 'LOW_CONFIDENCE';

export interface RoleSkillDef {
  skill: string;
  normalizedSkill: string;
  weight: number; // 1-10
  category: string;
  importance: SkillImportance;
  description: string;
  keywords: string[];
}

export interface NiceToHaveSkillDef {
  skill: string;
  normalizedSkill: string;
  weight: number; // 1-10
  category: string;
  description: string;
}

export interface SenioritySignalDef {
  signal: string;
  description: string;
  weight: number;
}

export interface RoleTaxonomyRecord {
  roleId: string;
  roleName: string;
  category: string;
  description: string;
  taxonomyVersion: string;
  lastUpdated: string; // ISO or YYYY-MM-DD
  active: boolean;
  coreSkills: RoleSkillDef[];
  niceToHaveSkills: NiceToHaveSkillDef[];
  senioritySignals: SenioritySignalDef[];
  criticalKeywords: string[];
  defaultRoadmap: { stepNumber: number; title: string; skill: string; difficulty: string }[];
}

export interface ParsedResumeDocument {
  fileHash: string;
  fileName: string;
  fileSize: number;
  fileMimeType: string;
  extractedText: string;
  wordCount: number;
  extractionMethod:
    | 'text-direct'
    | 'pdf-parse'
    | 'mammoth-docx'
    | 'tesseract-ocr'
    | 'rtf-parser'
    | 'odt-parser'
    | 'html-parser'
    | 'doc-parser'
    | 'url-extractor';
  ocrUsed: boolean;
  ocrConfidence?: number;
  sourceType?: 'file' | 'url';
  sourceUrl?: string;
  extractionQuality?: 'High' | 'Medium' | 'Low';
  detectedSections: {
    summary?: string;
    experience?: string;
    education?: string;
    skills?: string;
    projects?: string;
    certifications?: string;
  };
  detectedLanguage: string;
  isLanguageSupported: boolean;
  parsedAt: string;
}

export interface ClaimedSkillItem {
  skill: string;
  originalSkill?: string;
  normalizedSkill: string;
  evidenceSnippet: string;
  confidence: 'explicit' | 'inferred';
  verifiedInText: boolean;
  sourceSection?: string;
  hasPracticalEvidence?: boolean; // Appears in projects or work experience
}

export interface ClaudeStructuredExtraction {
  extractionVersion?: number;
  candidateName: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    location?: string;
  };
  summary?: string;
  achievements?: string[];
  languages?: string[];
  totalYearsExperience: number;
  currentRole: string;
  workHistory: {
    company: string;
    title: string;
    duration: string;
    responsibilities: string[];
    technologiesUsed: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  certifications: string[];
  projects: {
    name: string;
    description: string;
    techStack: string[];
  }[];
  skillsClaimed: ClaimedSkillItem[];
}

export interface MatchedSkillResult {
  skill: string;
  normalizedSkill: string;
  taxonomyWeight: number; // 1-10
  confidence: 'explicit' | 'inferred';
  evidenceQuote: string;
  practicalEvidence: boolean;
  sourceSection: string;
  category: string;
}

export interface MissingSkillResult {
  skill: string;
  normalizedSkill: string;
  taxonomyWeight: number;
  severity: 'Critical' | 'Important' | 'Minor'; // 8-10 Critical, 5-7 Important, 1-4 Minor
  whyItMatters: string;
  category: string;
  roadmapAction: string;
}

export interface PartiallyCoveredSkillResult {
  skill: string;
  normalizedSkill: string;
  taxonomyWeight: number;
  evidenceQuote: string;
  reason: string; // e.g. "Inferred without hands-on project implementation"
  recommendedImprovement: string;
  category: string;
}

export interface IrrelevantSkillResult {
  skill: string;
  evidenceQuote: string;
  confidence: 'explicit' | 'inferred';
}

export interface AtsBreakdown {
  score: number; // 0-100
  status: 'Strong ATS Pass' | 'Competitive ATS Pass' | 'Needs Optimization';
  contactInfoScore: number; // /10
  structureScore: number; // /10
  sectionClarityScore: number; // /10
  skillsPresentationScore: number; // /10
  experienceClarityScore: number; // /15
  projectClarityScore: number; // /15
  educationScore: number; // /10
  formattingScore: number; // /10
  readabilityScore: number; // /10
  sectionsPassed: { name: string; passed: boolean }[];
  strengths: string[];
  issues: string[];
  parsingRisks: string[];
  formattingRecommendations: string[];
}

export interface SkillGapScoreBreakdown {
  score: number; // 0-100%
  status: 'High Match' | 'Moderate Gap' | 'Significant Gap';
  requiredSkillsTotal: number;
  requiredSkillsMatched: number;
  preferredSkillsTotal: number;
  preferredSkillsMatched: number;
  criticalMissingCount: number;
  partialMatchesCount: number;
  matchPercentage: number;
  explanation: string;
}

export interface ScoreBreakdown {
  overallScore: number; // 0-100
  skillCoverage: number; // 0-40 (40%)
  depthOfExperience: number; // 0-25 (25%)
  practicalEvidence: number; // 0-20 (20%)
  educationCertification: number; // 0-15 (15%)
  calculationExplanation: {
    skillCoverageFormula: string;
    depthFormula: string;
    practicalFormula: string;
    educationFormula: string;
  };
}

export interface AnalysisRecord {
  analysisId: string;
  userId: string;
  fileHash: string;
  fileName: string;
  fileSize: number;
  roleId: string;
  roleName: string;
  taxonomyVersion: string;
  benchmarkRefreshDate: string;
  status: PipelineStatus;
  confidenceRating: AnalysisConfidence;
  confidenceExplanation: string;
  warnings: string[];
  scoreBreakdown: ScoreBreakdown;
  matchedSkills: MatchedSkillResult[];
  missingSkills: MissingSkillResult[];
  partialSkills: PartiallyCoveredSkillResult[];
  uncertainSkills?: { skill: string; reason: string; evidenceQuote: string }[];
  irrelevantSkills: IrrelevantSkillResult[];
  atsScore?: AtsBreakdown;
  skillGapScore?: SkillGapScoreBreakdown;
  whatToLearnNext: {
    skill: string;
    severity: 'Critical' | 'Important' | 'Minor';
    priority: number;
    roadmapSkill: string;
    actionDescription: string;
  }[];
  candidateName: string;
  extractionSummary: {
    totalYearsExperience: number;
    educationSummary: string;
    projectCount: number;
    certificationsCount: number;
    totalClaimedSkills: number;
    verifiedSkillsCount: number;
  };
  // Verified facts extracted from the uploaded resume. This is intentionally
  // separate from matched/missing opportunity skills.
  structuredExtraction?: ClaudeStructuredExtraction;
  extractedResumeText?: string;
  fileMimeType?: string;
  ocrUsed: boolean;
  ocrConfidence?: number;
  extractionMethod?: string;
  extractionQuality?: 'High' | 'Medium' | 'Low';
  sourceType?: 'file' | 'url';
  sourceUrl?: string;
  detectedLanguage: string;
  isCachedParse: boolean;
  isDemoMode?: boolean;
  createdAt: string;
  updatedAt: string;

  // ── Opportunity context (set when analyzed against a specific job card) ──
  opportunityId?: string;
  opportunityTitle?: string;
  opportunityCompany?: string;
  opportunityRequiredSkills?: string[];       // Raw skill names from the opportunity
  opportunityPreferredSkills?: string[];
  opportunityDescription?: string;
  // Opportunity-specific overlap computed from the actual resume extraction
  opportunityMatchedSkills?: string[];
  opportunityMissingSkills?: string[];
  opportunityPartialSkills?: string[];
}

/** Persistent server-side resume record — one entry per fileHash per user */
export interface ServerResumeRecord {
  resumeId: string;          // "resume-<fileHash>"
  userId: string;
  fileHash: string;
  fileName: string;
  fileSize: number;
  fileMimeType: string;
  uploadedAt: string;        // ISO
  lastAnalyzedAt: string | null;
  latestAnalysisId: string | null;
  latestAtsScore: number | null;
  latestSkillGapScore: number | null;
  candidateName: string | null;
  detectedSkillsCount: number;
  projectCount: number;
  experienceCount: number;
  analysisIds: string[];     // Newest first
}


export interface LLMLogRecord {
  id: string;
  analysisId: string;
  model: string;
  promptVersion: string;
  durationMs: number;
  retryCount: number;
  tokenUsage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  errorDetails?: string;
  createdAt: string;
}

/** Server-side representation of a job opportunity — mirrors the frontend JobRequirement type */
export interface JobOpportunityRecord {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  role: string;
  location: string;
  type: string;
  experience: string;
  package: string;
  description: string;
  requiredSkills: { skill: string; level: string; weight: number }[];
  preferredSkills?: string[];
  educationRequirements?: string[];
  responsibilities?: string[];
  otherRequirements?: string[];
  minReadinessScore: number;
  postedDate: string;
  applicantsCount: number;
}
