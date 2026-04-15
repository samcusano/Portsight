import './card-preview.css';

// ── Mock data — three representative tasks ────────────────────────────────
interface PreviewTask {
  rank: number;
  type: 'compliance' | 'congestion' | 'regulatory' | 'shipment-exception';
  typeLabel: string;
  problem: string;
  impact: string;
  impactType: string;
  hoursLabel: string;
  hours: number;
  confidencePct: number;
  ctaLabel: string;
  urgency: 'critical' | 'warning' | 'normal';
  assignee: string;
}

const TASKS: PreviewTask[] = [
  {
    rank: 1,
    type: 'compliance',
    typeLabel: 'Compliance',
    problem: 'ISF 10+2 filing violation — FLEX-103948, departure 92% through BD-CGP → US-LGB route',
    impact: '$7,500',
    impactType: 'Fine exposure',
    hoursLabel: '6h',
    hours: 6,
    confidencePct: 85,
    ctaLabel: 'File ISF Amendment',
    urgency: 'critical',
    assignee: 'J. Park',
  },
  {
    rank: 2,
    type: 'congestion',
    typeLabel: 'Congestion',
    problem: 'US-LGB force majeure — 3.2× congestion index, 92% SLA breach probability on Q3 Electronics routing',
    impact: '~$756K',
    impactType: 'Projected loss',
    hoursLabel: '3d',
    hours: 72,
    confidencePct: 92,
    ctaLabel: 'View Affected Shipments',
    urgency: 'warning',
    assignee: 'S. Kimura',
  },
  {
    rank: 3,
    type: 'regulatory',
    typeLabel: 'Regulatory',
    problem: 'CBAM Phase II mandatory declarations for steel imports — 3 shipments in scope before Jan 2026 enforcement',
    impact: '$25,000',
    impactType: 'Portfolio risk',
    hoursLabel: '20d',
    hours: 480,
    confidencePct: 99,
    ctaLabel: 'Open Compliance Queue',
    urgency: 'normal',
    assignee: 'L. Chen',
  },
];

// ── Treatment A — Chronicle ───────────────────────────────────────────────
// Current design: 4px left border, badge, right-aligned data cluster.
// Compact, table-like, information-dense.
function TreatmentA({ tasks }: { tasks: PreviewTask[] }) {
  return (
    <div className="cp-list">
      {tasks.map(t => (
        <div key={t.rank} className={`cp-a cp-a--${t.urgency} cp-a--${t.type}`}>
          <div className="cp-a__header">
            <span className="cp-a__rank">{String(t.rank).padStart(2, '0')}</span>
            <span className={`cp-a__badge cp-a__badge--${t.urgency}`}>{t.typeLabel}</span>
            <span className="cp-a__problem">{t.problem}</span>
            <span className="cp-a__meta">
              <span className="cp-a__impact">
                <span className="cp-a__impact-val">{t.impact}</span>
                <span className="cp-a__impact-lbl">{t.impactType}</span>
              </span>
              <span className={`cp-a__time cp-a__time--${t.urgency}`}>{t.hoursLabel}</span>
              <span className="cp-a__conf">
                <span className="cp-a__conf-val">{t.confidencePct}%</span>
                <span className="cp-a__conf-lbl">conf.</span>
              </span>
            </span>
            <button className="cp-a__cta">{t.ctaLabel}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Treatment B — Manifest ────────────────────────────────────────────────
// Two-line entry: problem statement on line 1 (full, readable),
// compact mono metadata strip on line 2. CTA is an inline text link.
// Maritime manifest / legal document feel.
function TreatmentB({ tasks }: { tasks: PreviewTask[] }) {
  return (
    <div className="cp-list">
      {tasks.map(t => (
        <div key={t.rank} className={`cp-b cp-b--${t.urgency}`}>
          <div className="cp-b__main">
            <div className="cp-b__rank-col">
              <span className="cp-b__rank">{String(t.rank).padStart(2, '0')}</span>
              <span className="cp-b__rule" />
            </div>
            <div className="cp-b__body">
              <p className="cp-b__problem">{t.problem}</p>
              <div className="cp-b__strip">
                <span className={`cp-b__type cp-b__type--${t.type}`}>{t.typeLabel}</span>
                <span className="cp-b__sep">—</span>
                <span className={`cp-b__deadline cp-b__deadline--${t.urgency}`}>{t.hoursLabel} remaining</span>
                <span className="cp-b__sep">—</span>
                <span className="cp-b__impact">{t.impact} {t.impactType.toLowerCase()}</span>
                <span className="cp-b__sep">—</span>
                <span className="cp-b__conf">{t.confidencePct}% conf.</span>
                <span className="cp-b__sep">—</span>
                <button className="cp-b__cta">{t.ctaLabel} →</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Treatment C — Terminal ────────────────────────────────────────────────
// Five fixed-width tabular columns, all monospaced.
// No badge — type label is fixed-width colored text.
// No CTA button in row — entire row is the action.
// Bloomberg / commodity trading terminal feel.
function TreatmentC({ tasks }: { tasks: PreviewTask[] }) {
  return (
    <div className="cp-list cp-list--terminal">
      <div className="cp-c__header-row">
        <span className="cp-c__col cp-c__col--rank">#</span>
        <span className="cp-c__col cp-c__col--type">Type</span>
        <span className="cp-c__col cp-c__col--problem">Problem</span>
        <span className="cp-c__col cp-c__col--impact">Exposure</span>
        <span className="cp-c__col cp-c__col--time">Deadline</span>
        <span className="cp-c__col cp-c__col--conf">Conf</span>
      </div>
      {tasks.map(t => (
        <div key={t.rank} className={`cp-c cp-c--${t.urgency}`}>
          <span className="cp-c__col cp-c__col--rank">{String(t.rank).padStart(2, '0')}</span>
          <span className={`cp-c__col cp-c__col--type cp-c__type--${t.type}`}>
            {t.typeLabel.substring(0, 11)}
          </span>
          <span className="cp-c__col cp-c__col--problem">{t.problem}</span>
          <span className="cp-c__col cp-c__col--impact">{t.impact}</span>
          <span className={`cp-c__col cp-c__col--time cp-c__time--${t.urgency}`}>
            {t.urgency === 'critical' ? '▲ ' : t.urgency === 'warning' ? '▲ ' : '  '}{t.hoursLabel}
          </span>
          <span className="cp-c__col cp-c__col--conf">{t.confidencePct}%</span>
        </div>
      ))}
    </div>
  );
}

// ── Treatment D — Signal ──────────────────────────────────────────────────
// Full-bleed urgency background tint per task severity.
// Two-column card: problem + type label on left, impact hero right.
// No badge — background IS the urgency signal. No left border.
function TreatmentD({ tasks }: { tasks: PreviewTask[] }) {
  return (
    <div className="cp-list">
      {tasks.map(t => (
        <div key={t.rank} className={`cp-d cp-d--${t.urgency}`}>
          <div className="cp-d__left">
            <div className="cp-d__top">
              <span className="cp-d__rank">{String(t.rank).padStart(2, '0')}</span>
              <span className={`cp-d__type cp-d__type--${t.type}`}>{t.typeLabel}</span>
              <span className={`cp-d__time cp-d__time--${t.urgency}`}>{t.hoursLabel}</span>
            </div>
            <p className="cp-d__problem">{t.problem}</p>
            <button className="cp-d__cta">{t.ctaLabel}</button>
          </div>
          <div className="cp-d__right">
            <span className="cp-d__impact-val">{t.impact}</span>
            <span className="cp-d__impact-lbl">{t.impactType}</span>
            <span className="cp-d__conf">{t.confidencePct}% conf.</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Treatment E — Logbook ─────────────────────────────────────────────────
// Time-first hierarchy. Deadline sits in a dominant LEFT column before
// the problem statement. In an operational queue, WHEN is more urgent
// than WHAT — this treatment argues for reading time pressure first.
// Thin vertical rule separates time column from content.
function TreatmentE({ tasks }: { tasks: PreviewTask[] }) {
  return (
    <div className="cp-list">
      {tasks.map(t => (
        <div key={t.rank} className={`cp-e cp-e--${t.urgency}`}>
          {/* Time column — dominant left anchor */}
          <div className={`cp-e__time-col cp-e__time-col--${t.urgency}`}>
            <span className="cp-e__time-val">{t.hoursLabel}</span>
            <span className="cp-e__time-lbl">remaining</span>
          </div>
          <div className="cp-e__divider" />
          {/* Content */}
          <div className="cp-e__content">
            <div className="cp-e__top">
              <span className="cp-e__rank">{String(t.rank).padStart(2, '0')}</span>
              <span className={`cp-e__badge cp-e__badge--${t.urgency}`}>{t.typeLabel}</span>
            </div>
            <p className="cp-e__problem">{t.problem}</p>
          </div>
          {/* Right cluster */}
          <div className="cp-e__right">
            <span className="cp-e__impact-val">{t.impact}</span>
            <span className="cp-e__impact-lbl">{t.impactType}</span>
            <button className="cp-e__cta">{t.ctaLabel}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Approximate normalized urgency scores for the gauge fill
// (impact × probability × timePressure / effort), scaled to 100
const GAUGE_FILLS = [72, 100, 8]; // ISF ~72%, Congestion ~100%, CBAM ~8%

// ── Treatment F — Gauge ───────────────────────────────────────────────────
// Full-width urgency fill bar spans each card. Bar fill and color encode
// the urgency score — relative to the highest-ranked task.
// Row content is minimal: rank, problem, impact, CTA.
// The bars create a scannable visual rhythm across the whole list.
function TreatmentF({ tasks }: { tasks: PreviewTask[] }) {
  return (
    <div className="cp-list">
      {tasks.map((t, i) => (
        <div key={t.rank} className={`cp-f cp-f--${t.urgency}`}>
          {/* Urgency fill bar — sits above row content */}
          <div className="cp-f__bar-track">
            <div
              className={`cp-f__bar-fill cp-f__bar-fill--${t.urgency}`}
              style={{ width: `${GAUGE_FILLS[i]}%` }}
            />
          </div>
          {/* Row */}
          <div className="cp-f__row">
            <span className="cp-f__rank">{String(t.rank).padStart(2, '0')}</span>
            <span className="cp-f__problem">{t.problem}</span>
            <span className="cp-f__meta">
              <span className="cp-f__impact-val">{t.impact}</span>
              <span className="cp-f__impact-lbl">{t.impactType}</span>
            </span>
            <button className="cp-f__cta">{t.ctaLabel}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Treatment G — Wire ────────────────────────────────────────────────────
// Single-line wire-feed format. Ultra-compact — like a Reuters ticker
// or a ship's radio log. Everything flows on one line.
// Only the deadline datum gets color. No badge, no button in rest state.
// Hover reveals the CTA; the row brightens and expands slightly.
function TreatmentG({ tasks }: { tasks: PreviewTask[] }) {
  return (
    <div className="cp-list">
      {tasks.map(t => (
        <div key={t.rank} className={`cp-g cp-g--${t.urgency}`}>
          <span className="cp-g__rank">{String(t.rank).padStart(2, '0')}</span>
          <span className={`cp-g__type cp-g__type--${t.type}`}>{t.typeLabel}</span>
          <span className="cp-g__gap" />
          <span className="cp-g__problem">{t.problem}</span>
          <span className="cp-g__gap" />
          <span className={`cp-g__time cp-g__time--${t.urgency}`}>{t.hoursLabel}</span>
          <span className="cp-g__sep" />
          <span className="cp-g__impact">{t.impact}</span>
          <span className="cp-g__sep" />
          <span className="cp-g__conf">{t.confidencePct}%</span>
          <button className="cp-g__cta">{t.ctaLabel} →</button>
        </div>
      ))}
    </div>
  );
}

// ── Treatment H — Dossier ─────────────────────────────────────────────────
// Intelligence briefing card. Two-zone: problem statement headline above,
// labeled metadata grid below. An 8px colored classification band anchors
// the left edge. Like a case file or an ops dossier.
// CTA is a text link in the metadata row, right-aligned.
function TreatmentH({ tasks }: { tasks: PreviewTask[] }) {
  return (
    <div className="cp-list">
      {tasks.map(t => (
        <div key={t.rank} className={`cp-h cp-h--${t.type}`}>
          {/* Classification band — colored vertical stripe, left edge */}
          <div className={`cp-h__band cp-h__band--${t.urgency}`} />
          <div className="cp-h__body">
            {/* Header zone — rank + headline */}
            <div className="cp-h__header">
              <span className="cp-h__rank">{String(t.rank).padStart(2, '0')}</span>
              <p className="cp-h__problem">{t.problem}</p>
            </div>
            {/* Metadata grid — labeled data cells */}
            <div className="cp-h__meta">
              <div className="cp-h__cell">
                <span className="cp-h__cell-lbl">Type</span>
                <span className={`cp-h__cell-val cp-h__cell-val--type-${t.type}`}>{t.typeLabel}</span>
              </div>
              <div className="cp-h__cell">
                <span className="cp-h__cell-lbl">Deadline</span>
                <span className={`cp-h__cell-val cp-h__cell-val--${t.urgency}`}>{t.hoursLabel}</span>
              </div>
              <div className="cp-h__cell">
                <span className="cp-h__cell-lbl">Exposure</span>
                <span className="cp-h__cell-val">{t.impact}</span>
              </div>
              <div className="cp-h__cell">
                <span className="cp-h__cell-lbl">Confidence</span>
                <span className="cp-h__cell-val">{t.confidencePct}%</span>
              </div>
              <div className="cp-h__cell">
                <span className="cp-h__cell-lbl">Assignee</span>
                <span className="cp-h__cell-val">{t.assignee}</span>
              </div>
              <div className="cp-h__cell cp-h__cell--cta">
                <button className="cp-h__cta">{t.ctaLabel} →</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
const TREATMENTS = [
  {
    id: 'A',
    name: 'Chronicle',
    desc: 'Dense row — left border, badge, right-aligned data cluster. Current direction.',
  },
  {
    id: 'B',
    name: 'Manifest',
    desc: 'Two-line entry — problem statement on line 1, compact mono metadata strip on line 2. CTA is a text link.',
  },
  {
    id: 'C',
    name: 'Terminal',
    desc: 'Five fixed-width tabular columns, all mono. No badge. Type label is colored text. Bloomberg feel.',
  },
  {
    id: 'D',
    name: 'Signal',
    desc: 'Full-bleed urgency tint per severity. Two-column: problem left, impact hero right. Taller cards.',
  },
  {
    id: 'E',
    name: 'Logbook',
    desc: 'Time-first hierarchy. Deadline anchors the left column — you read WHEN before WHAT. Vertical rule separates time from content.',
  },
  {
    id: 'F',
    name: 'Gauge',
    desc: 'Full-width urgency fill bar above each row, proportional to urgency score. Row itself is minimal. Bar creates scannable visual rhythm.',
  },
  {
    id: 'G',
    name: 'Wire',
    desc: "Single-line wire-feed format. Ultra-compact. Like a Reuters ticker or ship\u2019s radio log. Only deadline gets color. CTA appears on hover.",
  },
  {
    id: 'H',
    name: 'Dossier',
    desc: 'Intelligence briefing card. Problem headline above, labeled metadata grid below. 8px classification band at left edge.',
  },
];

const CardPreview = () => (
  <div className="cp-scroll-root">
  <div className="cp-page">
    <div className="cp-page-header">
      <h1 className="cp-page-title">Card Treatment Lab</h1>
      <p className="cp-page-sub">Eight approaches to the operational queue row. Choose one to apply globally.</p>
    </div>

    {TREATMENTS.map((t, i) => {
      const Component = [TreatmentA, TreatmentB, TreatmentC, TreatmentD, TreatmentE, TreatmentF, TreatmentG, TreatmentH][i];
      return (
        <section key={t.id} className="cp-section">
          <div className="cp-section-header">
            <span className="cp-section-id">{t.id}</span>
            <div>
              <h2 className="cp-section-name">{t.name}</h2>
              <p className="cp-section-desc">{t.desc}</p>
            </div>
          </div>
          <div className="cp-section-body">
            <Component tasks={TASKS} />
          </div>
        </section>
      );
    })}
  </div>
  </div>
);

export default CardPreview;
