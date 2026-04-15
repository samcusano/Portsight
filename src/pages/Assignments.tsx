// Assignments — Ranked Accountability
// Pattern: Signal Stack (Variant D, Option 1)
// Left edge = urgency tier. Actions always on row. No expand/collapse.
// Row 1: name · task count
// Row 2: failure mode · exposure · time · Escalate · Reassign · Message

import { useMemo } from 'react';
import { TASKS, computeUrgencyScore, DEFAULT_WEIGHTS } from '../data/tasks';
import type { OperationalTask } from '../data/tasks';
import './Assignments.css';

// ── Types ──────────────────────────────────────────────────────────────────

type StatusSignal = 'no-action' | 'queued' | 'in-progress';
type EdgeTier = 'edge--critical' | 'edge--warning' | 'edge--clear';

interface AssigneeRow {
  name: string;
  initials: string;
  riskScore: number;
  totalExposure: number;
  mostUrgentHours: number;
  status: StatusSignal;
  failureMode: string;
  tasks: OperationalTask[];
}

// ── Helpers ────────────────────────────────────────────────────────────────

function lifecycleToStatus(state: OperationalTask['lifecycleState']): StatusSignal {
  if (state === 'actioned') return 'in-progress';
  if (state === 'detected') return 'no-action';
  return 'queued';
}

const FAILURE_MODE: Record<string, string> = {
  'TASK-001': 'Customs hold on arrival',
  'TASK-002': 'WEEE fine · arrival deadline',
  'TASK-003': 'Rotterdam entry blocked',
  'TASK-004': '3 shipments likely to miss SLA',
  'TASK-005': 'ETS declaration gap',
  'TASK-006': 'CBAM scope: 3 unreviewed',
};

function edgeTier(hours: number, status: StatusSignal): EdgeTier {
  if (status === 'no-action') return 'edge--critical';
  if (hours <= 12) return 'edge--critical';
  if (hours <= 72) return 'edge--warning';
  return 'edge--clear';
}

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
}

function formatUsd(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

function formatHours(h: number) {
  return h >= 48 ? `${Math.round(h / 24)}d` : `${h}h`;
}

// ── Build rows ─────────────────────────────────────────────────────────────

function buildRows(): AssigneeRow[] {
  const active = TASKS.filter(
    t => t.lifecycleState !== 'resolved' && t.lifecycleState !== 'expired'
  );
  const map = new Map<string, AssigneeRow>();

  for (const task of active) {
    const name = task.context.assignee;
    const score = computeUrgencyScore(task.urgencyInputs, DEFAULT_WEIGHTS);
    const hours = task.urgencyInputs.hoursRemainingToDeadline;
    const existing = map.get(name);

    if (!existing) {
      map.set(name, {
        name,
        initials: initials(name),
        riskScore: score,
        totalExposure: task.urgencyInputs.impact,
        mostUrgentHours: hours,
        status: lifecycleToStatus(task.lifecycleState),
        failureMode: FAILURE_MODE[task.id] ?? task.type,
        tasks: [task],
      });
    } else {
      existing.totalExposure += task.urgencyInputs.impact;
      existing.tasks.push(task);
      if (score > existing.riskScore) {
        existing.riskScore = score;
        existing.mostUrgentHours = hours;
        existing.status = lifecycleToStatus(task.lifecycleState);
        existing.failureMode = FAILURE_MODE[task.id] ?? task.type;
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => b.riskScore - a.riskScore);
}

// ── Page ───────────────────────────────────────────────────────────────────

const Assignments = () => {
  const rows = useMemo(buildRows, []);
  const totalExposure = rows.reduce((s, r) => s + r.totalExposure, 0);
  const noActionCount = rows.filter(r => r.status === 'no-action').length;

  return (
    <div className="assignments-page">
      <h1 className="sr-only">Assignments — Team accountability</h1>

      {/* Stat strip */}
      <div className="assign-stat-strip">
        <div className="assign-stat">
          <span className="assign-stat-value">{rows.length}</span>
          <span className="assign-stat-label">Assignees</span>
        </div>
        <div className="assign-stat-divider" />
        <div className="assign-stat">
          <span className="assign-stat-value assign-stat-value--brass">{formatUsd(totalExposure)}</span>
          <span className="assign-stat-label">Total exposure</span>
        </div>
        <div className="assign-stat-divider" />
        <div className="assign-stat">
          <span className={`assign-stat-value${noActionCount > 0 ? ' assign-stat-value--critical' : ''}`}>
            {noActionCount}
          </span>
          <span className="assign-stat-label">No action taken</span>
        </div>
      </div>

      <main id="main-content" className="assign-list">
        {rows.map(row => {
          const edge = edgeTier(row.mostUrgentHours, row.status);
          const timeClass =
            edge === 'edge--critical' ? 'assign-time--critical' :
            edge === 'edge--warning'  ? 'assign-time--warning'  : '';

          return (
            <div key={row.name} className={`assign-item ${edge}`}>
              <div className="assign-row">
                {/* Avatar */}
                <div className="assign-avatar-wrap">
                  <div className={`assign-avatar assign-avatar--${edge}`}>{row.initials}</div>
                </div>

                {/* Body */}
                <div className="assign-body">
                  {/* Row 1: name · task count */}
                  <div className="assign-body-1">
                    <span className="assign-name">{row.name}</span>
                    {row.tasks.length > 1 && (
                      <span className="assign-task-badge">{row.tasks.length}</span>
                    )}
                  </div>

                  {/* Row 2: failure mode · exposure · time · actions */}
                  <div className="assign-body-2">
                    <span className="assign-failure">{row.failureMode}</span>
                    <span className="assign-exposure">{formatUsd(row.totalExposure)}</span>
                    <span className={`assign-time ${timeClass}`}>
                      {formatHours(row.mostUrgentHours)}
                    </span>
                    <div className="assign-actions">
                      <button className="assign-action assign-action--escalate">Escalate</button>
                      <button className="assign-action assign-action--reassign">Reassign</button>
                      <button className="assign-action">Message</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default Assignments;
