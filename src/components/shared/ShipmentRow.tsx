import { Zap, ArrowRight, ExternalLink } from 'lucide-react';
import StatusBadge from './StatusBadge';

const SEVERITY_LABEL: Record<string, string> = {
  critical: 'Critical',
  watch: 'Watch',
  clear: 'On Track',
};

type ExType = 'compliance' | 'documentation' | 'carrier' | 'weather' | 'none';

function deriveExType(cause?: string, complianceIssue?: string): ExType {
  if (complianceIssue) return 'compliance';
  const c = cause?.toLowerCase() ?? '';
  if (c.includes('weather')) return 'weather';
  if (c.includes('carrier') || c.includes('breakdown')) return 'carrier';
  if (c.includes('customs') || c.includes('declaration') || c.includes('form') || c.includes('amendment') || c.includes('pre-clearance')) return 'documentation';
  return 'none';
}

function exLabel(type: ExType, complianceIssue?: string): string {
  if (type === 'compliance') return complianceIssue ?? 'Compliance';
  if (type === 'documentation') return 'Documentation';
  if (type === 'carrier') return 'Carrier';
  if (type === 'weather') return 'Weather';
  return '';
}

export interface ShipmentData {
  id: string;
  name: string;
  refs: string[];
  route: string;
  progressPct: number;
  location: string;
  cause?: string;
  complianceIssue?: string;
  assignee: string;
  date: string;
  severity?: 'critical' | 'watch' | 'clear';
  mapPos?: { top: string; left: string };
}

interface ShipmentRowProps extends ShipmentData {
  onClick?: () => void;
  active?: boolean;
}

const ShipmentRow = ({
  id,
  name,
  refs,
  route,
  progressPct,
  location,
  cause,
  complianceIssue,
  assignee,
  date,
  severity = 'critical',
  onClick,
  active,
}: ShipmentRowProps) => {
  const exType = deriveExType(cause, complianceIssue);
  const label = exLabel(exType, complianceIssue);

  return (
    <div
      className={`disruption-row${active ? ' disruption-row--active' : ''}${severity !== 'critical' ? ` disruption-row--${severity}` : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-expanded={active !== undefined ? active : undefined}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
    >
      <div className="dr-icon" aria-hidden="true">
        <div className="map-dot"></div>
      </div>

      <div className="dr-identity">
        <div className="dr-title">
          <span className="dr-id">{id}</span>
          <span className="dr-sep">·</span>
          <span className="dr-name">{name}</span>
          {cause && <Zap size={11} className="dr-bolt" aria-label="Disruption" />}
        </div>
        <div className="dr-refs">
          {refs.map((r) => (
            <span key={r} className="dr-tag">{r}</span>
          ))}
          <StatusBadge variant={severity as 'critical' | 'watch' | 'clear'}>
            {SEVERITY_LABEL[severity]}
          </StatusBadge>
        </div>
      </div>

      <div className="dr-exception">
        {exType !== 'none' && (
          <span className={`dr-ex-badge dr-ex-badge--${exType}`} title={label}>
            {label}
          </span>
        )}
        {exType === 'compliance' && (
          <span className="dr-open-label" aria-label="Open compliance case">
            Open <ExternalLink size={10} aria-hidden="true" />
          </span>
        )}
      </div>

      <div className="dr-progress">
        <div className="dr-bar" role="meter" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
          <div className="dr-bar-fill" style={{ width: `${progressPct}%` }} />
          <div className="dr-bar-marker" style={{ left: `${progressPct}%` }} aria-hidden="true" />
        </div>
        <div className="dr-status">
          <ArrowRight size={10} className="dr-status-icon" aria-hidden="true" />
          <span className="dr-route">{route}</span>
          <span className="dr-status-sep">·</span>
          <span>{location}{cause && <>&nbsp;·&nbsp;<strong>{cause}</strong></>}</span>
        </div>
      </div>

      <div className="dr-meta">
        <span className="dr-assignee">{assignee}&nbsp;·&nbsp;<strong>{date}</strong></span>
      </div>
    </div>
  );
};

export default ShipmentRow;
