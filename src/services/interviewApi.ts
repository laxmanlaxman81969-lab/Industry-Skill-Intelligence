import { InterviewResult, IntegrityEvent } from '../types';

const API_BASE = '/api/interview';

export class InterviewApi {
  public static async registerSession(params: {
    sessionId: string;
    role: string;
    difficulty: string;
    questionCount: number;
    studentId?: string;
    opportunityId?: string;
  }): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return res.ok;
    } catch (e) {
      console.warn('Backend interview session sync unavailable (offline mode active):', e);
      return false;
    }
  }

  public static async recordIntegrityEvent(sessionId: string, event: IntegrityEvent): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, event })
      });
      return res.ok;
    } catch (e) {
      console.warn('Backend integrity event sync deferred:', e);
      return false;
    }
  }

  public static async submitInterview(result: InterviewResult): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });
      return res.ok;
    } catch (e) {
      console.warn('Backend interview submit deferred (stored locally):', e);
      return false;
    }
  }

  public static async getStudentHistory(studentId: string): Promise<InterviewResult[]> {
    try {
      const res = await fetch(`${API_BASE}/student/${encodeURIComponent(studentId)}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.interviews || [];
    } catch (e) {
      return [];
    }
  }

  public static async getInterviewById(id: string): Promise<InterviewResult | null> {
    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.interview || null;
    } catch (e) {
      return null;
    }
  }
}
