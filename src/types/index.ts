export type UserRole = 'student' | 'company' | 'college' | 'admin';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type TrendDirection = 'Growing' | 'Stable' | 'Declining';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  accountStatus?: 'active' | 'inactive' | 'suspended';
  authProvider?: 'local' | 'google';
  providerUserId?: string;
  lastLogin?: string;
}

export interface StudentSkill {
  name: string;
  category: string;
  level: SkillLevel;
  verified: boolean;
  verifiedSource?: 'resume' | 'assignment' | 'interview' | 'self';
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  college: string;
  degree: string;
  branch: string;
  currentYear: string;
  graduationYear: string;
  targetRole: string;
  targetCompany?: string;
  hasResume: boolean;
  resumeFileName?: string;
  resumeScore?: number;
  resumeBreakdown?: {
    skillsRelevance: number;
    projectRelevance: number;
    education: number;
    experience: number;
    keywordCoverage: number;
    structure: number;
  };
  resumeStrengths?: string[];
  resumeWeaknesses?: string[];
  resumeImprovements?: string[];
  skills: StudentSkill[];
  overallReadiness: number;
  onboardingComplete: boolean;
}

export interface IndustrySkill {
  id: string;
  name: string;
  category: 'Language' | 'Frontend' | 'Backend' | 'Database' | 'Core CS' | 'AI/ML' | 'Cloud/DevOps' | 'Tools' | 'Security';
  role: string;
  industry: string;
  demandScore: number; // 0-100%
  totalObservations: number;
  trend: TrendDirection;
  source: string;
  lastUpdated: string;
  importance: 'Critical' | 'High' | 'Medium';
  whyItMatters: string;
}

export interface CompanyProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  industry: string;
  companySize: string;
  website: string;
  location: string;
  logo: string;
  description: string;
}

export interface JobRequirement {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  role: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Remote' | 'Internship to Full-time';
  experience: string;
  package: string;
  description: string;
  requiredSkills: {
    skill: string;
    level: SkillLevel;
    weight: number; // 1-10
  }[];
  minReadinessScore: number;
  postedDate: string;
  applicantsCount: number;
  preferredSkills?: ({
    skill: string;
    level?: SkillLevel;
    weight?: number;
  } | string)[];
  educationRequirements?: string | string[];
  responsibilities?: string[];
  otherRequirements?: string[];
}

export interface ResumeRecord {
  id: string;
  studentId: string;
  fileHash?: string;
  fileName: string;
  fileSize?: number;
  fileMimeType?: string;
  originalFileType: string;
  uploadDate: string;
  lastAnalyzed: string | null;
  processingStatus: 'Parsed successfully' | 'Processing' | 'Failed';
  parsingStatus: 'Completed' | 'Pending' | 'Failed';
  targetRole?: string;
  targetOpportunityId?: string;
  latestAnalysisId?: string;
  latestAtsScore?: number;
  latestSkillGapScore?: number;
  analysesHistory?: ResumeAnalysisRecord[];
  extractedSkills: string[];
  extractedSummary: string;
  resumeText: string;
  structuredExtraction?: {
    extractionVersion?: number;
    candidateName: string;
    contactInfo?: { email?: string; phone?: string; location?: string };
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
    education: { degree: string; institution: string; year: string }[];
    certifications: string[];
    projects: { name: string; description: string; techStack: string[] }[];
    skillsClaimed: {
      skill: string;
      originalSkill?: string;
      normalizedSkill: string;
      evidenceSnippet: string;
      confidence: 'explicit' | 'inferred';
      verifiedInText: boolean;
      hasPracticalEvidence?: boolean;
    }[];
  };
  metadata: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    summary?: string;
    education?: string[];
    experience?: string[];
    technicalSkills?: string[];
    softSkills?: string[];
    projects?: string[];
    certifications?: string[];
    achievements?: string[];
    languages?: string[];
    tools?: string[];
  };
}

export interface ResumeAnalysisRecord {
  id: string;
  studentId: string;
  resumeId: string;
  resumeName: string;
  opportunityId: string;
  opportunityTitle: string;
  companyName: string;
  skillGapScore: number;
  atsScore: number;
  analyzedAt: string;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface CollegeProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  universityAffiliation: string;
  location: string;
  accreditation: string;
  totalStudents: number;
}

export interface CurriculumCourse {
  code: string;
  title: string;
  semester: number;
  taughtSkills: string[];
  industryAlignmentScore: number;
  status: 'Aligned' | 'Needs Update' | 'Outdated';
  recommendedUpdates: string[];
}

export interface RoadmapStep {
  id: string;
  stepNumber: number;
  title: string;
  category: string;
  skillsCovered: string[];
  currentLevel: string;
  targetLevel: string;
  industryDemand: number;
  whyYouNeedIt: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  resources: {
    title: string;
    type: 'Documentation' | 'Course' | 'Interactive' | 'Article';
    url: string;
    duration: string;
  }[];
  practiceTask: string;
  suggestedProject: string;
  status: 'locked' | 'in-progress' | 'completed';
}

export interface Assignment {
  id: string;
  title: string;
  targetSkill: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  description: string;
  requirements: string[];
  skillsTested: string[];
  starterCode?: string;
  expectedOutputHint?: string;
  completed?: boolean;
  score?: number;
  feedback?: {
    technicalCorrectness: number;
    conceptUnderstanding: number;
    codeQuality: number;
    problemSolving: number;
    whatYouDidWell: string[];
    whatToImprove: string[];
    whatToLearnNext: string[];
  };
}

export type IntegrityEventType =
  | 'tab_switch'
  | 'window_blur'
  | 'fullscreen_exit'
  | 'face_not_detected'
  | 'multiple_faces'
  | 'sustained_off_screen_attention'
  | 'looking_away'
  | 'camera_covered'
  | 'camera_interruption'
  | 'mic_interruption'
  | 'copy_attempt'
  | 'paste_attempt'
  | 'possible_additional_voice'
  | 'interview_page_exit'
  | 'excessive_inactivity'
  | 'audio_noise'
  | 'eyes_closed';

export interface IntegrityEvent {
  incidentId?: string;
  interviewId?: string;
  candidateId?: string;
  timestamp: string;
  questionId?: string;
  questionNumber?: number;
  eventType: IntegrityEventType;
  description: string;
  severity: 'low' | 'medium' | 'high';
  confidence?: number;
  duration?: number;
  actionTaken?: string;
}

export interface QuestionEvaluationResult {
  questionId: string;
  questionNumber: number;
  questionText: string;
  category: string;
  skillTested: string;
  studentAnswer: string;
  expectedSkills: string[];
  technicalScore: number;
  conceptUnderstandingScore: number;
  completenessScore: number;
  communicationScore: number;
  relevanceScore: number;
  confidenceScore: number;
  overallScore: number;
  evaluationSummary: string;
  isFollowUp?: boolean;
  parentQuestionId?: string;
  timeSpentSeconds: number;
  matchedKeyPoints?: string[];
  missingKeyPoints?: string[];
}

export interface InterviewQuestion {
  id: string;
  category: 'Introduction' | 'Technical' | 'Projects' | 'Coding' | 'Scenario-based' | 'Behavioral' | 'HR';
  skillTested: string;
  difficulty: SkillLevel;
  question: string;
  idealAnswerKeyPoints: string[];
  claimedSkillCheck?: boolean;
  role?: string;
  format?: 'technical' | 'behavioral' | 'scenario' | 'practical';
  expectedSkills?: string[];
  evaluationPoints?: string[];
  followUpTopics?: string[];
}

export interface InterviewResult {
  id: string;
  role: string;
  difficulty: SkillLevel;
  date: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  confidenceScore: number;
  answerRelevanceScore: number;
  skillVerificationScore: number;
  conceptUnderstandingScore?: number;
  roleSpecificScore?: number;
  integrityRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  integrityRiskScore: number; // 0-100
  integrityWarningsCount: number;
  integrityLog: IntegrityEvent[];
  claimedSkillsAnalysis: {
    skill: string;
    claimedLevel: SkillLevel;
    demonstratedLevel: SkillLevel | 'Unproven';
    status: 'Verified' | 'Skill Verification Concern' | 'Needs Practice';
    notes: string;
  }[];
  strengths: string[];
  areasOfImprovement: string[];
  roleReadiness?: number;
  industrySkillMatch?: number;
  questionCount?: number;
  interviewFocus?: string;
  durationSeconds?: number;
  followUpsCount?: number;
  questionEvaluations?: QuestionEvaluationResult[];
  skillWisePerformance?: {
    skill: string;
    score: number;
    benchmark: number;
    status: 'Strong' | 'Adequate' | 'Needs Improvement';
  }[];
  roadmapRecommendation?: {
    recommendedSkill: string;
    reason: string;
    actionLabel: string;
  };
  opportunityId?: string;
  opportunityTitle?: string;
  opportunityCompany?: string;
  completionStatus?: 'COMPLETED_NORMALLY' | 'AUTO_SUBMITTED_INTEGRITY_VIOLATION' | 'TERMINATED_TECHNICAL_FAILURE';
  integrityStatus?: 'Normal' | 'Warning' | 'Review Required';
  seriousIncidentsCount?: number;
}

// ============================================================================
// AI RESUME & SKILL INTELLIGENCE TYPES
// ============================================================================

export interface ExtractedSkillItem {
  name: string;
  category: string;
  level: 'Not Detected' | 'Beginner' | 'Intermediate' | 'Advanced';
  evidence: string;
  confidence: number; // 0-100
  occurrences: number;
}

export interface IndustrySkillComparison {
  skill: string;
  category: string;
  studentLevel: 'Not Detected' | 'Beginner' | 'Intermediate' | 'Advanced';
  requiredLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  matchStatus: 'Strong Match' | 'Good Match' | 'Skill Gap' | 'Critical Gap';
  industryDemand: 'Critical' | 'High' | 'Growing' | 'Stable';
  demandScore: number;
  importance: 'Critical' | 'High' | 'Medium';
}

export interface SkillGapItem {
  skill: string;
  category: string;
  currentLevel: string;
  requiredLevel: string;
  currentPct: number;
  requiredPct: number;
  gapPct: number;
  industryDemand: string;
  priority: 'Critical' | 'High' | 'Moderate' | 'Aligned';
  whyItMatters: string;
}

export interface ExtractedProject {
  title: string;
  technologies: string[];
  relevance: 'High' | 'Moderate' | 'Low';
  technicalDepth: 'Strong' | 'Moderate' | 'Basic';
  industryAlignment: 'Strong' | 'Good' | 'Fair';
  missingEvidence: string[];
  recommendedImprovement: string;
  descriptionSnippet: string;
}

export interface ExtractedExperience {
  hasExperience: boolean;
  roleTitle?: string;
  company?: string;
  duration?: string;
  roleRelevance?: 'High' | 'Moderate' | 'Low';
  technologyAlignment?: 'Strong' | 'Moderate' | 'Basic';
  skillCoverage?: number;
  missingSkills?: string[];
  guidanceNotes?: string;
}

export interface ExtractedEducation {
  degree: string;
  institution: string;
  branch: string;
  year?: string;
  relevance: 'High' | 'Moderate';
  coursework?: string[];
  certifications: { title: string; issuer?: string; relevance: string }[];
}

export interface ResumeQualityBreakdown {
  overallScore: number;
  skillsRelevance: number;
  projectStrength: number;
  technicalDepth: number;
  experienceRelevance: number;
  resumeStructure: number;
  keywordRelevance: number;
  formattingStatus: 'Good' | 'Needs Improvement';
  actionVerbsQuality: 'Strong' | 'Moderate' | 'Needs Improvement';
  quantifiableAchievements: 'Strong' | 'Limited' | 'Needs Improvement';
  improvements: string[];
  strengths: string[];
  areasToImprove: string[];
  summaryExplanation: string;
}

export interface CareerReadinessBreakdown {
  overall: number;
  technicalSkills: number;
  industryAlignment: number;
  projectReadiness: number;
  interviewReadiness: number;
  resumeStrength: number;
  verdictSummary: string;
}

export interface AIRecommendation {
  priority: number;
  title: string;
  skill: string;
  reason: string;
  priorityLevel: 'High' | 'Medium' | 'Low';
  suggestedAction: string;
  actionType: 'roadmap' | 'assignment' | 'interview';
}

export interface CandidateContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  github?: string;
  linkedin?: string;
}

export interface GranularScoreBreakdown {
  contentQuality: { score: number; max: 20 };
  skillsRelevance: { score: number; max: 20 };
  projectStrength: { score: number; max: 20 };
  experienceRelevance: { score: number; max: 15 };
  education: { score: number; max: 10 };
  technicalEvidence: { score: number; max: 10 };
  keywordCoverage: { score: number; max: 10 };
  resumeCompleteness: { score: number; max: 15 };
  totalScore: number; // /100
}

export interface VisualSkillMatrixRow {
  skill: string;
  category: string;
  evidenceQuality: 'Strong Evidence' | 'Moderate Evidence' | 'Weak Evidence' | 'Mentioned Only' | 'Not Detected';
  evidenceSnippet: string;
  currentLevel: 'Advanced' | 'Intermediate' | 'Beginner' | 'Not Detected';
  requiredLevel: 'Intermediate' | 'Advanced';
  industryDemand: string;
  demandScore: number;
  gapStatus: 'Strong' | 'Matched' | 'Low Gap' | 'Medium Gap' | 'High Gap' | 'Critical Gap';
  priorityScore: number; // 0-100
}

export interface DetectedRoleSuggestion {
  detectedRole: string;
  confidence: number;
  matchedKeywords: string[];
  alternativeRoles: { role: string; confidence: number }[];
}

export interface TopSkillToDevelop {
  rank: number;
  skill: string;
  priority: 'Critical' | 'High' | 'Medium';
  priorityScore: number;
  whyItMatters: string;
  whatIsMissing: string;
  recommendedAction: string;
}

export interface ResumeCompatibilityReport {
  targetRole: string;
  keywordCoveragePct: number;
  detectedKeywords: string[];
  missingCriticalKeywords: string[];
  recommendations: string[];
}

export interface ResumeAnalysisResult {
  id: string;
  date: string;
  fileName: string;
  fileSize: string;
  rawText?: string;
  candidateInfo: CandidateContactInfo;
  detectedRoleSuggestion?: DetectedRoleSuggestion;
  targetRole: string;
  targetCompany?: string;
  resumeScore: number;
  granularScores: GranularScoreBreakdown;
  scoreBreakdown: ResumeQualityBreakdown;
  careerReadiness: CareerReadinessBreakdown;
  industrySkillMatch: number;
  extractedSkills: ExtractedSkillItem[];
  visualSkillMatrix: VisualSkillMatrixRow[];
  industryAlignment: IndustrySkillComparison[];
  skillGaps: {
    critical: SkillGapItem[];
    highPriority: SkillGapItem[];
    moderate: SkillGapItem[];
    aligned: SkillGapItem[];
  };
  topSkillsToDevelop: TopSkillToDevelop[];
  compatibility: ResumeCompatibilityReport;
  projects: ExtractedProject[];
  experience: ExtractedExperience;
  education: ExtractedEducation;
  recommendations: AIRecommendation[];
  roadmapMilestones: { stepNumber: number; title: string; skill: string; difficulty: string }[];
  recommendedAssignment: { id: string; title: string; skills: string[]; difficulty: string };
  interviewFocusAreas: string[];
  profileImpact: {
    before: { skillsCount: number; gapsCount: number; readiness: number };
    after: { skillsCount: number; gapsCount: number; readiness: number };
  };
}


