import { VercelRequest, VercelResponse } from '@vercel/node';
import app from './index.js';

// For Vercel serverless environment
export default async (req: VercelRequest, res: VercelResponse) => {
  return new Promise((resolve) => {
    app(req, res as any);
    res.on('finish', () => resolve(undefined));
  });
};
