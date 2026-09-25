import { Router, Request, Response } from 'express';
import { Database } from '../db/database';

const db = Database.getInstance();

export const interviewRouter = Router();

/**
 * POST /api/interview/session
 * Create or sync active interview session state
 */
interviewRouter.post('/session', (req: Request, res: Response) => {
  try {
    const { sessionId, role, difficulty, questionCount, studentId, opportunityId } = req.body;

    if (!sessionId || !role) {
      return res.status(400).json({ success: false, error: 'sessionId and role are required' });
    }

    const sessionData = {
      id: sessionId,
      sessionId,
      role,
      difficulty: difficulty || 'Intermediate',
      questionCount: questionCount || 5,
      studentId: studentId || 'student_demo',
      opportunityId: opportunityId || null,
      status: 'IN_PROGRESS',
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      integrityEvents: []
    };

    db.saveInterview(sessionData);

    return res.json({
      success: true,
      message: 'Interview session registered',
      session: sessionData
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/interview/event
 * Record a validated integrity incident or warning
 */
interviewRouter.post('/event', (req: Request, res: Response) => {
  try {
    const { sessionId, event } = req.body;

    if (!sessionId || !event) {
      return res.status(400).json({ success: false, error: 'sessionId and event are required' });
    }

    const existing = db.getInterviewById(sessionId) || {
      id: sessionId,
      sessionId,
      integrityEvents: []
    };

    existing.integrityEvents = existing.integrityEvents || [];
    existing.integrityEvents.push({
      ...event,
      serverTimestamp: new Date().toISOString()
    });
    existing.updatedAt = new Date().toISOString();

    db.saveInterview(existing);

    return res.json({
      success: true,
      recordedEvent: event,
      totalEvents: existing.integrityEvents.length
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/interview/submit
 * Persist finalized interview assessment with technical scores and integrity summary
 */
interviewRouter.post('/submit', (req: Request, res: Response) => {
  try {
    const interviewResult = req.body;

    if (!interviewResult || !interviewResult.id) {
      return res.status(400).json({ success: false, error: 'Valid interviewResult with id is required' });
    }

    const record = {
      ...interviewResult,
      updatedAt: new Date().toISOString(),
      status: interviewResult.completionStatus || 'COMPLETED_NORMALLY'
    };

    db.saveInterview(record);

    return res.json({
      success: true,
      message: 'Interview successfully recorded and persisted',
      interviewId: record.id
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/interview/student/:studentId
 * Get past interview history for a student
 */
interviewRouter.get('/student/:studentId', (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const list = db.getInterviewsByStudent(String(studentId));
    return res.json({
      success: true,
      count: list.length,
      interviews: list
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/interview/:id
 * Retrieve specific interview details
 */
interviewRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const interview = db.getInterviewById(String(id));

    if (!interview) {
      return res.status(404).json({ success: false, error: 'Interview not found' });
    }

    return res.json({
      success: true,
      interview
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
