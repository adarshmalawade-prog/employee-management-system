import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes';
import employeeRoutes from './routes/employeeRoutes';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/employees', employeeRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    name: 'Employee Management System API',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// 404 Not Found Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
