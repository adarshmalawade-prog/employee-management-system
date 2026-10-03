import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';

export const checkHealth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const startTime = Date.now();
    await query('SELECT 1');
    const dbLatencyMs = Date.now() - startTime;

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        api: 'up',
        database: 'connected',
        dbLatencyMs,
      },
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        api: 'up',
        database: 'disconnected',
        error: error.message,
      },
    });
  }
};
