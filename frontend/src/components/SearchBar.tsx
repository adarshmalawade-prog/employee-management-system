import React from 'react';
import { Search, Plus, RotateCcw } from 'lucide-react';

interface SearchBarProps {
  search: string;
  department: string;
  role: string;
  departmentOptions: string[];
  roleOptions: string[];
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onResetFilters: () => void;
  onOpenAddModal: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  search,
  department,
  role,
  departmentOptions,
  roleOptions,
  onSearchChange,
  onDepartmentChange,
  onRoleChange,
  onResetFilters,
  onOpenAddModal,
}) => {
  const hasActiveFilters = Boolean(search.trim() || department || role);

  return (
    <div className="controls-bar">
      <div className="filter-group">
        {/* Text Search Input */}
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, or employee ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Department Filter */}
        <select
          className="filter-select"
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          aria-label="Filter by department"
        >
          <option value="">All Departments</option>
          {departmentOptions.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Role Filter */}
        <select
          className="filter-select"
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          aria-label="Filter by role"
        >
          <option value="">All Roles</option>
          {roleOptions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* Reset Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onResetFilters}
            title="Reset all search filters"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Add Employee CTA */}
      <button
        type="button"
        className="btn btn-primary"
        onClick={onOpenAddModal}
        id="add-employee-btn"
      >
        <Plus size={16} />
        <span>Add Employee</span>
      </button>
    </div>
  );
};
