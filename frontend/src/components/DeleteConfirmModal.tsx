import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Employee } from '../types/employee';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  deleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  employee,
  onClose,
  onConfirm,
  deleting,
}) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--danger)' }}>
            <AlertTriangle size={22} />
            <h2 className="modal-title" style={{ color: 'var(--text-main)' }}>Confirm Employee Deletion</h2>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            disabled={deleting}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            Are you sure you want to delete the record for{' '}
            <strong>
              {employee.first_name} {employee.last_name}
            </strong>{' '}
            (<span style={{ fontFamily: 'monospace' }}>{employee.employee_id}</span>)?
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            This action will remove the employee from the PostgreSQL database permanently.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Employee'}
          </button>
        </div>
      </div>
    </div>
  );
};
