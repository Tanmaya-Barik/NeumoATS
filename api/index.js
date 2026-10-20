import app from '../backend/server.js';

// Disable default Vercel bodyParser so Multer can stream multipart/form-data directly in memory
export const config = {
  api: {
    bodyParser: false,
  },
};

export default app;
