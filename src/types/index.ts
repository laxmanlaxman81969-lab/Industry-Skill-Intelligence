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

export interface IntegrityEvent {
  timestamp: string;
  eventType: 'tab_switch' | 'face_not_detected' | 'multiple_faces' | 'excessive_inactivity' | 'audio_noise';
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface InterviewQuestion {
  id: string;
  category: 'Introduction' | 'Technical' | 'Projects' | 'Coding' | 'Scenario-based' | 'Behavioral' | 'HR';
  skillTested: string;
  difficulty: SkillLevel;
  question: string;
  idealAnswerKeyPoints: string[];
  claimedSkillCheck?: boolean;
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
}
