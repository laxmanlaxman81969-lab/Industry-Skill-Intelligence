// Interview Session & Persistence Manager
// Manages session lifecycle, anti-bypass persistence across reload, and attempt tracking

import { ActiveInterviewSessionData, InterviewSessionStatus } from './types';
import { InterviewQuestion, QuestionEvaluationResult, IntegrityEvent, SkillLevel } from '../../types';

const SESSION_STORAGE_KEY = 'sih_active_interview_session';

export class SessionManager {
  private static instance: SessionManager;

  private constructor() {}

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  public generateSessionId(): string {
    const today = new Date().toISOString().split('T')[0];
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `INT-${today}-${rand}`;
  }

  public createSession(params: {
    role: string;
    difficulty: SkillLevel;
    questionCount: number;
    questions: InterviewQuestion[];
  }): ActiveInterviewSessionData {
    const session: ActiveInterviewSessionData = {
      sessionId: this.generateSessionId(),
      role: params.role,
      difficulty: params.difficulty,
      questionCount: params.questionCount,
      currentQuestionIndex: 0,
      questions: params.questions,
      activeFollowUpQuestion: null,
      answers: [],
      evaluations: [],
      warningCount: 0,
      integrityEvents: [],
      startedAt: new Date().toISOString(),
      elapsedSeconds: 0,
      status: 'INITIALIZING'
    };

    this.saveSession(session);
    return session;
  }

  public getActiveSession(): ActiveInterviewSessionData | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const parsed: ActiveInterviewSessionData = JSON.parse(raw);

      // Verify not already ended
      if (parsed.status === 'COMPLETED' || parsed.status === 'AUTO_SUBMITTED_INTEGRITY_VIOLATION') {
        return null;
      }
      return parsed;
    } catch (e) {
      return null;
    }
  }

  public saveSession(session: ActiveInterviewSessionData) {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {}
  }

  public updateProgress(
    currentQuestionIndex: number,
    answers: ActiveInterviewSessionData['answers'],
    evaluations: QuestionEvaluationResult[],
    elapsedSeconds: number
  ) {
    const session = this.getActiveSession();
    if (session) {
      session.currentQuestionIndex = currentQuestionIndex;
      session.answers = answers;
      session.evaluations = evaluations;
      session.elapsedSeconds = elapsedSeconds;
      this.saveSession(session);
    }
  }

  public recordIntegrityViolation(
    event: IntegrityEvent,
    isSerious = false,
    maxWarnings = 3
  ): { newWarningCount: number; shouldAutoSubmit: boolean } {
    const session = this.getActiveSession();
    if (!session) {
      return { newWarningCount: 1, shouldAutoSubmit: false };
    }

    session.integrityEvents.push(event);

    // If serious incident (e.g. repeated multiple faces), advance faster
    const increment = isSerious ? 2 : 1;
    session.warningCount += increment;

    // Progressive rule: default 3 strikes (or 2 if severe)
    const shouldAutoSubmit = session.warningCount >= maxWarnings;

    if (shouldAutoSubmit) {
      session.status = 'AUTO_SUBMITTED_INTEGRITY_VIOLATION';
      session.autoSubmitReason =
        event.severity === 'high'
          ? 'Serious interview integrity violation threshold reached.'
          : 'Repeated interview integrity violations detected.';
    }

    this.saveSession(session);
    return {
      newWarningCount: session.warningCount,
      shouldAutoSubmit
    };
  }

  public clearSession() {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {}
  }
}
