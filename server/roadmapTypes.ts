export type RoadmapProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'LOCKED';

export interface RoadmapLesson {
  id: string;
  title: string;
  summary: string;
  introduction: string;
  whyItMatters: string;
  howItWorks: string;
  syntax?: string;
  realWorldUsage: string;
  estimatedMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  objectives: string[];
  examples: { language: string; code: string; explanation: string }[];
  commonMistakes: string[];
  bestPractices: string[];
  importantPoints: string[];
  interviewQuestions: string[];
  practice: { title: string; problem: string; expectedOutput?: string }[];
  miniChallenge: string;
  relatedTopics: string[];
}

export interface RoadmapTopic {
  id: string;
  title: string;
  description: string;
  prerequisites: string[];
  lessons: RoadmapLesson[];
}

export interface RoadmapModule {
  id: string;
  title: string;
  level: 'FOUNDATION' | 'CORE' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL';
  description: string;
  topics: RoadmapTopic[];
}

export interface RoadmapProject {
  id: string;
  title: string;
  difficulty: 'Mini' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Capstone';
  problemStatement: string;
  skillsRequired: string[];
  deliverables: string[];
}

export interface RoadmapAssessment {
  id: string;
  title: string;
  questions: { id: string; question: string; options: string[]; answer: string; explanation: string }[];
}

export interface TechnologyRoadmap {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDuration: string;
  prerequisites: string[];
  careerPaths: string[];
  overview: {
    whatItIs: string;
    whyUsed: string;
    whereUsed: string;
    whatYouCanBuild: string[];
    learningOutcome: string;
    relatedTechnologies: string[];
  };
  modules: RoadmapModule[];
  projects?: RoadmapProject[];
  assessment?: RoadmapAssessment;
  updatedAt: string;
}

export interface UserRoadmapProgress {
  userId: string;
  technologyId: string;
  lessonIds: string[];
  completedTopicIds: string[];
  completedProjectIds: string[];
  lastLessonId?: string;
  bookmarkedLessonIds: string[];
  notes: Record<string, string>;
  assessmentAttempts: { assessmentId: string; score: number; completedAt: string }[];
  lastAccessedAt?: string;
}