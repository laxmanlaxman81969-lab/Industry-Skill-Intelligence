// Main Express Server for Industry Skill Intelligence Backend APIs
// Serves /api/skill-analyzer and related enterprise platform endpoints

import express from 'express';
import cors from 'cors';
import path from 'path';
import { skillAnalyzerRouter } from './routes/skillAnalyzerRoutes';
import { roadmapRouter } from './routes/roadmapRoutes';
import { interviewRouter } from './routes/interviewRoutes';
import { demandRouter } from './routes/demandRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for local Vite development, Vercel deployments, and production
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_ORIGIN,
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive CORS for deployed platform
    },
    credentials: true
  })
);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request logging and Vercel path normalization middleware
app.use((req, _res, next) => {
  const original = (
    req.headers['x-matched-path'] ||
    req.headers['x-rewrite-url'] ||
    req.headers['x-original-url'] ||
    req.originalUrl
  ) as string | undefined;

  const isVercelRewriteDestination =
    req.url === '/api' ||
    req.url === '/api/' ||
    req.url === '/api/index.js' ||
    req.url === '/api/index' ||
    req.url === '/' ||
    req.url === '';

  if (original && isVercelRewriteDestination && original !== req.url && original.startsWith('/api')) {
    req.url = original;
  }
  console.log(`[HTTP] ${req.method} ${req.url} (original: ${original || req.url})`);
  next();
});

// Health check endpoint
app.get(['/api/health', '/health'], (_req, res) => {
  res.json({
    status: 'ok',
    service: 'industry-skill-intelligence-api',
    timestamp: new Date().toISOString()
  });
});

// Mount AI Skill Analyzer Routes (supporting both /api/* and /* prefixes for Vercel rewrites)
app.use(['/api/skill-analyzer', '/skill-analyzer'], skillAnalyzerRouter);
app.use(['/api/resume', '/resume'], skillAnalyzerRouter);
app.use(['/api/roadmaps', '/roadmaps'], roadmapRouter);
app.use(['/api/roadmap', '/roadmap'], roadmapRouter);
app.use(['/api/skills', '/skills'], (req, res, next) => {
  req.url = '/skills' + (req.url === '/' ? '' : req.url);
  roadmapRouter(req, res, next);
});
app.use(['/api/interview', '/interview'], interviewRouter);
app.use(['/api/industry-demand', '/industry-demand'], demandRouter);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start listening if run directly (skip when imported as a Vercel serverless function or in test)
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Skill Intelligence Backend API running on port ${PORT}`);
    console.log(`👉 Health: http://localhost:${PORT}/api/health`);
    console.log(`👉 Skill Analyzer: http://localhost:${PORT}/api/skill-analyzer/status`);
    console.log(`=======================================================`);
  });
}

export default app;
