import './StatusIndicator.css';

interface StatusIndicatorProps {
  status: 'live' | 'updating' | 'offline';
  label?: string;
  lastUpdated?: string;
}

const StatusIndicator = ({ status, label, lastUpdated }: StatusIndicatorProps) => {
  const getStatusClass = () => {
    switch (status) {
      case 'live':
        return 'status-live';
      case 'updating':
        return 'status-updating';
      case 'offline':
        return 'status-offline';
      default:
        return '';
    }
  };

  return (
    <div className={`status-indicator ${getStatusClass()}`}>
      <span className="status-dot"></span>
      <span className="status-text">{label || status}</span>
      {lastUpdated && <span className="status-time">{lastUpdated}</span>}
    </div>
  );
};

export default StatusIndicator;
