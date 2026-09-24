import { Router, Request, Response } from 'express';
import { DemandEngine } from '../services/demandEngine';

export const demandRouter = Router();
const engine = DemandEngine.getInstance();

/**
 * GET /api/industry-demand/overview
 * Returns overarching market snapshot & active sources
 */
demandRouter.get('/overview', (_req: Request, res: Response) => {
  try {
    const snapshot = engine.getSnapshot();
    const alerts = engine.getAlerts();
    const topSurging = engine.getFastestGrowing(undefined, 4);

    res.json({
      success: true,
      snapshot,
      alerts,
      topSurging
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/industry-demand/skills
 * Filter by department, industry, demandLevel, search, sortBy
 */
demandRouter.get('/skills', (req: Request, res: Response) => {
  try {
    const { department, industry, demandLevel, search, sortBy } = req.query;
    const skills = engine.getSkills({
      department: department as string,
      industry: industry as string,
      demandLevel: demandLevel as string,
      search: search as string,
      sortBy: sortBy as any
    });

    res.json({
      success: true,
      count: skills.length,
      skills
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/industry-demand/skills/:skillId
 * Detailed lineage and deep-dive for a specific skill
 */
demandRouter.get('/skills/:skillId', (req: Request, res: Response) => {
  try {
    const skill = engine.getSkillById(req.params.skillId);
    if (!skill) {
      return res.status(404).json({ success: false, error: 'Skill not found in demand database.' });
    }

    res.json({
      success: true,
      skill
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/industry-demand/trends
 * Fastest growing skills
 */
demandRouter.get('/trends', (req: Request, res: Response) => {
  try {
    const { department, limit } = req.query;
    const parsedLimit = limit ? parseInt(limit as string, 10) : 6;
    const rising = engine.getFastestGrowing(department as string, parsedLimit);
    const declining = engine.getDeclining(department as string, 5);
    const emerging = engine.getEmerging(department as string, 5);

    res.json({
      success: true,
      rising,
      declining,
      emerging
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/industry-demand/matrix
 * Department × Skill cross-matrix
 */
demandRouter.get('/matrix', (_req: Request, res: Response) => {
  try {
    const matrix = engine.getDepartmentMatrix();
    res.json({
      success: true,
      matrix
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/industry-demand/alerts
 * Automated demand alerts
 */
demandRouter.get('/alerts', (_req: Request, res: Response) => {
  try {
    const alerts = engine.getAlerts();
    res.json({
      success: true,
      count: alerts.length,
      alerts
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/industry-demand/sync
 * Manually trigger or simulate refreshing market signals from employer requisitions
 */
demandRouter.post('/sync', (_req: Request, res: Response) => {
  try {
    engine.calculateDemandMetrics();
    const snapshot = engine.getSnapshot();

    res.json({
      success: true,
      message: 'Market demand signals synchronized successfully across all connected sources.',
      syncedAt: new Date().toISOString(),
      snapshot
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
