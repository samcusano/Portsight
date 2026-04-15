import { useState, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/shared/Button';
import StatusBadge from '../components/shared/StatusBadge';
import {
  AlertTriangle, CheckCircle, Clock, Upload,
  Phone, Mail, User, ArrowRight,
} from 'lucide-react';
import COMPLIANCE_DATA from '../data/compliance';
import type { ComplianceShipment } from '../data/compliance';
import './Compliance.css';

const TEAM = ['Alex Chen', 'S. Kimura', 'O. Lev Haaret', 'A. Rodriguez', 'P. Nair'];

type BoardStatus = 'open' | 'in-progress' | 'submitted' | 'resolved';

const COLUMNS: { id: BoardStatus; label: string }[] = [
  { id: 'open',        label: 'Open'        },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'submitted',   label: 'Submitted'   },
  { id: 'resolved',    label: 'Resolved'    },
];

const STEP_ORDER: BoardStatus[] = ['open', 'in-progress', 'submitted', 'resolved'];
const STEP_LABELS: Record<BoardStatus, string> = {
  'open':        'Open',
  'in-progress': 'In Progress',
  'submitted':   'Submitted',
  'resolved':    'Resolved',
};

function initialStatus(s: ComplianceShipment): BoardStatus {
  return s.issue.status === 'in-progress' ? 'in-progress' : 'open';
}

// ── Triage card ─────────────────────────────────────────────────────────────
interface TriageCardProps {
  shipment: ComplianceShipment;
  status: BoardStatus;
  active: boolean;
  onClick: () => void;
  onAdvance: (e: React.MouseEvent) => void;
}

const TriageCard = ({ shipment: s, status, active, onClick, onAdvance }: TriageCardProps) => {
  const hrs = s.issue.hoursRemaining;
  const urgent = hrs <= 12;
  const soon = hrs <= 24 && !urgent;

  return (
    <div
      className={[
        'cp-card',
        active ? 'cp-card--active' : '',
        urgent ? 'cp-card--urgent' : soon ? 'cp-card--soon' : '',
        status === 'resolved' ? 'cp-card--resolved' : '',
      ].join(' ').trim()}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-pressed={active}
      aria-label={`${s.id} — ${s.issue.regulation}, ${s.issue.fineExposure}`}
    >
      <div className="cp-card-top">
        <span className="cp-card-id">{s.id}</span>
        <span className={`cp-card-fine${urgent ? ' cp-card-fine--urgent' : ''}`}>
          {s.issue.fineExposure}
        </span>
      </div>
      <div className="cp-card-reg">{s.issue.regulation}</div>
      <div className="cp-card-bottom">
        <span className="cp-card-route">{s.route.replace('→', '›')}</span>
        <div className="cp-card-meta">
          <span className="cp-card-assignee">
            {s.issue.assignee.split(' ').map(w => w[0]).join('')}
          </span>
          <span className={`cp-card-deadline${urgent ? ' cp-card-deadline--urgent' : ''}`}>
            <Clock size={9} />{hrs}h
          </span>
        </div>
      </div>
      {status !== 'resolved' && status !== 'submitted' && (
        <button
          className="cp-card-advance"
          onClick={onAdvance}
          title={status === 'open' ? 'Move to In Progress' : 'Mark Submitted'}
          aria-label={status === 'open' ? 'Move to In Progress' : 'Mark Submitted'}
        >
          <ArrowRight size={10} />
        </button>
      )}
    </div>
  );
};

// ── Single-screen action view ────────────────────────────────────────────────
interface ActionViewProps {
  shipment: ComplianceShipment;
  status: BoardStatus;
  assignee: string;
  onAssigneeChange: (a: string) => void;
  onAdvance: () => void;
  onResolve: () => void;
}

const ActionView = ({
  shipment: s, status, assignee, onAssigneeChange, onAdvance, onResolve,
}: ActionViewProps) => {
  const [uploaded, setUploaded] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const ref = `CBP-${new Date().getFullYear()}-${s.id.replace('FLEX-', '')}-${Math.floor(Math.random() * 9000 + 1000)}`;

  if (submitted) {
    return (
      <div className="cp-action cp-action--success">
        <div className="cp-success-icon"><CheckCircle size={36} strokeWidth={1.5} /></div>
        <h2 className="cp-success-title">Submitted successfully</h2>
        <p className="cp-success-sub">Filing transmitted to {s.issue.submitsTo}.</p>
        <div className="cp-success-ref">
          <span className="label">Reference number</span>
          <span className="cp-success-ref-val">{ref}</span>
        </div>
        <Button variant="outline" onClick={onResolve}>Return to board</Button>
      </div>
    );
  }

  return (
    <div className="cp-action">
      {/* Header */}
      <div className="cp-action-header">
        <div className="cp-action-title-row">
          <AlertTriangle size={14} className="cp-action-icon" />
          <h2 className="cp-action-title">{s.issue.regulation}</h2>
          <StatusBadge variant={s.issue.holdRisk === 'High' ? 'critical' : 'default'}>
            {s.issue.holdRisk} hold risk
          </StatusBadge>
        </div>

        <div className="cp-action-kpis">
          <div className="cp-kpi">
            <span className="cp-kpi-val">{s.issue.fineExposure}</span>
            <span className="cp-kpi-label">Fine exposure</span>
          </div>
          <div className="cp-kpi-sep" />
          <div className="cp-kpi">
            <span className={`cp-kpi-val${s.issue.hoursRemaining <= 12 ? ' cp-kpi-val--urgent' : ''}`}>
              {s.issue.hoursRemaining}h
            </span>
            <span className="cp-kpi-label">Remaining · {s.issue.deadline}</span>
          </div>
          <div className="cp-kpi-sep" />
          <div className="cp-kpi">
            <span className="cp-kpi-val">{s.issue.delayIfHeld}</span>
            <span className="cp-kpi-label">Delay if held</span>
          </div>
          <div className="cp-kpi-sep" />
          {/* Assignee */}
          <div className="cp-kpi cp-kpi--assignee">
            <User size={11} style={{ color: 'var(--ink-4)' }} />
            <select
              className="cp-assignee-select"
              value={assignee}
              onChange={(e) => onAssigneeChange(e.target.value)}
              aria-label="Assign to"
            >
              {TEAM.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="cp-action-route">
          <span className="label">{s.id}</span>
          <span className="cp-route-sep">·</span>
          <span className="label">{s.route}</span>
          <span className="cp-route-sep">·</span>
          <span className="label">{s.cargo}</span>
        </div>
      </div>

      {/* Body */}
      <div className="cp-action-body">
        {/* What's required */}
        <section className="cp-section">
          <h3 className="cp-section-title">What's required</h3>
          <div className="cp-required-block">
            <div className="cp-required-doc">{s.issue.documentRequired}</div>
            <p className="cp-required-sub">{s.issue.documentSub}</p>
            {s.issue.producerField && (
              <div className="cp-field-row">
                <label className="cp-field-label">{s.issue.producerField}</label>
                <input className="cp-field-input" placeholder="Enter registration number…" />
              </div>
            )}
            {s.issue.containerId && (
              <div className="cp-field-row">
                <label className="cp-field-label">Container ID</label>
                <input className="cp-field-input" defaultValue={s.issue.containerId} readOnly />
              </div>
            )}
          </div>
        </section>

        {/* Upload */}
        <section className="cp-section">
          <h3 className="cp-section-title">Upload document</h3>
          {uploaded ? (
            <div className="cp-upload-done">
              <CheckCircle size={14} />
              Document uploaded · ready to submit
              <button className="cp-upload-replace" onClick={() => setUploaded(false)}>Replace</button>
            </div>
          ) : (
            <div
              className="cp-upload-zone"
              role="button"
              tabIndex={0}
              onClick={() => setUploaded(true)}
              onKeyDown={(e) => e.key === 'Enter' && setUploaded(true)}
              aria-label="Upload compliance document"
            >
              <Upload size={18} strokeWidth={1.5} />
              <span>Drop PDF, XML, or image here — or click to browse</span>
              <span className="cp-upload-formats">PDF · XML · JPG · PNG accepted</span>
            </div>
          )}
        </section>

        {/* Authority contact */}
        <section className="cp-section">
          <h3 className="cp-section-title">Submitting to</h3>
          <div className="cp-authority">
            <div className="cp-authority-name">{s.issue.authorityContact.name}</div>
            <div className="cp-authority-role">{s.issue.authorityContact.role}</div>
            <div className="cp-authority-contacts">
              <a href={`tel:${s.issue.authorityContact.phone}`} className="cp-authority-link">
                <Phone size={11} />{s.issue.authorityContact.phone}
              </a>
              <a href={`mailto:${s.issue.authorityContact.email}`} className="cp-authority-link">
                <Mail size={11} />{s.issue.authorityContact.email}
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Footer actions */}
      <div className="cp-action-footer">
        <div className="cp-footer-steps" aria-label="Workflow progress">
          {STEP_ORDER.map((step, i) => {
            const stepIdx = STEP_ORDER.indexOf(step);
            const currIdx = STEP_ORDER.indexOf(status);
            const isDone = stepIdx < currIdx;
            const isActive = step === status;
            return (
              <Fragment key={step}>
                {i > 0 && <span className="cp-footer-step-sep" aria-hidden="true">›</span>}
                <span className={[
                  'cp-footer-step',
                  isActive ? 'cp-footer-step--active' : '',
                  isDone   ? 'cp-footer-step--done'   : '',
                ].filter(Boolean).join(' ')}>
                  {STEP_LABELS[step]}
                </span>
              </Fragment>
            );
          })}
        </div>

        <div className="cp-footer-actions">
          <div className="cp-footer-btns">
            {status === 'open' && (
              <Button variant="outline" onClick={onAdvance}>Move to In Progress</Button>
            )}
            <Button
              variant="primary"
              disabled={!uploaded}
              onClick={() => setConfirming(true)}
            >
              Review & Submit
            </Button>
          </div>
          {!uploaded && (
            <span className="cp-submit-hint">Upload document above to submit</span>
          )}
        </div>
      </div>

      {/* Confirmation sheet */}
      {confirming && (
        <div className="cp-confirm-overlay" role="dialog" aria-modal="true" aria-label="Confirm submission">
          <div className="cp-confirm">
            <h3 className="cp-confirm-title">Confirm submission</h3>
            <div className="cp-confirm-rows">
              <div className="cp-confirm-row">
                <span className="cp-confirm-label">Shipment</span>
                <span className="cp-confirm-val">{s.id} · {s.route}</span>
              </div>
              <div className="cp-confirm-row">
                <span className="cp-confirm-label">Regulation</span>
                <span className="cp-confirm-val">{s.issue.regulation}</span>
              </div>
              <div className="cp-confirm-row">
                <span className="cp-confirm-label">Document</span>
                <span className="cp-confirm-val">{s.issue.documentRequired} ✓</span>
              </div>
              <div className="cp-confirm-row">
                <span className="cp-confirm-label">Submitting to</span>
                <span className="cp-confirm-val">{s.issue.submitsTo}</span>
              </div>
              <div className="cp-confirm-row">
                <span className="cp-confirm-label">Fine exposure</span>
                <span className="cp-confirm-val">{s.issue.fineExposure}</span>
              </div>
              <div className="cp-confirm-row">
                <span className="cp-confirm-label">Assigned to</span>
                <span className="cp-confirm-val">{assignee}</span>
              </div>
            </div>
            <p className="cp-confirm-warning">
              This filing will be transmitted to {s.issue.submitsTo}. Ensure all information is accurate before confirming.
            </p>
            <div className="cp-confirm-actions">
              <Button variant="outline" onClick={() => setConfirming(false)}>Go back</Button>
              <Button variant="primary" onClick={() => { setConfirming(false); setSubmitted(true); onAdvance(); }}>
                Confirm & Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main page ────────────────────────────────────────────────────────────────
const Compliance = () => {
  const { shipmentId } = useParams<{ shipmentId?: string }>();
  const navigate = useNavigate();

  const shipments = Object.values(COMPLIANCE_DATA);

  // Board state: status per shipment id
  const [boardState, setBoardState] = useState<Record<string, BoardStatus>>(() =>
    Object.fromEntries(shipments.map(s => [s.id, initialStatus(s)]))
  );

  // Assignees
  const [assignees, setAssignees] = useState<Record<string, string>>(() =>
    Object.fromEntries(shipments.map(s => [s.id, s.issue.assignee]))
  );

  // Selected card — prefer URL param if valid
  const [selectedId, setSelectedId] = useState<string | null>(
    shipmentId && COMPLIANCE_DATA[shipmentId] ? shipmentId : shipments[0]?.id ?? null
  );

  const selected = selectedId ? COMPLIANCE_DATA[selectedId] : null;

  function advance(id: string) {
    setBoardState(prev => {
      const next: Record<BoardStatus, BoardStatus> = {
        'open': 'in-progress',
        'in-progress': 'submitted',
        'submitted': 'resolved',
        'resolved': 'resolved',
      };
      return { ...prev, [id]: next[prev[id]] };
    });
  }

  function resolve(id: string) {
    setBoardState(prev => ({ ...prev, [id]: 'resolved' }));
    setSelectedId(null);
  }

  const countFor = (status: BoardStatus) =>
    shipments.filter(s => boardState[s.id] === status).length;

  return (
    <div className="compliance-page">
      <h1 className="sr-only">Compliance Triage</h1>

      <div className="cp-inbox">
        {/* Left — triage board */}
        <div className="cp-drawer">
          <div className="cp-drawer-header">
            <span className="cp-drawer-title">Violations</span>
            <span className="label">{shipments.length} total</span>
          </div>

          {COLUMNS.map(col => {
            const cards = shipments.filter(s => boardState[s.id] === col.id);
            return (
              <div key={col.id} className="cp-col">
                <div className="cp-col-header">
                  <span className="cp-col-label">{col.label}</span>
                  {countFor(col.id) > 0 && (
                    <span className="cp-col-count">{countFor(col.id)}</span>
                  )}
                </div>
                {cards.length === 0 ? (
                  <div className="cp-col-empty">—</div>
                ) : (
                  cards.map((s, i) => (
                    <div key={s.id} className="row-enter" style={{ '--row-i': i } as React.CSSProperties}>
                      <TriageCard
                        shipment={s}
                        status={boardState[s.id]}
                        active={selectedId === s.id}
                        onClick={() => {
                          setSelectedId(s.id);
                          navigate(`/compliance/${s.id}`, { replace: true });
                        }}
                        onAdvance={(e) => { e.stopPropagation(); advance(s.id); }}
                      />
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>

        {/* Right — action view */}
        <div className="cp-main" id="main-content">
          {selected ? (
            <div key={selected.id} className="cp-panel-wrap">
              <ActionView
                shipment={selected}
                status={boardState[selected.id]}
                assignee={assignees[selected.id]}
                onAssigneeChange={(a) => setAssignees(prev => ({ ...prev, [selected.id]: a }))}
                onAdvance={() => advance(selected.id)}
                onResolve={() => resolve(selected.id)}
              />
            </div>
          ) : (
            <div key="empty" className="cp-panel-wrap">
              <div className="cp-empty-state">
                <span className="label">Select a violation to begin resolution</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Compliance;
