import './StatusBadge.css';

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'critical' | 'dashed';
  className?: string;
  style?: React.CSSProperties;
}

const StatusBadge = ({ children, variant = 'default', className = '', style }: StatusBadgeProps) => {
  const variantClass = variant === 'critical' ? 'critical' : variant === 'dashed' ? 'dashed' : '';
  const badgeStyle = variant === 'dashed' ? { borderStyle: 'dashed', ...style } : style;
  
  return (
    <span className={`status-badge ${variantClass} ${className}`} style={badgeStyle}>
      {children}
    </span>
  );
};

export default StatusBadge;
