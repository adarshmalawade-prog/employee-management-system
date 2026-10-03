import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Check for PostgreSQL Unique Constraint Violation (Error 23505)
  if (err.code === '23505') {
    const detail = err.detail || '';
    let message = 'A record with this information already exists.';

    if (detail.includes('email')) {
      message = 'An employee with this email address already exists.';
    } else if (detail.includes('employee_id')) {
      message = 'An employee with this employee ID already exists.';
    }

    res.status(409).json({
      success: false,
      error: 'Conflict',
      message,
    });
    return;
  }

  // Check for PostgreSQL invalid syntax or type casting error (Error 22P02)
  if (err.code === '22P02') {
    res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Invalid data format provided for database operation.',
    });
    return;
  }

  // Check for custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.name || 'Error',
      message: err.message,
    });
    return;
  }

  // Fallback for unhandled unexpected errors
  const isDevelopment = process.env.NODE_ENV === 'development';
  console.error('[Error Handler]:', err);

  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred. Please try again later.',
    ...(isDevelopment && { details: err.message }),
  });
};
