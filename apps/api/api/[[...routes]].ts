import { VercelRequest, VercelResponse } from '@vercel/node';
import app from './index.js';

export const config = {
  runtime: 'nodejs20.x',
};

export default async (req: VercelRequest, res: VercelResponse) => {
  return app(req, res as any);
};
