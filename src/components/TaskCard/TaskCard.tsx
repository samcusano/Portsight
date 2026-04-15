import { useNavigate } from 'react-router-dom';
import type { OperationalTask } from '../../data/tasks';
import Timeline, { TimelineItem } from '../shared/Timeline';
import './TaskCard.css';

interface TaskCardProps {
  task: OperationalTask;
  rank: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function typeLabel(type: OperationalTask['type']): string {
  if (type === 'compliance') return 'Compliance';
  if (type === 'congestion') return 'Congestion';
  if (type === 'regulatory') return 'Regulatory';
  return 'Exception';
}

function urgencyClass(hours: number): 'critical' | 'warning' | 'normal' {
  if (hours <= 12) return 'critical';
  if (hours <= 36) return 'warning';
  return 'normal';
}

function formatHours(hours: number): string {
  if (hours < 1) return '<1h';
  if (hours >= 48) return `${Math.round(hours / 24)}d`;
  return `${hours}h`;
}

function formatDelta(delta: number): { label: string; cls: string } {
  if (delta === 0) return { label: 'No change', cls: 'task-card__scenario-delta--neutral' };
  if (delta < 0) return { label: `−$${Math.abs(delta).toLocaleString()} saved`, cls: 'task-card__scenario-delta--savings' };
  return { label: `+$${delta.toLocaleString()} added cost`, cls: 'task-card__scenario-delta--cost' };
}

const TaskCard = ({ task, rank, isExpanded, onToggle }: TaskCardProps) => {
  const navigate = useNavigate();
  const { type, lifecycleState, problemStatement, impactLabel, confidencePct, urgencyInputs, cta, context } = task;
  const hours = urgencyInputs.hoursRemainingToDeadline;
  const isActioned = lifecycleState === 'actioned';
  const urgency = urgencyClass(hours);

  const impactType = (() => {
    if (impactLabel.startsWith('~') || impactLabel === 'Portfolio risk') return 'projected loss';
    return 'fine exposure';
  })();

  function handleCTA(e: React.MouseEvent) {
    e.stopPropagation();
    if (cta.action === 'navigate') navigate(cta.target);
  }

  return (
    <div className={`task-card${isActioned ? ' task-card--actioned' : ''}`} role="listitem">
      <button
        className="task-card__header"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`task-body-${task.id}`}
      >
        {/* Rank column — number + thin vertical rule */}
        <div className="task-card__rank-col">
          <span className="task-card__rank">
            {isActioned ? '✓' : String(rank).padStart(2, '0')}
          </span>
          <span className="task-card__rule" />
        </div>

        {/* Body — problem headline + metadata strip */}
        <div className="task-card__body-col">
          <p className="task-card__problem">{problemStatement}</p>
          <div className="task-card__strip">
            <span className={`task-card__type task-card__type--${type}`}>
              {typeLabel(type).toUpperCase()}
            </span>
            <span className="task-card__sep">—</span>
            <span className={`task-card__deadline task-card__deadline--${urgency}`}>
              {formatHours(hours)} remaining
            </span>
            <span className="task-card__sep">—</span>
            <span className="task-card__impact">{impactLabel} {impactType}</span>
            <span className="task-card__sep">—</span>
            <span className="task-card__conf">{confidencePct}% conf.</span>
            <span className="task-card__sep">—</span>
            <span className="task-card__cta-wrap" onClick={handleCTA}>
              <span className="task-card__cta-btn">{cta.label} →</span>
            </span>
          </div>
        </div>
      </button>

      {/* Expanded body */}
      <div
        id={`task-body-${task.id}`}
        className={`task-card__body${isExpanded ? ' is-open' : ''}`}
        aria-hidden={!isExpanded}
      >
        {/* Section A — Timeline */}
        {context.timelineEntries.length > 0 && (
          <div className="task-card__section">
            <div className="task-card__section-label">Timeline</div>
            <Timeline horizontal>
              {context.timelineEntries.map((entry, i) => (
                <TimelineItem
                  key={i}
                  date={entry.timestamp}
                  content={entry.label}
                  active={entry.type === 'alert'}
                />
              ))}
            </Timeline>
          </div>
        )}

        {/* Section B — Risk Drivers + Related Shipments */}
        <div className="task-card__section">
          <div className="task-card__drivers-grid">
            <div>
              <div className="task-card__section-label">Risk drivers</div>
              {context.riskDrivers.map((driver, i) => (
                <div key={i} className="task-card__driver-row">
                  <span className={`task-card__driver-dot task-card__driver-dot--${driver.weight}`} />
                  <span className="task-card__driver-text">{driver.factor}</span>
                </div>
              ))}
            </div>
            {context.relatedShipmentIds.length > 0 && (
              <div>
                <div className="task-card__section-label">Related shipments</div>
                <div className="task-card__related-chips">
                  {context.relatedShipmentIds.map(id => (
                    <button
                      key={id}
                      className="status-badge"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/compliance/${id}`);
                      }}
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section C — Scenarios */}
        {context.scenarios.length > 0 && (
          <div className="task-card__section">
            <div className="task-card__section-label">Scenario options</div>
            <div className="task-card__scenarios">
              {context.scenarios.map((scenario, i) => {
                const { label: deltaLabel, cls: deltaCls } = formatDelta(scenario.impactDelta);
                return (
                  <div key={i} className="task-card__scenario">
                    <div className="task-card__scenario-label">{scenario.label}</div>
                    <div className="task-card__scenario-outcome">{scenario.outcome}</div>
                    <div className={`task-card__scenario-delta ${deltaCls}`}>{deltaLabel}</div>
                    <div className="task-card__scenario-prob">
                      <span className="task-card__section-label">
                        {Math.round(scenario.probabilityOfSuccess * 100)}% success probability
                      </span>
                      <div className="task-card__prob-track">
                        <div
                          className="task-card__prob-fill"
                          style={{ width: `${scenario.probabilityOfSuccess * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
