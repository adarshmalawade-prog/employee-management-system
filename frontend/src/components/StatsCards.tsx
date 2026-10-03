import React from 'react';
import { Users, Building2, Briefcase, DollarSign } from 'lucide-react';
import { Employee } from '../types/employee';

interface StatsCardsProps {
  employees: Employee[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ employees }) => {
  const totalEmployees = employees.length;

  const departments = new Set(
    employees.map((e) => e.department).filter((d) => Boolean(d && d.trim()))
  );
  const totalDepartments = departments.size;

  const roles = new Set(
    employees.map((e) => e.role).filter((r) => Boolean(r && r.trim()))
  );
  const totalRoles = roles.size;

  const totalSalary = employees.reduce(
    (sum, emp) => sum + (Number(emp.salary) || 0),
    0
  );
  const avgSalary = totalEmployees > 0 ? Math.round(totalSalary / totalEmployees) : 0;

  const formattedAvgSalary = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(avgSalary);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">Total Employees</span>
          <span className="stat-value">{totalEmployees}</span>
        </div>
        <div className="stat-icon-wrapper">
          <Users size={22} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">Departments</span>
          <span className="stat-value">{totalDepartments}</span>
        </div>
        <div className="stat-icon-wrapper">
          <Building2 size={22} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">Unique Roles</span>
          <span className="stat-value">{totalRoles}</span>
        </div>
        <div className="stat-icon-wrapper">
          <Briefcase size={22} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">Average Salary</span>
          <span className="stat-value">{formattedAvgSalary}</span>
        </div>
        <div className="stat-icon-wrapper">
          <DollarSign size={22} />
        </div>
      </div>
    </div>
  );
};
