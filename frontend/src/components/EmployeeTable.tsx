import React from 'react';
import { Edit2, Trash2, AlertCircle, Inbox } from 'lucide-react';
import { Employee } from '../types/employee';

interface EmployeeTableProps {
  employees: Employee[];
  loading: boolean;
  hasError: boolean;
  errorMessage?: string;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onRetry: () => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  loading,
  hasError,
  errorMessage,
  onEdit,
  onDelete,
  onRetry,
}) => {
  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    // Normalize date string (e.g. 2022-03-15 or ISO timestamp)
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? dateStr
      : date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          timeZone: 'UTC',
        });
  };

  const getDepartmentClass = (dept: string) => {
    const slug = dept.toLowerCase().replace(/\s+/g, '-');
    return `department-badge ${slug}`;
  };

  if (loading) {
    return (
      <div className="state-container">
        <div className="spinner" />
        <h3 className="state-title">Loading employee records...</h3>
        <p className="state-desc">Fetching latest data from PostgreSQL backend.</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="state-container">
        <AlertCircle className="state-icon error" />
        <h3 className="state-title">Unable to Load Employees</h3>
        <p className="state-desc">
          {errorMessage || 'Failed to communicate with the backend server.'}
        </p>
        <button type="button" className="btn btn-secondary" onClick={onRetry}>
          Retry Connection
        </button>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="state-container">
        <Inbox className="state-icon" />
        <h3 className="state-title">No employees found</h3>
        <p className="state-desc">
          Try adjusting your search criteria or add a new employee to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Role</th>
            <th>Salary</th>
            <th>Hire Date</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>
                <span className="emp-id-badge">{emp.employee_id}</span>
              </td>
              <td style={{ fontWeight: 600 }}>
                {emp.first_name} {emp.last_name}
              </td>
              <td style={{ color: 'var(--text-muted)' }}>{emp.email}</td>
              <td style={{ color: 'var(--text-muted)' }}>{emp.phone || '—'}</td>
              <td>
                <span className={getDepartmentClass(emp.department)}>
                  {emp.department}
                </span>
              </td>
              <td style={{ fontWeight: 500 }}>{emp.role}</td>
              <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                {formatSalary(emp.salary)}
              </td>
              <td style={{ color: 'var(--text-muted)' }}>{formatDate(emp.hire_date)}</td>
              <td style={{ textAlign: 'right' }}>
                <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn-icon edit"
                    onClick={() => onEdit(emp)}
                    title={`Edit ${emp.first_name} ${emp.last_name}`}
                    aria-label={`Edit ${emp.first_name} ${emp.last_name}`}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn-icon delete"
                    onClick={() => onDelete(emp)}
                    title={`Delete ${emp.first_name} ${emp.last_name}`}
                    aria-label={`Delete ${emp.first_name} ${emp.last_name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
