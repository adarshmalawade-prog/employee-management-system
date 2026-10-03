import { Request, Response, NextFunction } from 'express';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmployeeIdParam = (req: Request, res: Response, next: NextFunction): void => {
  const rawId = req.params.id;
  const id = parseInt(Array.isArray(rawId) ? rawId[0] : rawId, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({
      success: false,
      error: 'Invalid employee ID. Must be a positive integer.',
    });
    return;
  }
  next();
};

export const validateCreateEmployee = (req: Request, res: Response, next: NextFunction): void => {
  const { employee_id, first_name, last_name, email, department, role, salary, hire_date } = req.body;
  const errors: string[] = [];

  if (!employee_id || typeof employee_id !== 'string' || employee_id.trim() === '') {
    errors.push('employee_id is required and must be a non-empty string.');
  }

  if (!first_name || typeof first_name !== 'string' || first_name.trim() === '') {
    errors.push('first_name is required and must be a non-empty string.');
  }

  if (!last_name || typeof last_name !== 'string' || last_name.trim() === '') {
    errors.push('last_name is required and must be a non-empty string.');
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('email is required and must be a valid email address.');
  }

  if (!department || typeof department !== 'string' || department.trim() === '') {
    errors.push('department is required and must be a non-empty string.');
  }

  if (!role || typeof role !== 'string' || role.trim() === '') {
    errors.push('role is required and must be a non-empty string.');
  }

  const numericSalary = Number(salary);
  if (salary === undefined || salary === null || isNaN(numericSalary) || numericSalary <= 0) {
    errors.push('salary is required and must be a positive number.');
  }

  if (!hire_date || isNaN(Date.parse(hire_date))) {
    errors.push('hire_date is required and must be a valid date (e.g. YYYY-MM-DD).');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
    return;
  }

  next();
};

export const validateUpdateEmployee = (req: Request, res: Response, next: NextFunction): void => {
  const { employee_id, first_name, last_name, email, department, role, salary, hire_date } = req.body;
  const errors: string[] = [];

  if (employee_id !== undefined && (typeof employee_id !== 'string' || employee_id.trim() === '')) {
    errors.push('employee_id cannot be empty.');
  }

  if (first_name !== undefined && (typeof first_name !== 'string' || first_name.trim() === '')) {
    errors.push('first_name cannot be empty.');
  }

  if (last_name !== undefined && (typeof last_name !== 'string' || last_name.trim() === '')) {
    errors.push('last_name cannot be empty.');
  }

  if (email !== undefined && (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim()))) {
    errors.push('email must be a valid email address.');
  }

  if (department !== undefined && (typeof department !== 'string' || department.trim() === '')) {
    errors.push('department cannot be empty.');
  }

  if (role !== undefined && (typeof role !== 'string' || role.trim() === '')) {
    errors.push('role cannot be empty.');
  }

  if (salary !== undefined) {
    const numericSalary = Number(salary);
    if (isNaN(numericSalary) || numericSalary <= 0) {
      errors.push('salary must be a positive number.');
    }
  }

  if (hire_date !== undefined && isNaN(Date.parse(hire_date))) {
    errors.push('hire_date must be a valid date (e.g. YYYY-MM-DD).');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
    return;
  }

  next();
};
