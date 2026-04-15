import './AlertBanner.css';
import Button from './Button';
import { AlertTriangle, Zap, Info, X } from 'lucide-react';

interface AlertBannerProps {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

const AlertBanner = ({ severity, title, message, actionLabel, onAction, onDismiss }: AlertBannerProps) => {
  return (
    <div className={`alert-banner alert-${severity}`} role="alert">
      <div className="alert-content">
        <div className="alert-icon">
          {severity === 'critical' && <AlertTriangle size={18} strokeWidth={1.5} />}
          {severity === 'warning' && <Zap size={18} strokeWidth={1.5} />}
          {severity === 'info' && <Info size={18} strokeWidth={1.5} />}
        </div>
        <div className="alert-text">
          <strong className="alert-title">{title}</strong>
          <span className="alert-message">{message}</span>
        </div>
        {actionLabel && onAction && (
          <Button variant="outline" onClick={onAction} style={{ fontSize: '10px', padding: '6px 12px' }}>
            {actionLabel}
          </Button>
        )}
      </div>
      {onDismiss && (
        <button className="alert-dismiss" onClick={onDismiss} aria-label="Dismiss alert">
          <X size={18} strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
