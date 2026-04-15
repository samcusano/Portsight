import './InsightBlock.css';

interface InsightBlockProps {
  label?: string;
  title?: string;
  children: React.ReactNode;
  auditTrail?: string | React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const InsightBlock = ({ label, title, children, auditTrail, className = '', style }: InsightBlockProps) => {
  return (
    <div className={`insight-block ${className}`} style={style}>
      {label && (
        <span className="label" style={{ display: 'block', marginBottom: '8px' }}>
          {label}
        </span>
      )}
      {title && typeof children === 'string' ? (
        <p className="insight-text">
          <strong>{title}</strong> {children}
        </p>
      ) : title ? (
        <>
          <p className="insight-text">
            <strong>{title}</strong>
          </p>
          {children}
        </>
      ) : typeof children === 'string' ? (
        <p className="insight-text">{children}</p>
      ) : (
        children
      )}
      {auditTrail && (
        <div className="audit-trail">
          {typeof auditTrail === 'string' ? (
            <>{auditTrail.split('\n').map((line, i) => (
              <span key={i}>{line}{i < auditTrail.split('\n').length - 1 && <br />}</span>
            ))}</>
          ) : (
            auditTrail
          )}
        </div>
      )}
    </div>
  );
};

export default InsightBlock;
