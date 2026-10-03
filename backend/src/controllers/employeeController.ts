import { Request, Response, NextFunction } from 'express';
import { EmployeeModel } from '../models/employeeModel';

export const getAllEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, department, role } = req.query;
    const employees = await EmployeeModel.findAll({
      search: typeof search === 'string' ? search : undefined,
      department: typeof department === 'string' ? department : undefined,
      role: typeof role === 'string' ? role : undefined,
    });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = parseInt(Array.isArray(rawId) ? rawId[0] : rawId, 10);
    const employee = await EmployeeModel.findById(id);

    if (!employee) {
      res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Employee with ID ${id} not found.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const createEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { employee_id, first_name, last_name, email, phone, department, role, salary, hire_date } = req.body;

    const newEmployee = await EmployeeModel.create({
      employee_id: employee_id.trim(),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : null,
      department: department.trim(),
      role: role.trim(),
      salary: Number(salary),
      hire_date,
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: newEmployee,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = parseInt(Array.isArray(rawId) ? rawId[0] : rawId, 10);
    const { employee_id, first_name, last_name, email, phone, department, role, salary, hire_date } = req.body;

    const updatedEmployee = await EmployeeModel.update(id, {
      employee_id: employee_id ? employee_id.trim() : undefined,
      first_name: first_name ? first_name.trim() : undefined,
      last_name: last_name ? last_name.trim() : undefined,
      email: email ? email.trim().toLowerCase() : undefined,
      phone: phone !== undefined ? (phone ? phone.trim() : null) : undefined,
      department: department ? department.trim() : undefined,
      role: role ? role.trim() : undefined,
      salary: salary !== undefined ? Number(salary) : undefined,
      hire_date: hire_date || undefined,
    });

    if (!updatedEmployee) {
      res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Employee with ID ${id} not found.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = parseInt(Array.isArray(rawId) ? rawId[0] : rawId, 10);
    const deleted = await EmployeeModel.delete(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Employee with ID ${id} not found.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Employee with ID ${id} deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
