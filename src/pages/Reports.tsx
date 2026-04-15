import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/shared/StatusBadge';
import Button from '../components/shared/Button';
import DataRow from '../components/shared/DataRow';
import Sparkline from '../components/shared/Sparkline';
import './Reports.css';

const DATE_RANGES = ['7D', '30D', '90D', 'YTD', '12M'] as const;
type DateRange = typeof DATE_RANGES[number];


// ── Briefing data keyed by period ─────────────────────────────────────────
const BRIEFING = {
  events: [
    {
      id: 'EVT-001',
      severity: 'critical' as const,
      title: 'Force majeure — Port of Long Beach',
      impact: '$756K',
      impactLabel: 'projected exposure',
      body: 'Operations halted at US-LGB. FLEX-997186, FLEX-884201, and FLEX-103948 are held with no confirmed recovery timeline. Congestion index is at 3.2× seasonal baseline. 92% SLA breach probability on all Q3 Electronics routing through this port.',
      outcome: 'Open',
      href: '/shipments',
      actionLabel: 'View affected shipments',
    },
    {
      id: 'EVT-002',
      severity: 'critical' as const,
      title: 'ISF 10+2 filing violation — FLEX-103948',
      impact: '$7,500',
      impactLabel: 'fine exposure',
      body: 'Importer Security Filing not submitted before CBP 24h threshold. Violation auto-triggered on departure. Vessel is 92% through the BD-CGP → US-LGB route. Amendment window is closing — 6h remaining before full fine crystallises.',
      outcome: '6h remaining',
      href: '/compliance/FLEX-103948',
      actionLabel: 'File ISF amendment',
    },
    {
      id: 'EVT-003',
      severity: 'warning' as const,
      title: 'CBAM Form 12-A carbon data mismatch — FLEX-761034',
      impact: '$8,500',
      impactLabel: 'fine exposure',
      body: '170 tCO₂e discrepancy between declared and verified carbon data is blocking Rotterdam entry. EU CBAM Phase II enforcement is active for all steel imports. Form correction has been assigned to S. Kimura — 36h window remains.',
      outcome: '36h window',
      href: '/compliance/FLEX-761034',
      actionLabel: 'Submit corrected form',
    },
  ],

  indicators: [
    {
      label: 'US-LGB congestion index',
      value: '3.2×',
      context: 'Seasonal baseline',
      trend: 'up' as const,
      spark: [1.8, 2.1, 2.4, 2.9, 3.2],
      detail: '92% SLA breach probability on current Q3 Electronics routing. Oakland dwell time: 1.8 days vs 6.1 days at Long Beach.',
    },
    {
      label: 'EU CBAM Phase II enforcement',
      value: '3',
      context: 'Shipments in scope',
      trend: 'up' as const,
      spark: [0, 0, 1, 2, 3],
      detail: 'FLEX-761034, FLEX-884201, and one additional steel shipment require CBAM declarations. Full enforcement phase begins Jan 2026 with per-shipment penalties.',
    },
    {
      label: 'EVER GIVEN reliability',
      value: '42%',
      context: 'On-time delivery',
      trend: 'down' as const,
      spark: [71, 65, 58, 50, 42],
      detail: 'Average delay 4.8 days vs fleet average 1.2 days. Reliability class C. Impacts FLEX-551847 on KR-ICN → NL-RTM route.',
    },
    {
      label: 'Regulatory hold count',
      value: '12',
      context: 'Active audits',
      trend: 'flat' as const,
      spark: [11, 13, 12, 11, 12],
      detail: 'Unchanged week-over-week. WEEE, CBAM, and ISF categories driving 78% of current holds. Insurance score holding at B+.',
    },
  ],

  decisions: [
    {
      id: 'DEC-001',
      action: 'Reroute Q3 Electronics volume — US-LGB → Oakland',
      roi: '−$136K exposure',
      roiDetail: 'Saves $136,000 of $756K total exposure. Adds 1.5 days transit. 88% probability of SLA preservation.',
      effort: 'Low' as const,
      deadline: 'Decision window closes in 72h',
      href: '/shipments',
      cta: 'Open affected shipments',
    },
    {
      id: 'DEC-002',
      action: 'Pre-clear all steel import CBAM declarations',
      roi: '−$25K exposure',
      roiDetail: 'Eliminates estimated $25,000 portfolio exposure before Jan 2026 Phase II enforcement. 3 shipments in scope.',
      effort: 'Medium' as const,
      deadline: 'Jan 2026 enforcement — act now',
      href: '/compliance',
      cta: 'Open compliance queue',
    },
    {
      id: 'DEC-003',
      action: 'Replace EVER GIVEN on KR-ICN → NL-RTM routing',
      roi: '+33pts OTD',
      roiDetail: 'Improves on-time delivery from 42% to expected 75%. Reduces average delay by 3.6 days per transit. Affects FLEX-551847.',
      effort: 'High' as const,
      deadline: 'Next booking window: Jul 14',
      href: '/shipments',
      cta: 'Review shipment',
    },
  ],
};

// ── Supporting sidebar data ────────────────────────────────────────────────
const CHART_BARS = [
  { month: 'J', value: 40 }, { month: 'F', value: 45 }, { month: 'M', value: 60 },
  { month: 'A', value: 55 }, { month: 'M', value: 70 }, { month: 'J', value: 85 },
  { month: 'J', value: 72, highlight: true }, { month: 'A', value: 65 },
  { month: 'S', value: 50 }, { month: 'O', value: 48 }, { month: 'N', value: 52 },
  { month: 'D', value: 58 },
];

// ── Components ─────────────────────────────────────────────────────────────
const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'flat' }) => (
  <span className={`rp-trend-icon rp-trend-icon--${trend}`}>
    {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'}
  </span>
);

const EffortBadge = ({ effort }: { effort: 'Low' | 'Medium' | 'High' }) => (
  <span className={`rp-effort rp-effort--${effort.toLowerCase()}`}>{effort} effort</span>
);

// ── Page ──────────────────────────────────────────────────────────────────
const Reports = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange>('YTD');
  const [exportGenerating, setExportGenerating] = useState(false);

  const handleExport = () => {
    setExportGenerating(true);
    setTimeout(() => setExportGenerating(false), 1500);
  };

  return (
    <div className="rp-page">
      {/* Period selector */}
      <div className="rp-period-bar">
        <span className="label rp-period-label">Period</span>
        {DATE_RANGES.map(r => (
          <button
            key={r}
            className={`btn-filter${dateRange === r ? ' btn-filter--active' : ''}`}
            onClick={() => setDateRange(r)}
          >
            {r}
          </button>
        ))}
        <div className="rp-period-right">
          <Button variant="outline" onClick={handleExport}>
            {exportGenerating ? 'Preparing…' : 'Export briefing'}
          </Button>
        </div>
      </div>

      <main id="main-content" className="rp-layout">
        {/* ── Main briefing ── */}
        <div className="rp-briefing">

          {/* Section 1 — What happened */}
          <section className="rp-section">
            <div className="rp-section-header">
              <span className="rp-section-num">01</span>
              <h2 className="rp-section-title">What happened</h2>
              <span className="rp-section-sub">Top risk events this period</span>
            </div>

            <div className="rp-events">
              {BRIEFING.events.map((evt) => (
                <div key={evt.id} className={`rp-event rp-event--${evt.severity}`}>
                  <div className="rp-event-top">
                    <div className="rp-event-identity">
                      <span className="rp-event-id">{evt.id}</span>
                      <StatusBadge variant={evt.severity === 'critical' ? 'critical' : 'dashed'}>
                        {evt.outcome}
                      </StatusBadge>
                    </div>
                    <span className="rp-event-impact">
                      <span className="rp-event-impact-val">{evt.impact}</span>
                      <span className="rp-event-impact-label">{evt.impactLabel}</span>
                    </span>
                  </div>
                  <h3 className="rp-event-title">{evt.title}</h3>
                  <p className="rp-event-body">{evt.body}</p>
                  <button
                    className="rp-event-link"
                    onClick={() => navigate(evt.href)}
                  >
                    {evt.actionLabel} →
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2 — What's building */}
          <section className="rp-section">
            <div className="rp-section-header">
              <span className="rp-section-num">02</span>
              <h2 className="rp-section-title">What's building</h2>
              <span className="rp-section-sub">30-day leading indicators</span>
            </div>

            <div className="rp-indicators">
              {BRIEFING.indicators.map((ind, i) => (
                <div key={i} className="rp-indicator">
                  <div className="rp-indicator-top">
                    <span className="rp-indicator-label">{ind.label}</span>
                    <div className="rp-indicator-value-row">
                      <TrendIcon trend={ind.trend} />
                      <span className="rp-indicator-value">{ind.value}</span>
                      <span className="rp-indicator-context">{ind.context}</span>
                      {ind.spark && (
                        <Sparkline
                          data={ind.spark}
                          color={ind.trend === 'down' ? 'var(--critical-red)' : ind.trend === 'flat' ? 'var(--ink-3)' : 'var(--brass)'}
                        />
                      )}
                    </div>
                  </div>
                  <p className="rp-indicator-detail">{ind.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 — What to decide */}
          <section className="rp-section">
            <div className="rp-section-header">
              <span className="rp-section-num">03</span>
              <h2 className="rp-section-title">What to decide</h2>
              <span className="rp-section-sub">Recommended actions with estimated ROI</span>
            </div>

            <div className="rp-decisions">
              {BRIEFING.decisions.map((dec, i) => (
                <div key={dec.id} className="rp-decision">
                  <div className="rp-decision-rank">{String(i + 1).padStart(2, '0')}</div>
                  <div className="rp-decision-body">
                    <div className="rp-decision-top">
                      <h3 className="rp-decision-action">{dec.action}</h3>
                      <span className="rp-decision-roi">{dec.roi}</span>
                    </div>
                    <p className="rp-decision-detail">{dec.roiDetail}</p>
                    <div className="rp-decision-meta">
                      <EffortBadge effort={dec.effort} />
                      <span className="rp-decision-deadline">{dec.deadline}</span>
                      <button
                        className="rp-event-link"
                        onClick={() => navigate(dec.href)}
                      >
                        {dec.cta} →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Supporting sidebar ── */}
        <aside className="rp-sidebar">
          {/* Risk timeline mini-chart */}
          <div className="rp-sidebar-block">
            <span className="label rp-sidebar-title">Exposure score (12M)</span>
            <div className="rp-mini-chart">
              {CHART_BARS.map((bar, i) => (
                <div
                  key={i}
                  className={`rp-bar${bar.highlight ? ' rp-bar--highlight' : ''}`}
                  style={{ height: `${bar.value}%` }}
                  title={`${bar.month}: ${bar.value}`}
                />
              ))}
            </div>
            <div className="rp-chart-meta">
              <DataRow label={<span className="label">Peak</span>} value={<strong>85 (JUN)</strong>} />
              <DataRow label={<span className="label">YoY volatility</span>} value={<strong>+12.4%</strong>} />
              <DataRow label={<span className="label">Projected loss</span>} value={<strong>$14.8M</strong>} />
            </div>
          </div>

          {/* Compliance inventory */}
          <div className="rp-sidebar-block">
            <span className="label rp-sidebar-title">Compliance inventory (YTD)</span>
            <div className="rp-compliance-grid">
              <div className="rp-compliance-cell">
                <span className="rp-compliance-num">924</span>
                <span className="label">Passed</span>
              </div>
              <div className="rp-compliance-cell rp-compliance-cell--flagged">
                <span className="rp-compliance-num rp-compliance-num--flagged">112</span>
                <span className="label">Flagged</span>
              </div>
            </div>
            <p className="rp-compliance-note">
              Primary flag: Origin Certificate Discrepancy (44 cases)
            </p>
            <div className="rp-fines-block">
              <span className="label">Cumulative fines</span>
              <span className="rp-fines-val">$242,000</span>
              <span className="label rp-fines-trend">+14% vs prior year</span>
            </div>
          </div>

          {/* Regulatory risks */}
          <div className="rp-sidebar-block" style={{ borderBottom: 'none' }}>
            <span className="label rp-sidebar-title">Regulatory risks (2025)</span>
            <div style={{ marginTop: 'var(--space-3)' }}>
              <DataRow label="EU CBAM Phase II" value={<StatusBadge variant="critical">Active</StatusBadge>} />
              <DataRow label="IMO 2024 Fuels" value={<StatusBadge>Compliant</StatusBadge>} />
              <DataRow label="UFLPA Enforcement" value={<StatusBadge>Monitoring</StatusBadge>} />
              <DataRow label="SBTi Reporting" value={<StatusBadge variant="dashed">Under review</StatusBadge>} />
            </div>
            <div style={{ marginTop: 'var(--space-4)' }}>
              <Button variant="link" onClick={handleExport}>
                Download board summary
              </Button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Reports;
