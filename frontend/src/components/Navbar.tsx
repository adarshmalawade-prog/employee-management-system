import React from 'react';
import { Users, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { HealthCheckResponse } from '../types/employee';

interface NavbarProps {
  health: HealthCheckResponse | null;
  checkingHealth: boolean;
  onRefreshHealth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  health,
  checkingHealth,
  onRefreshHealth,
}) => {
  const isConnected = health?.status === 'healthy';

  return (
    <header className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <div className="brand-icon">
            <Users size={22} />
          </div>
          <div>
            <h1 className="brand-title">Employee Management System</h1>
            <p className="brand-subtitle">DevOps CI/CD Demo • React & Express</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            className={`status-indicator ${
              isConnected ? 'connected' : 'disconnected'
            }`}
            title={
              isConnected
                ? `PostgreSQL Connected (Latency: ${health?.services.dbLatencyMs ?? 0}ms)`
                : health?.services.error || 'Backend or database is offline'
            }
          >
            {isConnected ? (
              <>
                <CheckCircle2 size={14} />
                <span>Connected</span>
              </>
            ) : (
              <>
                <AlertCircle size={14} />
                <span>Backend unavailable</span>
              </>
            )}
          </div>

          <button
            onClick={onRefreshHealth}
            disabled={checkingHealth}
            className="btn-icon"
            title="Check backend status"
            aria-label="Refresh connection status"
          >
            <RefreshCw
              size={16}
              style={{
                animation: checkingHealth ? 'spin 1s linear infinite' : 'none',
              }}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
