import './MetricBlock.css';

interface MetricBlockProps {
  label?: string;
  value?: string | React.ReactNode;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  tooltip?: string;
}

const MetricBlock = ({ label, value, subtitle, children, className = '', style, tooltip }: MetricBlockProps) => {
  const content = (
    <div className={`metric-block ${className}`} style={style}>
      {label && <span className="label">{label}</span>}
      {value && (
        typeof value === 'string' ? (
          <span className="metric-value serif-display tabular-num">{value}</span>
        ) : (
          value
        )
      )}
      {subtitle && <span className="label">{subtitle}</span>}
      {children}
    </div>
  );

  if (tooltip) {
    // For now, return without tooltip wrapper - can be enhanced later
    return content;
  }

  return content;
};

export default MetricBlock;
