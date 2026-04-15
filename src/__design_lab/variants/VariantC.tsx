// Variant C — Logbook Dense
// Maximum information density. All monospace. Grid lines.
// Every column earns its pixel. Status as symbol, not badge.
// The terminal view — for users who want raw signal.

import { useState } from 'react';
import './VariantC.css';

const ASSIGNEES = [
  { rank: 1, name: 'A. Rodriguez',   initials: 'AR', exposure: '$756K', exposureShort: '756K', hours: 72,  hoursLabel: '72h', status: 'no-action'   as const, failure: '3 shipments likely to miss SLA', tasks: 1, type: 'CONG', lastAction: 'Reroute option identified · pending decision' },
  { rank: 2, name: 'O. Lev Haaret', initials: 'OL', exposure: '$7.5K', exposureShort: '7.5K', hours: 6,   hoursLabel: '6h',  status: 'queued'      as const, failure: 'Customs hold on arrival',          tasks: 1, type: 'COMP', lastAction: 'Flagged by AI audit · no response' },
  { rank: 3, name: 'Alex Chen',     initials: 'AC', exposure: '$37K',  exposureShort: '37K',  hours: 14,  hoursLabel: '14h', status: 'queued'      as const, failure: 'WEEE fine · arrival deadline',      tasks: 2, type: 'COMP', lastAction: 'Flagged by AI audit · no response' },
  { rank: 4, name: 'S. Kimura',     initials: 'SK', exposure: '$8.5K', exposureShort: '8.5K', hours: 36,  hoursLabel: '36h', status: 'in-progress' as const, failure: 'Rotterdam entry blocked',            tasks: 1, type: 'REG',  lastAction: 'Form correction in progress' },
  { rank: 5, name: 'P. Nair',       initials: 'PN', exposure: '$4.2K', exposureShort: '4.2K', hours: 120, hoursLabel: '5d',  status: 'queued'      as const, failure: 'ETS declaration gap',                tasks: 1, type: 'REG',  lastAction: 'Flagged by AI audit · no response' },
];

// Terminal-style status symbol
const STATUS_SYM: Record<string, { sym: string; cls: string }> = {
  'no-action':   { sym: '●', cls: 'vc-sym--critical' },
  'queued':      { sym: '◐', cls: 'vc-sym--warning'  },
  'in-progress': { sym: '○', cls: 'vc-sym--clear'    },
};
const STATUS_LABEL = { 'no-action': 'NO ACTION', queued: 'QUEUED', 'in-progress': 'IN PROG' };

function urgencyCls(h: number) { return h <= 12 ? 'vc-red' : h <= 72 ? 'vc-amber' : ''; }

export default function VariantC() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="vc">
      {/* Column headers */}
      <div className="vc-thead">
        <span className="vc-th vc-th--rank">#</span>
        <span className="vc-th vc-th--name">Assignee</span>
        <span className="vc-th vc-th--type">Type</span>
        <span className="vc-th vc-th--tasks">Tasks</span>
        <span className="vc-th vc-th--exposure">Exposure</span>
        <span className="vc-th vc-th--time">T-Breach</span>
        <span className="vc-th vc-th--status">Status</span>
        <span className="vc-th vc-th--failure">Failure mode</span>
      </div>

      {ASSIGNEES.map(a => {
        const isOpen = open === a.name;
        const sym = STATUS_SYM[a.status];
        return (
          <div key={a.name} className={`vc-item${isOpen ? ' vc-item--open' : ''}`}>
            <button
              className="vc-row"
              onClick={() => setOpen(isOpen ? null : a.name)}
              aria-expanded={isOpen}
            >
              <span className="vc-td vc-td--rank vc-dim">{a.rank.toString().padStart(2,'0')}</span>
              <span className="vc-td vc-td--name vc-name">{a.name}</span>
              <span className={`vc-td vc-td--type vc-type--${a.type.toLowerCase()}`}>{a.type}</span>
              <span className="vc-td vc-td--tasks vc-dim">{a.tasks}</span>
              <span className={`vc-td vc-td--exposure vc-exposure`}>${a.exposureShort}</span>
              <span className={`vc-td vc-td--time ${urgencyCls(a.hours)}`}>{a.hoursLabel}</span>
              <span className={`vc-td vc-td--status`}>
                <span className={`vc-sym ${sym.cls}`} aria-hidden="true">{sym.sym}</span>
                <span className={`vc-status-text vc-status--${a.status}`}>{STATUS_LABEL[a.status]}</span>
              </span>
              <span className="vc-td vc-td--failure vc-failure">{a.failure}</span>
            </button>

            {isOpen && (
              <div className="vc-drill" role="region" aria-label={`Details for ${a.name}`}>
                <span className="vc-drill-prefix">└─</span>
                <span className="vc-drill-label">LAST ACTION</span>
                <span className="vc-drill-text">{a.lastAction}</span>
                <div className="vc-drill-btns">
                  <button className="vc-btn vc-btn--esc">ESC</button>
                  <button className="vc-btn vc-btn--rsn">RSN</button>
                  <button className="vc-btn">MSG</button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="vc-footer">
        <span className="vc-dim">5 assignees · $813K total exposure · 2 no action</span>
      </div>
    </div>
  );
}
