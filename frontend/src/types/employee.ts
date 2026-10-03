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

export interface EmployeeFilters {
  search?: string;
  department?: string;
  role?: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  services: {
    api: 'up' | 'down';
    database: 'connected' | 'disconnected';
    dbLatencyMs?: number;
    error?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  message?: string;
  error?: string;
  errors?: string[];
}

export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
