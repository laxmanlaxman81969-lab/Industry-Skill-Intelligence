// AI Video Mock Interview Types & Interfaces

import {
  InterviewQuestion,
  QuestionEvaluationResult,
  IntegrityEvent,
  IntegrityEventType,
  SkillLevel,
  StudentProfile,
  IndustrySkill
} from '../../types';

export type InterviewSessionStatus =
  | 'CONFIG'
  | 'SYSTEM_CHECK'
  | 'INITIALIZING'
  | 'AI_INTRODUCTION'
  | 'AI_SPEAKING'
  | 'LISTENING'
  | 'ANALYZING_RESPONSE'
  | 'FOLLOW_UP'
  | 'NEXT_QUESTION'
  | 'COMPLETED'
  | 'AUTO_SUBMITTED_INTEGRITY_VIOLATION';

export type InterviewerVisualState =
  | 'IDLE'
  | 'SPEAKING'
  | 'LISTENING'
  | 'THINKING'
  | 'FOLLOW_UP'
  | 'PROCESSING_ANSWER'
  | 'CONNECTION_ISSUE';

export interface InterviewerPersona {
  id: string;
  name: string;
  title: string;
  imageSrc: string;
  voiceGender: 'female' | 'male';
  voicePitch: number;
  voiceRate: number;
  bio: string;
}

export interface InterviewContextMemory {
  role: string;
  candidateName: string;
  topicsCovered: string[];
  demonstratedStrengths: string[];
  identifiedGaps: string[];
  questionsAnsweredCount: number;
  followUpCount: number;
  currentDifficulty: SkillLevel;
  lastCandidateAnswerKeywords: string[];
  transcriptHistory: {
    speaker: 'AI' | 'Candidate';
    text: string;
    timestamp: string;
  }[];
}

export interface AccessibilityOptions {
  gazeAccommodations: boolean;
  reducedMotion: boolean;
  captionsEnabled: boolean;
  relaxedTimeouts: boolean;
}

export interface ActiveInterviewSessionData {
  sessionId: string;
  role: string;
  difficulty: SkillLevel;
  questionCount: number;
  currentQuestionIndex: number;
  questions: InterviewQuestion[];
  activeFollowUpQuestion: InterviewQuestion | null;
  answers: {
    questionId: string;
    questionText: string;
    category: string;
    skillTested: string;
    answerText: string;
    timeSpentSeconds: number;
  }[];
  evaluations: QuestionEvaluationResult[];
  warningCount: number;
  integrityEvents: IntegrityEvent[];
  startedAt: string;
  elapsedSeconds: number;
  status: InterviewSessionStatus;
  autoSubmitReason?: string;
  interviewerPersonaId?: string;
  contextMemory?: InterviewContextMemory;
  accessibility?: AccessibilityOptions;
}

export interface CameraHealthState {
  cameraConnected: boolean;
  cameraTrackActive: boolean;
  cameraResolution: { width: number; height: number };
  microphoneConnected: boolean;
  microphoneTrackActive: boolean;
  audioInputLevel: number;
  errorMessage?: string;
}

export interface IntegrityViolationCheckResult {
  isViolation: boolean;
  eventType: IntegrityEventType;
  description: string;
  severity: 'low' | 'medium' | 'high';
  shouldWarn: boolean;
  shouldAutoSubmit: boolean;
  warningMessage?: string;
  durationSeconds?: number;
}
