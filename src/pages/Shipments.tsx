import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AlertBanner from '../components/shared/AlertBanner';
import ShipmentRow from '../components/shared/ShipmentRow';
import FilterDropdown from '../components/shared/FilterDropdown';
import type { ShipmentData } from '../components/shared/ShipmentRow';
import './Shipments.css';

const SHIPMENTS: ShipmentData[] = [
  {
    id: 'FLEX-997186',
    name: 'Palm disposable paper plates',
    refs: ['PO0019282', 'BL0019282'],
    route: 'CN-SHG → US-LGB',
    progressPct: 70,
    location: 'At arrival port',
    cause: 'Cargo breakdown — contact carrier',
    complianceIssue: 'WEEE Directive Violation',
    assignee: 'O. Lev Haaret',
    date: 'Jul 7',
    severity: 'critical',
  },
  {
    id: 'FLEX-103948',
    name: 'Textiles — winter collection',
    refs: ['PO0012088'],
    route: 'BD-CGP → US-LGB',
    progressPct: 92,
    location: 'Near destination',
    cause: 'ISF amendment required',
    complianceIssue: 'ISF Filing Overdue',
    assignee: 'O. Lev Haaret',
    date: 'Jul 8',
    severity: 'critical',
  },
  {
    id: 'FLEX-761034',
    name: 'Raw material batch C7',
    refs: ['PO0017650', 'BL0017650'],
    route: 'BR-SSZ → NL-RTM',
    progressPct: 88,
    location: 'Rotterdam approach',
    cause: 'CBAM Form 12-A missing',
    complianceIssue: 'CBAM Reporting Violation',
    assignee: 'A. Chen',
    date: 'Jul 9',
    severity: 'critical',
  },
  {
    id: 'FLEX-884201',
    name: 'Industrial steel coils',
    refs: ['PO0018741'],
    route: 'DE-HAM → SG-SIN',
    progressPct: 45,
    location: 'Mid-Pacific',
    cause: 'ETS emissions declaration required',
    assignee: 'S. Kimura',
    date: 'Jul 12',
    severity: 'watch',
  },
  {
    id: 'FLEX-449023',
    name: 'Frozen food concentrate',
    refs: ['PO0014902'],
    route: 'US-NYK → DE-HAM',
    progressPct: 35,
    location: 'Mid-Atlantic',
    cause: 'Customs pre-clearance pending',
    assignee: 'M. Santos',
    date: 'Jul 16',
    severity: 'watch',
  },
  {
    id: 'FLEX-332190',
    name: 'Electronic components lot 4',
    refs: ['PO0016310'],
    route: 'JP-TYO → US-LAX',
    progressPct: 18,
    location: 'Departing origin',
    cause: 'Weather hold',
    assignee: 'T. Watanabe',
    date: 'Jul 18',
    severity: 'watch',
  },
  {
    id: 'FLEX-210774',
    name: 'Pharmaceutical bulk API',
    refs: ['PO0013201', 'BL0013201'],
    route: 'IN-MUN → GB-FXT',
    progressPct: 55,
    location: 'Arabian Sea',
    assignee: 'P. Nair',
    date: 'Jul 11',
    severity: 'clear',
  },
  {
    id: 'FLEX-551847',
    name: 'Automotive parts — series 9',
    refs: ['PO0015847', 'BL0015847'],
    route: 'KR-ICN → NL-RTM',
    progressPct: 60,
    location: 'Indian Ocean',
    assignee: 'J. Park',
    date: 'Jul 14',
    severity: 'clear',
  },
];

// ── Exception type derivation ───────────────────────────────────────────────
type ExceptionType = 'compliance' | 'documentation' | 'carrier' | 'weather' | 'none';

const EXCEPTION_FILTERS = ['All exceptions', 'Compliance', 'Documentation', 'Carrier', 'Weather'] as const;
type ExceptionFilter = typeof EXCEPTION_FILTERS[number];

function getExceptionType(s: ShipmentData): ExceptionType {
  if (s.complianceIssue) return 'compliance';
  const c = s.cause?.toLowerCase() ?? '';
  if (c.includes('weather')) return 'weather';
  if (c.includes('carrier') || c.includes('breakdown')) return 'carrier';
  if (c.includes('customs') || c.includes('declaration') || c.includes('form') || c.includes('amendment') || c.includes('pre-clearance')) return 'documentation';
  return 'none';
}


// ── Mini-timeline in detail ─────────────────────────────────────────────────
function originCode(route: string) { return route.split('→')[0].trim().split('-')[1] ?? route.split('→')[0].trim(); }
function destCode(route: string) { return route.split('→')[1]?.trim().split('-')[1] ?? route.split('→')[1]?.trim() ?? ''; }

interface ShipmentDetailProps { shipment: ShipmentData; }

const ShipmentDetail = ({ shipment: s }: ShipmentDetailProps) => {
  const exType = getExceptionType(s);
  const hasException = exType !== 'none';

  return (
    <div className="sm-detail">
      {/* Mini-timeline */}
      <div className="sm-timeline">
        <div className="sm-timeline-track">
          <span className="sm-timeline-port">{originCode(s.route)}</span>
          <div className="sm-timeline-bar">
            <div className="sm-timeline-fill" style={{ width: `${s.progressPct}%` }} />
            <div className="sm-timeline-head" style={{ left: `${s.progressPct}%` }} />
            {hasException && (
              <div
                className="sm-timeline-exception"
                style={{ left: `${s.progressPct}%` }}
                title={s.cause}
              >
                !
              </div>
            )}
          </div>
          <span className="sm-timeline-port">{destCode(s.route)}</span>
        </div>
        <div className="sm-timeline-meta">
          <span className="sm-timeline-pct">{s.progressPct}% complete</span>
          {hasException && (
            <span className="sm-timeline-cause">
              {s.cause}
            </span>
          )}
          <span className="sm-timeline-eta">ETA {s.date}</span>
        </div>
      </div>

      {/* Detail grid */}
      <div className="sm-detail-grid">
        <div className="sm-detail-group">
          <span className="sm-detail-label">Cargo</span>
          <span className="sm-detail-value">{s.name}</span>
        </div>
        <div className="sm-detail-group">
          <span className="sm-detail-label">References</span>
          <span className="sm-detail-value">{s.refs.join(' · ')}</span>
        </div>
        <div className="sm-detail-group">
          <span className="sm-detail-label">Location</span>
          <span className="sm-detail-value">{s.location}</span>
        </div>
        <div className="sm-detail-group">
          <span className="sm-detail-label">Assignee</span>
          <span className="sm-detail-value">{s.assignee}</span>
        </div>
      </div>

      <div className="sm-detail-actions">
        <button className="sm-sort-btn">View documents</button>
        <button className="sm-sort-btn">Contact carrier</button>
      </div>
    </div>
  );
};

// ── Filter / sort types ─────────────────────────────────────────────────────
const SEVERITY_FILTERS = ['All', 'Critical', 'Watch', 'On Track'] as const;
type SeverityFilter = typeof SEVERITY_FILTERS[number];
type SortKey = 'eta' | 'risk' | 'route';
const SEVERITY_ORDER: Record<string, number> = { critical: 0, watch: 1, clear: 2 };

// ── Page ────────────────────────────────────────────────────────────────────
const Shipments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialQuery = new URLSearchParams(location.search).get('q') ?? '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('All');
  const [exceptionFilter, setExceptionFilter] = useState<ExceptionFilter>('All exceptions');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('risk');
  const [alertDismissed, setAlertDismissed] = useState(false);

  const filtered = SHIPMENTS.filter((s) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (
        !s.id.toLowerCase().includes(q) &&
        !s.name.toLowerCase().includes(q) &&
        !s.route.toLowerCase().includes(q) &&
        !s.refs.some((r) => r.toLowerCase().includes(q))
      ) return false;
    }
    if (severityFilter === 'Critical' && s.severity !== 'critical') return false;
    if (severityFilter === 'Watch' && s.severity !== 'watch') return false;
    if (severityFilter === 'On Track' && s.severity !== 'clear') return false;

    if (exceptionFilter !== 'All exceptions') {
      const type = getExceptionType(s);
      const map: Record<ExceptionFilter, ExceptionType> = {
        'All exceptions': 'none',
        'Compliance': 'compliance',
        'Documentation': 'documentation',
        'Carrier': 'carrier',
        'Weather': 'weather',
      };
      if (type !== map[exceptionFilter]) return false;
    }
    return true;
  }).slice().sort((a, b) => {
    if (sortKey === 'eta') return a.date.localeCompare(b.date);
    if (sortKey === 'risk') return (SEVERITY_ORDER[a.severity ?? 'clear'] ?? 3) - (SEVERITY_ORDER[b.severity ?? 'clear'] ?? 3);
    if (sortKey === 'route') return a.route.localeCompare(b.route);
    return 0;
  });

  const countFor = (f: SeverityFilter) => {
    if (f === 'Critical') return SHIPMENTS.filter((s) => s.severity === 'critical').length;
    if (f === 'Watch') return SHIPMENTS.filter((s) => s.severity === 'watch').length;
    if (f === 'On Track') return SHIPMENTS.filter((s) => s.severity === 'clear').length;
    return SHIPMENTS.length;
  };

  const exCountFor = (f: ExceptionFilter): number => {
    if (f === 'All exceptions') return SHIPMENTS.filter(s => getExceptionType(s) !== 'none').length;
    const map: Record<ExceptionFilter, ExceptionType> = {
      'All exceptions': 'none',
      'Compliance': 'compliance',
      'Documentation': 'documentation',
      'Carrier': 'carrier',
      'Weather': 'weather',
    };
    return SHIPMENTS.filter(s => getExceptionType(s) === map[f]).length;
  };

  const handleRowClick = (s: ShipmentData) => {
    if (s.complianceIssue) {
      navigate(`/compliance/${s.id}`);
    } else {
      setDetailId((prev) => (prev === s.id ? null : s.id));
    }
  };

  return (
    <div className="shipments-page">
      <h1 className="sr-only">Shipments</h1>

      {!alertDismissed && (
        <AlertBanner
          severity="critical"
          title="Force majeure — 3 shipments held"
          message="Port of Long Beach operations halted. FLEX-997186, FLEX-884201, FLEX-103948 affected. Estimated recovery: Unknown."
          actionLabel="View alternatives"
          onAction={() => {}}
          onDismiss={() => setAlertDismissed(true)}
        />
      )}

      <main id="main-content">
        {/* Toolbar */}
        <div className="sm-toolbar">
          <input
            className="sm-search"
            type="search"
            placeholder="Search by ID, cargo, route, PO number…"
            aria-label="Search shipments"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <FilterDropdown
            label="Status"
            options={SEVERITY_FILTERS}
            value={severityFilter}
            onChange={setSeverityFilter}
            countFor={countFor}
            activeClass={
              severityFilter === 'Critical' ? 'fd-dropdown-btn--critical' :
              severityFilter === 'Watch' ? 'fd-dropdown-btn--watch' :
              severityFilter === 'On Track' ? 'fd-dropdown-btn--clear' : ''
            }
          />

          <FilterDropdown
            label="Exception"
            options={EXCEPTION_FILTERS}
            value={exceptionFilter}
            onChange={setExceptionFilter}
            countFor={exCountFor}
            activeClass="fd-dropdown-btn--watch"
          />

          {/* Sort */}
          <div className="sm-sort">
            <span className="sm-sort-label">Sort:</span>
            {(['eta', 'risk', 'route'] as SortKey[]).map((k) => (
              <button
                key={k}
                className={`sm-sort-btn${sortKey === k ? ' sm-sort-btn--active' : ''}`}
                onClick={() => setSortKey(k)}
              >
                {k === 'eta' ? 'ETA' : k === 'risk' ? 'Risk' : 'Route'}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="sm-list">
          <div className="sm-list-header">
            <span className="label">Shipment</span>
            <span className="label">Exception</span>
            <span className="label">Progress / ETA</span>
            <span className="label">Assignee</span>
          </div>

          {filtered.length === 0 ? (
            <div className="sm-empty">
              <span>No shipments match this filter</span>
              <button
                className="sm-sort-btn"
                onClick={() => { setSeverityFilter('All'); setExceptionFilter('All exceptions'); setSearchQuery(''); }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filtered.map((s) => (
              <div key={s.id}>
                <ShipmentRow
                  {...s}
                  active={detailId === s.id}
                  onClick={() => handleRowClick(s)}
                />
                {detailId === s.id && !s.complianceIssue && (
                  <ShipmentDetail shipment={s} />
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Shipments;
