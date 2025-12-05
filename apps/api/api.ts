import { VercelRequest, VercelResponse } from '@vercel/node';
import app from './api/index.js';

export const config = {
  runtime: 'nodejs',
};

export default async (req: VercelRequest, res: VercelResponse) => {
  return app(req, res as any);
};
