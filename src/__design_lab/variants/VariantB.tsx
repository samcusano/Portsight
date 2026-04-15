// Variant B — Command Queue
// Assignments rows in the Command (Dashboard/TaskCard) visual language.
// Rank column + vertical rule + body column with metadata strip.
// Direct inheritance from TaskCard's rank-col / body-col / strip pattern.

import { useState } from 'react';
import './VariantB.css';

const ASSIGNEES = [
  { rank: 1, name: 'A. Rodriguez',   initials: 'AR', exposure: '$756K', hours: 72,  status: 'no-action'   as const, failure: '3 shipments likely to miss SLA', tasks: 1, type: 'congestion'  as const, lastAction: 'Reroute option identified · pending decision' },
  { rank: 2, name: 'O. Lev Haaret', initials: 'OL', exposure: '$7.5K', hours: 6,   status: 'queued'      as const, failure: 'Customs hold on arrival',          tasks: 1, type: 'compliance' as const, lastAction: 'Flagged by AI audit · no response' },
  { rank: 3, name: 'Alex Chen',     initials: 'AC', exposure: '$37K',  hours: 14,  status: 'queued'      as const, failure: 'WEEE fine · arrival deadline',      tasks: 2, type: 'compliance' as const, lastAction: 'Flagged by AI audit · no response' },
  { rank: 4, name: 'S. Kimura',     initials: 'SK', exposure: '$8.5K', hours: 36,  status: 'in-progress' as const, failure: 'Rotterdam entry blocked',            tasks: 1, type: 'regulatory' as const, lastAction: 'Form correction in progress' },
  { rank: 5, name: 'P. Nair',       initials: 'PN', exposure: '$4.2K', hours: 120, status: 'queued'      as const, failure: 'ETS declaration gap',                tasks: 1, type: 'regulatory' as const, lastAction: 'Flagged by AI audit · no response' },
];

const TYPE_LABEL   = { compliance: 'Compliance', regulatory: 'Regulatory', congestion: 'Congestion' };
const STATUS_LABEL = { 'no-action': 'No action', queued: 'Queued', 'in-progress': 'In progress' };

function formatHours(h: number) { return h >= 48 ? `${Math.round(h/24)}d` : `${h}h`; }
function urgencyCls(h: number)  { return h <= 12 ? 'vb-deadline--critical' : h <= 72 ? 'vb-deadline--warning' : 'vb-deadline--normal'; }

export default function VariantB() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="vb" role="list">
      {ASSIGNEES.map(a => {
        const isOpen = open === a.name;
        return (
          <div key={a.name} className={`vb-card${isOpen ? ' vb-card--open' : ''}`} role="listitem">
            <button
              className="vb-header"
              onClick={() => setOpen(isOpen ? null : a.name)}
              aria-expanded={isOpen}
            >
              {/* Rank col — number + vertical rule (TaskCard pattern) */}
              <div className="vb-rank-col">
                <span className="vb-rank">{isOpen ? '▸' : String(a.rank).padStart(2,'0')}</span>
                <span className="vb-rule" aria-hidden="true" />
              </div>

              {/* Body col — failure mode headline + metadata strip */}
              <div className="vb-body-col">
                <p className="vb-problem">{a.failure}</p>
                <div className="vb-strip">
                  <span className={`vb-type vb-type--${a.type}`}>{TYPE_LABEL[a.type].toUpperCase()}</span>
                  <span className="vb-sep">—</span>
                  <span className="vb-name">{a.name}</span>
                  {a.tasks > 1 && <><span className="vb-sep">·</span><span className="vb-tasks">{a.tasks} tasks</span></>}
                  <span className="vb-sep">—</span>
                  <span className={`vb-deadline ${urgencyCls(a.hours)}`}>{formatHours(a.hours)} remaining</span>
                  <span className="vb-sep">—</span>
                  <span className="vb-exposure">{a.exposure} exposure</span>
                  <span className="vb-sep">—</span>
                  <span className={`vb-status vb-status--${a.status}`}>{STATUS_LABEL[a.status]}</span>
                </div>
              </div>
            </button>

            {isOpen && (
              <div className="vb-body is-open" role="region" aria-label={`Details for ${a.name}`}>
                <div className="vb-section">
                  <div className="vb-section-label">Last action</div>
                  <p className="vb-section-text">{a.lastAction}</p>
                </div>
                <div className="vb-section">
                  <div className="vb-section-label">Actions</div>
                  <div className="vb-actions">
                    <button className="vb-action-btn vb-action-btn--escalate">Escalate →</button>
                    <button className="vb-action-btn vb-action-btn--reassign">Reassign →</button>
                    <button className="vb-action-btn">Message →</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
