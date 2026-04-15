import './DataRow.css';

interface DataRowProps {
  label: string | React.ReactNode;
  value: string | React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const DataRow = ({ label, value, className = '', style }: DataRowProps) => {
  return (
    <dl className={`data-row ${className}`} style={style}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </dl>
  );
};

export default DataRow;
