import { VercelRequest, VercelResponse } from '@vercel/node';
import appExpress from './api/index.js';

export const config = {
  runtime: 'nodejs',
};

export default async (req: VercelRequest, res: VercelResponse) => {
  // Health check для главной страницы
  if (req.url === '/') {
    return res.status(200).json({ 
      status: 'ok', 
      message: 'Platonus API is running',
      timestamp: new Date().toISOString() 
    });
  }
  
  // Для всех API маршрутов используй Express app
  return appExpress(req, res as any);
};
