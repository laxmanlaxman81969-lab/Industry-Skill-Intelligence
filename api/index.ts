import app from '../server/index';

export default function handler(req: any, res: any) {
  try {
    return app(req, res);
  } catch (err: any) {
    console.error('[API Handler Error]:', err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: false,
          error: err?.message || 'Internal Server Error',
          stack: process.env.NODE_ENV !== 'production' ? err?.stack : undefined
        })
      );
    }
  }
}
