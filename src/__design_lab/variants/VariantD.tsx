// Variant D — Signal Stack (Option 1: actions always on row)
// No expand/collapse. No drill panel.
// Row 1: name · exposure · time
// Row 2: failure mode · Escalate · Reassign · Message
// Left edge color = urgency tier. CFO acts without clicking.

import './VariantD.css';

const ASSIGNEES = [
  { rank: 1, name: 'A. Rodriguez',   initials: 'AR', exposure: '$756K', hours: 72,  hoursLabel: '72h', status: 'no-action'   as const, failure: '3 shipments likely to miss SLA', tasks: 1, type: 'congestion'  as const },
  { rank: 2, name: 'O. Lev Haaret', initials: 'OL', exposure: '$7.5K', hours: 6,   hoursLabel: '6h',  status: 'queued'      as const, failure: 'Customs hold on arrival',          tasks: 1, type: 'compliance' as const },
  { rank: 3, name: 'Alex Chen',     initials: 'AC', exposure: '$37K',  hours: 14,  hoursLabel: '14h', status: 'queued'      as const, failure: 'WEEE fine · arrival deadline',      tasks: 2, type: 'compliance' as const },
  { rank: 4, name: 'S. Kimura',     initials: 'SK', exposure: '$8.5K', hours: 36,  hoursLabel: '36h', status: 'in-progress' as const, failure: 'Rotterdam entry blocked',            tasks: 1, type: 'regulatory' as const },
  { rank: 5, name: 'P. Nair',       initials: 'PN', exposure: '$4.2K', hours: 120, hoursLabel: '5d',  status: 'queued'      as const, failure: 'ETS declaration gap',                tasks: 1, type: 'regulatory' as const },
];

function edgeTier(hours: number, status: string): 'edge--critical' | 'edge--warning' | 'edge--clear' {
  if (status === 'no-action') return 'edge--critical';
  if (hours <= 12) return 'edge--critical';
  if (hours <= 72) return 'edge--warning';
  return 'edge--clear';
}

export default function VariantD() {
  return (
    <div className="vd">
      {ASSIGNEES.map(a => {
        const edge = edgeTier(a.hours, a.status);
        const timeClass = edge === 'edge--critical' ? 'vd-time--critical' : edge === 'edge--warning' ? 'vd-time--warning' : 'vd-time--normal';
        return (
          <div key={a.name} className={`vd-item ${edge}`}>
            <div className="vd-row">
              {/* Avatar */}
              <div className="vd-avatar-wrap">
                <div className={`vd-avatar vd-avatar--${edge}`}>{a.initials}</div>
                <span className="vd-rank-num">{String(a.rank).padStart(2,'0')}</span>
              </div>

              {/* Body */}
              <div className="vd-body">
                {/* Row 1: name · exposure · time */}
                <div className="vd-row-1">
                  <span className="vd-name">{a.name}</span>
                  {a.tasks > 1 && <span className="vd-task-badge">{a.tasks}</span>}
                  <span className="vd-spacer" aria-hidden="true" />
                  <span className="vd-exposure">{a.exposure}</span>
                  <span className={`vd-time ${timeClass}`}>{a.hoursLabel}</span>
                </div>

                {/* Row 2: failure mode · actions */}
                <div className="vd-row-2">
                  <span className="vd-failure">{a.failure}</span>
                  <div className="vd-actions">
                    <button className="vd-action vd-action--escalate">Escalate</button>
                    <button className="vd-action vd-action--reassign">Reassign</button>
                    <button className="vd-action">Message</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
