import { query } from '../config/database';

export interface Employee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  department: string;
  role: string;
  salary: number;
  hire_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeInput {
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  department: string;
  role: string;
  salary: number;
  hire_date: string;
}

export interface UpdateEmployeeInput {
  employee_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string | null;
  department?: string;
  role?: string;
  salary?: number;
  hire_date?: string;
}

export interface EmployeeFilterOptions {
  search?: string;
  department?: string;
  role?: string;
}

export const EmployeeModel = {
  async findAll(filters: EmployeeFilterOptions = {}): Promise<Employee[]> {
    let sql = `SELECT id, employee_id, first_name, last_name, email, phone, department, role, salary, hire_date, created_at, updated_at FROM employees WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.search && filters.search.trim() !== '') {
      const searchPattern = `%${filters.search.trim()}%`;
      sql += ` AND (first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR employee_id ILIKE $${paramIndex})`;
      params.push(searchPattern);
      paramIndex++;
    }

    if (filters.department && filters.department.trim() !== '') {
      sql += ` AND department ILIKE $${paramIndex}`;
      params.push(filters.department.trim());
      paramIndex++;
    }

    if (filters.role && filters.role.trim() !== '') {
      sql += ` AND role ILIKE $${paramIndex}`;
      params.push(filters.role.trim());
      paramIndex++;
    }

    sql += ` ORDER BY id ASC`;
    const result = await query<Employee>(sql, params);
    return result.rows;
  },

  async findById(id: number): Promise<Employee | null> {
    const sql = `SELECT id, employee_id, first_name, last_name, email, phone, department, role, salary, hire_date, created_at, updated_at FROM employees WHERE id = $1`;
    const result = await query<Employee>(sql, [id]);
    return result.rows[0] || null;
  },

  async findByEmployeeId(employeeId: string): Promise<Employee | null> {
    const sql = `SELECT id, employee_id, first_name, last_name, email, phone, department, role, salary, hire_date, created_at, updated_at FROM employees WHERE employee_id = $1`;
    const result = await query<Employee>(sql, [employeeId]);
    return result.rows[0] || null;
  },

  async findByEmail(email: string): Promise<Employee | null> {
    const sql = `SELECT id, employee_id, first_name, last_name, email, phone, department, role, salary, hire_date, created_at, updated_at FROM employees WHERE email = $1`;
    const result = await query<Employee>(sql, [email]);
    return result.rows[0] || null;
  },

  async create(data: CreateEmployeeInput): Promise<Employee> {
    const sql = `
      INSERT INTO employees (
        employee_id, first_name, last_name, email, phone, department, role, salary, hire_date, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
      RETURNING id, employee_id, first_name, last_name, email, phone, department, role, salary, hire_date, created_at, updated_at
    `;
    const params = [
      data.employee_id,
      data.first_name,
      data.last_name,
      data.email,
      data.phone || null,
      data.department,
      data.role,
      data.salary,
      data.hire_date,
    ];
    const result = await query<Employee>(sql, params);
    return result.rows[0];
  },

  async update(id: number, data: UpdateEmployeeInput): Promise<Employee | null> {
    const current = await this.findById(id);
    if (!current) {
      return null;
    }

    const updatedData = {
      employee_id: data.employee_id ?? current.employee_id,
      first_name: data.first_name ?? current.first_name,
      last_name: data.last_name ?? current.last_name,
      email: data.email ?? current.email,
      phone: data.phone !== undefined ? data.phone : current.phone,
      department: data.department ?? current.department,
      role: data.role ?? current.role,
      salary: data.salary ?? current.salary,
      hire_date: data.hire_date ?? current.hire_date,
    };

    const sql = `
      UPDATE employees SET
        employee_id = $1,
        first_name = $2,
        last_name = $3,
        email = $4,
        phone = $5,
        department = $6,
        role = $7,
        salary = $8,
        hire_date = $9,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING id, employee_id, first_name, last_name, email, phone, department, role, salary, hire_date, created_at, updated_at
    `;

    const params = [
      updatedData.employee_id,
      updatedData.first_name,
      updatedData.last_name,
      updatedData.email,
      updatedData.phone,
      updatedData.department,
      updatedData.role,
      updatedData.salary,
      updatedData.hire_date,
      id,
    ];

    const result = await query<Employee>(sql, params);
    return result.rows[0] || null;
  },

  async delete(id: number): Promise<boolean> {
    const sql = `DELETE FROM employees WHERE id = $1`;
    const result = await query(sql, [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
