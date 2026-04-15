import './StatusBadge.css';

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'critical' | 'watch' | 'clear' | 'dashed';
  className?: string;
  style?: React.CSSProperties;
}

const StatusBadge = ({ children, variant = 'default', className = '', style }: StatusBadgeProps) => {
  const variantClass = variant !== 'default' ? variant : '';
  const badgeStyle = variant === 'dashed' ? { borderStyle: 'dashed', ...style } : style;

  return (
    <span className={`status-badge ${variantClass} ${className}`.trim()} style={badgeStyle}>
      {children}
    </span>
  );
};

export default StatusBadge;
