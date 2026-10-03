import React from 'react';
import { X } from 'lucide-react';
import { Employee, CreateEmployeeInput, UpdateEmployeeInput } from '../types/employee';
import { EmployeeForm } from './EmployeeForm';

interface EmployeeModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
  onSubmit: (data: CreateEmployeeInput | UpdateEmployeeInput) => Promise<void>;
  submitting: boolean;
  serverError?: string | null;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  employee,
  onClose,
  onSubmit,
  submitting,
  serverError,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(employee);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Edit Employee Details' : 'Add New Employee'}
          </h2>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <EmployeeForm
            initialData={employee}
            onSubmit={onSubmit}
            onCancel={onClose}
            submitting={submitting}
            serverError={serverError}
          />
        </div>
      </div>
    </div>
  );
};
