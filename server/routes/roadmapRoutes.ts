import { Router, Request, Response } from 'express';
import { Database } from '../db/database';
import { getProgressSummary, getRoadmapBySlug, getRoadmaps } from '../services/roadmapService';
import { SKILL_CATALOG, SkillCatalogEntry } from '../data/skillCatalogData';

export const roadmapRouter = Router();
const db = Database.getInstance();

const userIdFromRequest = (req: Request): string | null => {
  const userId = req.header('x-user-id') || (req.query.userId as string) || req.body?.userId;
  return typeof userId === 'string' && userId.trim() ? userId.trim() : null;
};

/**
 * GET /api/roadmaps
 * Also handles /api/roadmap/all
 */
roadmapRouter.get('/', (req: Request, res: Response) => {
  const userId = userIdFromRequest(req);
  const roadmaps = getRoadmaps().map((roadmap) => {
    const progress = userId ? db.getRoadmapProgress(userId, roadmap.id) : null;
    return {
      ...roadmap,
      modules: undefined,
      moduleCount: roadmap.modules.length,
      progress: getProgressSummary(roadmap, progress || undefined)
    };
  });
  res.json({ success: true, roadmaps });
});

/**
 * GET /api/roadmaps/skills or /api/skills
 * Supports ?department=CSE, ?department=ECE, etc.
 */
roadmapRouter.get('/skills', (req: Request, res: Response) => {
  const { department } = req.query;
  let list = SKILL_CATALOG;

  if (department && typeof department === 'string' && department !== 'All' && department !== 'All Departments') {
    const deptUpper = department.toUpperCase().trim();
    list = SKILL_CATALOG.filter((s) =>
      s.departments.some((d) => d.toUpperCase().trim() === deptUpper)
    );
  }

  res.json({
    success: true,
    total: list.length,
    department: department || 'All Departments',
    skills: list
  });
});

/**
 * GET /api/roadmaps/current
 * Returns personalized roadmap based on latest analysis from database for the user
 */
roadmapRouter.get('/current', (req: Request, res: Response) => {
  const userId = userIdFromRequest(req);
  if (!userId) {
    return res.json({
      success: true,
      hasPersonalized: false,
      message: 'Analyze your resume to get a personalized roadmap.',
      roadmap: null
    });
  }

  const userAnalyses = db.getUserAnalysisHistory(userId);
  if (!userAnalyses || userAnalyses.length === 0) {
    return res.json({
      success: true,
      hasPersonalized: false,
      message: 'No resume analysis found for this candidate. Browse all skills catalog.',
      roadmap: null
    });
  }

  // Latest analysis is the first or last depending on sort
  const latest = userAnalyses[0]; // newest first from DB
  const priorityGaps = (latest.whatToLearnNext || []).map((item) => ({
    skill: item.skill,
    severity: item.severity,
    priority: item.severity === 'Critical' ? 'HIGH' : item.severity === 'Important' ? 'MEDIUM' : 'LOW',
    actionDescription: item.actionDescription
  }));

  res.json({
    success: true,
    hasPersonalized: true,
    analysisId: latest.analysisId,
    resumeFileName: latest.fileName,
    analyzedAt: latest.createdAt,
    opportunityTitle: latest.opportunityTitle,
    opportunityCompany: latest.opportunityCompany,
    matchedSkills: (latest.matchedSkills || []).map((m) => m.skill),
    partialSkills: (latest.partialSkills || []).map((p) => p.skill),
    missingSkills: (latest.missingSkills || []).map((m) => m.skill),
    priorityGaps
  });
});

/**
 * GET /api/roadmaps/gaps
 * Identified skill gaps from latest candidate analysis
 */
roadmapRouter.get('/gaps', (req: Request, res: Response) => {
  const userId = userIdFromRequest(req);
  if (!userId) {
    return res.json({ success: true, count: 0, gaps: [] });
  }

  const userAnalyses = db.getUserAnalysisHistory(userId);
  if (!userAnalyses || userAnalyses.length === 0) {
    return res.json({ success: true, count: 0, gaps: [] });
  }

  const latest = userAnalyses[0];
  const missing = latest.missingSkills || [];
  const next = latest.whatToLearnNext || [];

  res.json({
    success: true,
    count: missing.length + next.length,
    missingSkills: missing,
    learningPriorities: next
  });
});

/**
 * GET /api/roadmaps/recommended
 * Curated list of recommended learning targets
 */
roadmapRouter.get('/recommended', (req: Request, res: Response) => {
  const userId = userIdFromRequest(req);
  if (!userId) {
    return res.json({ success: true, recommended: [] });
  }

  const userAnalyses = db.getUserAnalysisHistory(userId);
  if (!userAnalyses || userAnalyses.length === 0) {
    return res.json({ success: true, recommended: [] });
  }

  const latest = userAnalyses[0];
  res.json({
    success: true,
    recommended: latest.whatToLearnNext || []
  });
});

/**
 * GET /api/roadmaps/history
 * History of candidate roadmap snapshots
 */
roadmapRouter.get('/history', (req: Request, res: Response) => {
  const userId = userIdFromRequest(req);
  if (!userId) {
    return res.json({ success: true, history: [] });
  }

  const userAnalyses = db.getUserAnalysisHistory(userId);
  const snapshots = userAnalyses.map((a) => ({
    analysisId: a.analysisId,
    fileName: a.fileName,
    analyzedAt: a.createdAt,
    opportunityTitle: a.opportunityTitle || 'General Industry Profile',
    opportunityCompany: a.opportunityCompany || 'Industry Benchmark',
    gapsCount: (a.missingSkills || []).length + (a.whatToLearnNext || []).length,
    matchedCount: (a.matchedSkills || []).length
  }));

  res.json({
    success: true,
    totalSnapshots: snapshots.length,
    history: snapshots
  });
});

/**
 * POST /api/roadmaps/generate or /recalculate
 */
roadmapRouter.post('/generate', (req: Request, res: Response) => {
  const { analysisId, targetOpportunityId } = req.body;
  const userId = userIdFromRequest(req);

  res.json({
    success: true,
    message: 'Roadmap recalculated successfully',
    analysisId,
    targetOpportunityId,
    timestamp: new Date().toISOString()
  });
});

roadmapRouter.post('/recalculate', (req: Request, res: Response) => {
  const { analysisId, targetOpportunityId } = req.body;
  res.json({
    success: true,
    message: 'Roadmap recalculated successfully',
    analysisId,
    targetOpportunityId,
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/roadmaps/:slug
 */
roadmapRouter.get('/:slug', (req: Request, res: Response) => {
  const roadmap = getRoadmapBySlug(String(req.params.slug));
  if (!roadmap) return res.status(404).json({ success: false, error: 'Roadmap not found.' });
  const userId = userIdFromRequest(req);
  const progress = userId ? db.getRoadmapProgress(userId, roadmap.id) : null;
  res.json({
    success: true,
    roadmap,
    progress: progress || {
      userId: userId || '',
      technologyId: roadmap.id,
      lessonIds: [],
      completedTopicIds: [],
      completedProjectIds: [],
      bookmarkedLessonIds: [],
      notes: {},
      assessmentAttempts: []
    },
    summary: getProgressSummary(roadmap, progress || undefined)
  });
});

/**
 * GET /api/roadmaps/:slug/topic/:topicId
 */
roadmapRouter.get('/:slug/topic/:topicId', (req: Request, res: Response) => {
  const roadmap = getRoadmapBySlug(String(req.params.slug));
  const topic = roadmap?.modules.flatMap((module) => module.topics).find((item) => item.id === String(req.params.topicId));
  if (!roadmap || !topic) return res.status(404).json({ success: false, error: 'Topic not found.' });
  res.json({ success: true, technology: roadmap.name, topic });
});

/**
 * POST /api/roadmaps/:slug/progress
 */
roadmapRouter.post('/:slug/progress', (req: Request, res: Response) => {
  const userId = userIdFromRequest(req);
  const roadmap = getRoadmapBySlug(String(req.params.slug));
  if (!userId) return res.status(401).json({ success: false, error: 'Authenticated user is required.' });
  if (!roadmap) return res.status(404).json({ success: false, error: 'Roadmap not found.' });
  const current = db.getRoadmapProgress(userId, roadmap.id);
  const progress = db.saveRoadmapProgress({
    userId,
    technologyId: roadmap.id,
    lessonIds: Array.isArray(req.body.lessonIds) ? req.body.lessonIds : current?.lessonIds || [],
    completedTopicIds: Array.isArray(req.body.completedTopicIds) ? req.body.completedTopicIds : current?.completedTopicIds || [],
    completedProjectIds: Array.isArray(req.body.completedProjectIds) ? req.body.completedProjectIds : current?.completedProjectIds || [],
    lastLessonId: typeof req.body.lastLessonId === 'string' ? req.body.lastLessonId : current?.lastLessonId,
    bookmarkedLessonIds: Array.isArray(req.body.bookmarkedLessonIds) ? req.body.bookmarkedLessonIds : current?.bookmarkedLessonIds || [],
    notes: req.body.notes && typeof req.body.notes === 'object' ? req.body.notes : current?.notes || {},
    assessmentAttempts: Array.isArray(req.body.assessmentAttempts) ? req.body.assessmentAttempts : current?.assessmentAttempts || []
  });
  res.json({ success: true, progress, summary: getProgressSummary(roadmap, progress) });
});