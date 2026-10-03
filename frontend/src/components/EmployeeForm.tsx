import React, { useState, useEffect } from 'react';
import { CreateEmployeeInput, Employee, UpdateEmployeeInput } from '../types/employee';

interface EmployeeFormProps {
  initialData?: Employee | null;
  onSubmit: (data: CreateEmployeeInput | UpdateEmployeeInput) => Promise<void>;
  onCancel: () => void;
  submitting: boolean;
  serverError?: string | null;
}

const DEFAULT_DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Product',
  'Finance',
  'Marketing',
  'Operations',
  'Sales',
];

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  submitting,
  serverError,
}) => {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    role: '',
    salary: '',
    hire_date: new Date().toISOString().split('T')[0],
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        employee_id: initialData.employee_id || '',
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        department: initialData.department || 'Engineering',
        role: initialData.role || '',
        salary: initialData.salary ? String(initialData.salary) : '',
        hire_date: initialData.hire_date
          ? new Date(initialData.hire_date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.employee_id.trim()) {
      errors.employee_id = 'Employee ID is required (e.g. EMP-1006)';
    }

    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.department.trim()) {
      errors.department = 'Department is required';
    }

    if (!formData.role.trim()) {
      errors.role = 'Role / Job title is required';
    }

    const numSalary = Number(formData.salary);
    if (!formData.salary || isNaN(numSalary) || numSalary <= 0) {
      errors.salary = 'Please enter a valid positive salary';
    }

    if (!formData.hire_date) {
      errors.hire_date = 'Hire date is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const payload = {
      employee_id: formData.employee_id.trim(),
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim() || null,
      department: formData.department.trim(),
      role: formData.role.trim(),
      salary: Number(formData.salary),
      hire_date: formData.hire_date,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      {serverError && (
        <div className="alert-box error" role="alert">
          <div>{serverError}</div>
        </div>
      )}

      <div className="form-grid">
        {/* Employee ID */}
        <div className="form-group">
          <label className="form-label" htmlFor="employee_id">
            Employee ID <span className="required">*</span>
          </label>
          <input
            id="employee_id"
            name="employee_id"
            type="text"
            className={`form-input ${validationErrors.employee_id ? 'error' : ''}`}
            placeholder="e.g. EMP-1006"
            value={formData.employee_id}
            onChange={handleChange}
            disabled={submitting}
          />
          {validationErrors.employee_id && (
            <span className="field-error">{validationErrors.employee_id}</span>
          )}
        </div>

        {/* Department */}
        <div className="form-group">
          <label className="form-label" htmlFor="department">
            Department <span className="required">*</span>
          </label>
          <select
            id="department"
            name="department"
            className={`form-select ${validationErrors.department ? 'error' : ''}`}
            value={formData.department}
            onChange={handleChange}
            disabled={submitting}
          >
            {DEFAULT_DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {validationErrors.department && (
            <span className="field-error">{validationErrors.department}</span>
          )}
        </div>

        {/* First Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="first_name">
            First Name <span className="required">*</span>
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            className={`form-input ${validationErrors.first_name ? 'error' : ''}`}
            placeholder="John"
            value={formData.first_name}
            onChange={handleChange}
            disabled={submitting}
          />
          {validationErrors.first_name && (
            <span className="field-error">{validationErrors.first_name}</span>
          )}
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="last_name">
            Last Name <span className="required">*</span>
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            className={`form-input ${validationErrors.last_name ? 'error' : ''}`}
            placeholder="Doe"
            value={formData.last_name}
            onChange={handleChange}
            disabled={submitting}
          />
          {validationErrors.last_name && (
            <span className="field-error">{validationErrors.last_name}</span>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Work Email <span className="required">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-input ${validationErrors.email ? 'error' : ''}`}
            placeholder="john.doe@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={submitting}
          />
          {validationErrors.email && (
            <span className="field-error">{validationErrors.email}</span>
          )}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="form-label" htmlFor="phone">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            className="form-input"
            placeholder="+1-555-0199"
            value={formData.phone}
            onChange={handleChange}
            disabled={submitting}
          />
        </div>

        {/* Role */}
        <div className="form-group">
          <label className="form-label" htmlFor="role">
            Job Role / Title <span className="required">*</span>
          </label>
          <input
            id="role"
            name="role"
            type="text"
            className={`form-input ${validationErrors.role ? 'error' : ''}`}
            placeholder="e.g. Software Engineer"
            value={formData.role}
            onChange={handleChange}
            disabled={submitting}
          />
          {validationErrors.role && (
            <span className="field-error">{validationErrors.role}</span>
          )}
        </div>

        {/* Salary */}
        <div className="form-group">
          <label className="form-label" htmlFor="salary">
            Annual Salary (USD) <span className="required">*</span>
          </label>
          <input
            id="salary"
            name="salary"
            type="number"
            min="1"
            step="500"
            className={`form-input ${validationErrors.salary ? 'error' : ''}`}
            placeholder="85000"
            value={formData.salary}
            onChange={handleChange}
            disabled={submitting}
          />
          {validationErrors.salary && (
            <span className="field-error">{validationErrors.salary}</span>
          )}
        </div>

        {/* Hire Date */}
        <div className="form-group full-width">
          <label className="form-label" htmlFor="hire_date">
            Hire Date <span className="required">*</span>
          </label>
          <input
            id="hire_date"
            name="hire_date"
            type="date"
            className={`form-input ${validationErrors.hire_date ? 'error' : ''}`}
            value={formData.hire_date}
            onChange={handleChange}
            disabled={submitting}
          />
          {validationErrors.hire_date && (
            <span className="field-error">{validationErrors.hire_date}</span>
          )}
        </div>
      </div>

      <div className="modal-footer" style={{ marginTop: '1.5rem', marginInline: '-1.5rem', marginBottom: '-1.5rem' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting
            ? isEditing
              ? 'Saving Changes...'
              : 'Creating Employee...'
            : isEditing
            ? 'Save Changes'
            : 'Create Employee'}
        </button>
      </div>
    </form>
  );
};
