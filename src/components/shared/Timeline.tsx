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
}

const Timeline = ({ children, className = '' }: TimelineProps) => {
  return (
    <div className={`timeline ${className}`}>
      {children}
    </div>
  );
};

Timeline.Item = TimelineItem;

export default Timeline;
