import { VercelRequest, VercelResponse } from '@vercel/node';
import app from './api/index.js';

export default async (req: VercelRequest, res: VercelResponse) => {
  // Health check для главной страницы
  if (req.url === '/') {
    return res.status(200).json({ 
      status: 'ok', 
      message: 'Platonus API is running',
      timestamp: new Date().toISOString() 
    });
  }
  
  // Для всех остальных маршрутов используй Express app
  return app(req, res as any);
};
