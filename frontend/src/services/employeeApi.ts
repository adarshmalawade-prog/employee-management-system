import {
  Employee,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeFilters,
  ApiResponse,
  HealthCheckResponse,
} from '../types/employee';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export class ApiError extends Error {
  public statusCode: number;
  public errors?: string[];

  constructor(message: string, statusCode: number = 500, errors?: string[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      let errorMessage = data?.message || data?.error || `Request failed with status ${response.status}`;
      if (data?.errors && Array.isArray(data.errors)) {
        errorMessage = data.errors.join(' ');
      }
      throw new ApiError(errorMessage, response.status, data?.errors);
    }

    return data as T;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network / fetch failure
    throw new ApiError(
      'Unable to connect to the Employee Management API. Please ensure the backend server is running.',
      0
    );
  }
}

export const employeeApi = {
  // Check API & database health
  async checkHealth(): Promise<HealthCheckResponse> {
    return request<HealthCheckResponse>('/health');
  },

  // Fetch all employees with optional search and filters
  async getEmployees(filters: EmployeeFilters = {}): Promise<Employee[]> {
    const params = new URLSearchParams();
    if (filters.search && filters.search.trim()) {
      params.append('search', filters.search.trim());
    }
    if (filters.department && filters.department.trim()) {
      params.append('department', filters.department.trim());
    }
    if (filters.role && filters.role.trim()) {
      params.append('role', filters.role.trim());
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await request<ApiResponse<Employee[]>>(`/employees${queryString}`);
    return res.data || [];
  },

  // Fetch single employee by numeric ID
  async getEmployeeById(id: number): Promise<Employee> {
    const res = await request<ApiResponse<Employee>>(`/employees/${id}`);
    return res.data;
  },

  // Create new employee
  async createEmployee(employeeData: CreateEmployeeInput): Promise<Employee> {
    const res = await request<ApiResponse<Employee>>('/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
    return res.data;
  },

  // Update employee by ID
  async updateEmployee(id: number, employeeData: UpdateEmployeeInput): Promise<Employee> {
    const res = await request<ApiResponse<Employee>>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
    });
    return res.data;
  },

  // Delete employee by ID
  async deleteEmployee(id: number): Promise<void> {
    await request<ApiResponse<void>>(`/employees/${id}`, {
      method: 'DELETE',
    });
  },
};
