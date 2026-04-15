import './SectionHeader.css';

interface SectionHeaderProps {
  title: string | React.ReactNode;
  number?: string;
  subtitle?: string;
  className?: string;
  style?: React.CSSProperties;
}

const SectionHeader = ({ title, number, subtitle, className = '', style }: SectionHeaderProps) => {
  return (
    <div className={`section-header ${className}`} style={style}>
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <span className="label section-subtitle">{subtitle}</span>}
      </div>
      {number && <span className="label">{number}</span>}
    </div>
  );
};

export default SectionHeader;
