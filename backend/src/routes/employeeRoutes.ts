import { Router } from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController';
import {
  validateEmployeeIdParam,
  validateCreateEmployee,
  validateUpdateEmployee,
} from '../middleware/validateEmployee';

const router = Router();

// GET /api/employees - List all employees with search & filter
router.get('/', getAllEmployees);

// GET /api/employees/:id - Retrieve a single employee by numeric ID
router.get('/:id', validateEmployeeIdParam, getEmployeeById);

// POST /api/employees - Create a new employee
router.post('/', validateCreateEmployee, createEmployee);

// PUT /api/employees/:id - Update an existing employee
router.put('/:id', validateEmployeeIdParam, validateUpdateEmployee, updateEmployee);

// DELETE /api/employees/:id - Delete an employee
router.delete('/:id', validateEmployeeIdParam, deleteEmployee);

export default router;
