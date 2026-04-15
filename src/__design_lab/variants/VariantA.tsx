// Variant A — Fleet Mirror
// Assignments rows designed with the Fleet (Shipments) language.
// 4-column grid: Identity + tags | Failure mode | Time bar | Exposure + status
// Borrows: severity dot, dr-identity structure, progress bar, meta column.

import { useState } from 'react';
import './VariantA.css';

const ASSIGNEES = [
  { rank: 1, name: 'A. Rodriguez',   initials: 'AR', exposure: '$756K', hours: 72,  hoursLabel: '72h', status: 'no-action'   as const, failure: '3 shipments likely to miss SLA', tasks: 1, type: 'congestion'  as const, lastAction: 'Reroute option identified · pending decision' },
  { rank: 2, name: 'O. Lev Haaret', initials: 'OL', exposure: '$7.5K', hours: 6,   hoursLabel: '6h',  status: 'queued'      as const, failure: 'Customs hold on arrival',          tasks: 1, type: 'compliance' as const, lastAction: 'Flagged by AI audit · no response' },
  { rank: 3, name: 'Alex Chen',     initials: 'AC', exposure: '$37K',  hours: 14,  hoursLabel: '14h', status: 'queued'      as const, failure: 'WEEE fine · arrival deadline',      tasks: 2, type: 'compliance' as const, lastAction: 'Flagged by AI audit · no response' },
  { rank: 4, name: 'S. Kimura',     initials: 'SK', exposure: '$8.5K', hours: 36,  hoursLabel: '36h', status: 'in-progress' as const, failure: 'Rotterdam entry blocked',            tasks: 1, type: 'regulatory' as const, lastAction: 'Form correction in progress' },
  { rank: 5, name: 'P. Nair',       initials: 'PN', exposure: '$4.2K', hours: 120, hoursLabel: '5d',  status: 'queued'      as const, failure: 'ETS declaration gap',                tasks: 1, type: 'regulatory' as const, lastAction: 'Flagged by AI audit · no response' },
];

const STATUS_LABEL = { 'no-action': 'No action', 'queued': 'Queued', 'in-progress': 'In progress' };
const TYPE_LABEL   = { compliance: 'Compliance', regulatory: 'Regulatory', congestion: 'Congestion' };

function timeFillPct(hours: number) {
  return Math.max(4, Math.min(96, (1 - Math.min(hours, 168) / 168) * 96));
}

export default function VariantA() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="va">
      {/* List header */}
      <div className="va-list-header">
        <span>Assignee</span>
        <span>Failure mode</span>
        <span>Time to breach</span>
        <span>Exposure</span>
      </div>

      {ASSIGNEES.map(a => {
        const isOpen = open === a.name;
        return (
          <div key={a.name} className={`va-item${isOpen ? ' va-item--open' : ''}`}>
            <div
              className={`va-row`}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : a.name)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setOpen(isOpen ? null : a.name)}
            >
              {/* Identity */}
              <div className="va-identity">
                <div className="va-dot-wrap" aria-hidden="true">
                  <div className={`va-dot va-dot--${a.status}`} />
                </div>
                <div className="va-id-body">
                  <div className="va-id-title">
                    <span className="va-id-rank">{String(a.rank).padStart(2,'0')}</span>
                    <span className="va-id-sep">·</span>
                    <span className="va-id-name">{a.name}</span>
                  </div>
                  <div className="va-id-tags">
                    <span className={`va-tag va-tag--${a.type}`}>{TYPE_LABEL[a.type]}</span>
                    {a.tasks > 1 && <span className="va-tag va-tag--count">{a.tasks} tasks</span>}
                    <span className={`va-tag va-tag--status va-tag--${a.status}`}>{STATUS_LABEL[a.status]}</span>
                  </div>
                </div>
              </div>

              {/* Failure mode */}
              <div className="va-failure">{a.failure}</div>

              {/* Time bar */}
              <div className="va-time">
                <div className={`va-bar va-bar--${a.status}`} role="meter" aria-valuenow={a.hours} aria-label={`${a.hoursLabel} remaining`}>
                  <div className="va-bar-fill" style={{ width: `${timeFillPct(a.hours)}%` }} />
                  <div className="va-bar-head" style={{ left: `${timeFillPct(a.hours)}%` }} aria-hidden="true" />
                </div>
                <div className="va-time-meta">
                  <span className={`va-time-label va-time-label--${a.status}`}>{a.hoursLabel} remaining</span>
                </div>
              </div>

              {/* Exposure + open link */}
              <div className="va-meta">
                <span className="va-exposure">{a.exposure}</span>
                {a.status === 'no-action' && <span className="va-open">Review ↗</span>}
              </div>
            </div>

            {isOpen && (
              <div className="va-drill" role="region" aria-label={`Details for ${a.name}`}>
                <div className="va-drill-detail">
                  <span className="va-drill-label">Last action</span>
                  <span className="va-drill-value">{a.lastAction}</span>
                </div>
                <div className="va-drill-actions">
                  <button className="va-btn va-btn--escalate">Escalate</button>
                  <button className="va-btn va-btn--reassign">Reassign</button>
                  <button className="va-btn">Message</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
