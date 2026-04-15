import './Timeline.css';

interface TimelineItemProps {
  date: string;
  content: string | React.ReactNode;
  active?: boolean;
}

export const TimelineItem = ({ date, content, active = false }: TimelineItemProps) => {
  return (
    <div className={`timeline-item ${active ? 'active' : ''}`}>
      <span className="timeline-date">{date}</span>
      <div className="timeline-content">
        {typeof content === 'string' ? content : content}
      </div>
    </div>
  );
};

interface TimelineProps {
  children: React.ReactNode;
  className?: string;
  horizontal?: boolean;
}

const Timeline = ({ children, className = '', horizontal = false }: TimelineProps) => {
  return (
    <div className={`timeline${horizontal ? ' timeline--horizontal' : ''}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
};

Timeline.Item = TimelineItem;

export default Timeline;
