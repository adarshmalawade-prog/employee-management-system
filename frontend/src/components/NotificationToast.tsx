import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { NotificationMessage } from '../types/employee';

interface NotificationToastProps {
  notifications: NotificationMessage[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notifications,
  onDismiss,
}) => {
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[notifications.length - 1];
      const timer = setTimeout(() => {
        onDismiss(latest.id);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notifications, onDismiss]);

  if (notifications.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {notifications.map((n) => (
        <div key={n.id} className={`toast ${n.type}`} role="status">
          {n.type === 'success' && <CheckCircle2 size={18} color="var(--success)" />}
          {n.type === 'error' && <AlertCircle size={18} color="var(--danger)" />}
          {n.type === 'info' && <Info size={18} color="var(--primary)" />}

          <div style={{ flex: 1 }}>{n.message}</div>

          <button
            type="button"
            className="btn-icon"
            onClick={() => onDismiss(n.id)}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
