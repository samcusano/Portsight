// Variant E — Premium Ivory
// Warm cream light mode, pushed to luxury editorial quality.
// Risk score as a giant typographic statement (96px Bodoni, no dial).
// Generous whitespace, WSJ / FT financial magazine feel.

import './VariantE.css';
import { metrics, shipments, insights } from '../fixtures';

export default function VariantE() {
  return (
    <div className="ve">

      {/* Alert */}
      <div className="ve-alert" role="alert">
        <span className="ve-alert-title">Force majeure declared —</span>
        <span className="ve-alert-msg"> Port of Long Beach technical failure. HMM ALGECIRAS delayed +14 days.</span>
        <button className="ve-alert-action">View details</button>
      </div>

      {/* Header */}
      <header className="ve-header">
        <span className="ve-brand">PortSight</span>
        <nav className="ve-nav" aria-label="Main navigation">
          <a href="#" className="active">Dashboard</a>
          <a href="#">Shipments</a>
          <a href="#">Compliance</a>
          <a href="#">Reports</a>
        </nav>
        <div className="ve-header-right">
          <span className="ve-live" aria-label="Live data">
            <span className="ve-live-dot" aria-hidden="true" />
            Live
          </span>
          <span>CFO view: Global</span>
        </div>
      </header>

      {/* Body */}
      <main className="ve-body">

        {/* Col 1: Risk Index */}
        <section className="ve-col" aria-label="Risk index">
          <div className="ve-sec-head">
            <h2 className="ve-sec-title">Risk<br />index</h2>
            <span className="ve-sec-num">(01)</span>
          </div>

          <div className="ve-status">
            <span className="ve-status-dot" aria-hidden="true" />
            Real-time · Updated 2m ago
          </div>

          {/* Giant typographic risk score */}
          <div className="ve-risk-hero" aria-label={`Risk score: ${metrics.riskScore} out of 100, high risk`}>
            <span className="ve-risk-eyebrow">Exposure Score</span>
            <span className="ve-risk-num">{metrics.riskScore}</span>
            <div className="ve-risk-rule" aria-hidden="true" />
            <span className="ve-risk-badge">High Risk</span>
            <p className="ve-risk-desc">+12% above baseline this quarter</p>
          </div>

          <div className="ve-metric">
            <span className="ve-metric-label">Financial Impact</span>
            <span className="ve-metric-value critical">{metrics.financialImpact}</span>
            <span className="ve-metric-sub">↗ Projected Loss</span>
          </div>

          <div className="ve-metric">
            <span className="ve-metric-label">Regulatory Hold</span>
            <span className="ve-metric-value gold">{metrics.regulatoryHolds}</span>
            <span className="ve-metric-sub">Active Audits</span>
          </div>

          <div className="ve-metric" style={{ borderBottom: 'none', flexGrow: 1 }}>
            <span className="ve-metric-label">Insurance Score</span>
            <span className="ve-metric-value">{metrics.insuranceScore}</span>
            <span className="ve-metric-sub">Adjusted rating</span>
          </div>
        </section>

        {/* Col 2: Active Disruptions */}
        <section className="ve-col" aria-label="Active disruptions">
          <div className="ve-sec-head">
            <h2 className="ve-sec-title">Active<br />disruptions</h2>
            <span className="ve-sec-num">(02)</span>
          </div>

          <div className="ve-status">
            <span className="ve-status-dot" aria-hidden="true" />
            3 critical disruptions
          </div>

          {shipments.map(s => (
            <div
              key={s.id}
              className="ve-shipment"
              role="button"
              tabIndex={0}
              aria-label={`${s.route}, ${s.status}`}
            >
              <div className="ve-shipment-map" aria-hidden="true">
                <div className="ve-shipment-map-dot" />
              </div>
              <div className="ve-shipment-body">
                <div className="ve-shipment-top">
                  <span className="ve-shipment-route">{s.route}</span>
                  <span className={`ve-badge ${s.status.toLowerCase()}`}>{s.status}</span>
                </div>
                <div className="ve-shipment-meta">
                  <div className="ve-meta-f">
                    <span>Vessel</span>
                    <strong>{s.vessel}</strong>
                  </div>
                  {s.delay && (
                    <div className="ve-meta-f">
                      <span>Delay</span>
                      <strong className="critical">{s.delay}</strong>
                    </div>
                  )}
                  {s.clause && (
                    <div className="ve-meta-f">
                      <span>Clause</span>
                      <strong>{s.clause}</strong>
                    </div>
                  )}
                  {s.fine && (
                    <div className="ve-meta-f">
                      <span>Fine</span>
                      <strong className="critical">{s.fine}</strong>
                    </div>
                  )}
                  {s.compliance && (
                    <div className="ve-meta-f">
                      <span>Compliance</span>
                      <strong>{s.compliance}</strong>
                    </div>
                  )}
                  <div className="ve-meta-f">
                    <span>Risk</span>
                    <strong>{s.risk}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div style={{ padding: '20px 28px', marginTop: 'auto', borderTop: '1px solid var(--ve-border)' }}>
            <button style={{ background: 'none', border: '1px solid var(--ve-border-em)', color: 'var(--ve-ink-2)', padding: '12px 16px', cursor: 'pointer', fontSize: '11px', letterSpacing: '0.05em', width: '100%', transition: 'all 0.2s', fontFamily: 'inherit' }}>
              View Full Manifest
            </button>
          </div>
        </section>

        {/* Col 3: AI Legal Audit */}
        <section className="ve-col" aria-label="AI legal audit">
          <div className="ve-sec-head">
            <h2 className="ve-sec-title">AI legal<br />audit</h2>
            <span className="ve-sec-num">(03)</span>
          </div>

          <div className="ve-status" style={{ paddingBottom: '18px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#A07828', flexShrink: 0, display: 'inline-block' }} />
            AI Models · Refreshing...
          </div>

          {insights.map((ins, i) => (
            <div key={i} className="ve-insight">
              <div className="ve-insight-eyebrow">{ins.label}</div>
              <div className="ve-insight-title">{ins.title}</div>
              <p className="ve-insight-body">{ins.text}</p>
              {ins.ref && (
                <div className="ve-audit">
                  REF: {ins.ref}<br />
                  CONFIDENCE: {ins.confidence}<br />
                  TIMESTAMP: {ins.time}
                </div>
              )}
            </div>
          ))}

          <div className="ve-insight" style={{ borderBottom: 'none', flexGrow: 1 }}>
            <div className="ve-insight-eyebrow">System status</div>
            {[['Trade Data', 'Live'], ['Risk Models', 'Updating...'], ['AIS Feed', 'Live']].map(([name, val]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--ve-border)' }}>
                <span style={{ fontSize: '12px', color: 'var(--ve-ink-3)', fontWeight: 400 }}>{name}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: val === 'Live' ? 'var(--ve-clear)' : 'var(--ve-gold)' }}>{val}</span>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
