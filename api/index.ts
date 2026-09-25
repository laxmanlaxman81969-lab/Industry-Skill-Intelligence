import app from '../server/index';

// Disable default body parser in Vercel to allow Multer and streaming request handling
export const config = {
  api: {
    bodyParser: false,
  },
};

export default app;
