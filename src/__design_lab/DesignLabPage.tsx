import { useState } from 'react';
import VariantA from './variants/VariantA';
import VariantB from './variants/VariantB';
import VariantC from './variants/VariantC';
import VariantD from './variants/VariantD';
import { FeedbackOverlay } from './FeedbackOverlay';

const VARIANTS = [
  {
    id: 'A',
    label: 'Fleet Mirror',
    desc: 'Fleet (Shipments) row language. 4-column grid: identity + severity dot, failure mode, time-remaining progress bar, exposure + open link. Inherits dr-identity, dr-progress, dr-meta.',
    component: VariantA,
  },
  {
    id: 'B',
    label: 'Command Queue',
    desc: 'TaskCard / operational-queue language. Rank number + vertical brass rule + body column. Failure mode as the headline. Metadata strip below: type — name — deadline — exposure — status.',
    component: VariantB,
  },
  {
    id: 'C',
    label: 'Logbook Dense',
    desc: 'Maximum information density. All monospace. 8-column grid with clean separators. Status as symbol (●/◐/○). Terminal signal aesthetic — every character earns its place.',
    component: VariantC,
  },
  {
    id: 'D',
    label: 'Signal Stack',
    desc: 'Card-strip rows with colored urgency edge (red/amber/green). Avatar prominent. Two-line layout: name + exposure + time on top; failure mode + type tag + status below. Feels like a notification stack.',
    component: VariantD,
  },
] as const;

const labStyles = `
  .dl-root { font-family: 'Inter', system-ui, sans-serif; }
  .dl-bar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 10000;
    background: #0D0D0D;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: stretch;
    height: 44px;
  }
  .dl-logo {
    font-family: 'Bodoni Moda', Georgia, serif;
    font-size: 14px;
    color: #C9A84C;
    padding: 0 16px;
    display: flex;
    align-items: center;
    border-right: 1px solid rgba(255,255,255,0.08);
    white-space: nowrap;
    gap: 8px;
  }
  .dl-logo-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
    letter-spacing: 0.10em;
    color: rgba(201,168,76,0.5);
    text-transform: uppercase;
  }
  .dl-tabs { display: flex; flex: 1; overflow-x: auto; }
  .dl-tab {
    padding: 0 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    border: none;
    background: none;
    cursor: pointer;
    border-right: 1px solid rgba(255,255,255,0.06);
    transition: background 0.15s;
    white-space: nowrap;
  }
  .dl-tab:hover { background: rgba(255,255,255,0.04); }
  .dl-tab.active { background: rgba(201,168,76,0.10); border-bottom: 2px solid #C9A84C; }
  .dl-tab-id {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    color: rgba(240,237,228,0.4);
  }
  .dl-tab.active .dl-tab-id { color: #C9A84C; }
  .dl-tab-name {
    font-size: 11px;
    color: rgba(240,237,228,0.5);
  }
  .dl-tab.active .dl-tab-name { color: rgba(240,237,228,0.9); }
  .dl-hint {
    display: flex;
    align-items: center;
    padding: 0 16px;
    border-left: 1px solid rgba(255,255,255,0.08);
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.06em;
    color: rgba(240,237,228,0.25);
    white-space: nowrap;
  }
  .dl-desc-bar {
    position: fixed;
    top: 44px; left: 0; right: 0;
    z-index: 9999;
    background: #161616;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 8px 16px;
    display: flex;
    align-items: baseline;
    gap: 12px;
  }
  .dl-desc-id {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    color: #C9A84C;
    flex-shrink: 0;
  }
  .dl-desc-name {
    font-size: 12px;
    font-weight: 600;
    color: rgba(240,237,228,0.8);
    flex-shrink: 0;
  }
  .dl-desc-text {
    font-size: 11px;
    color: rgba(240,237,228,0.4);
  }
  .dl-content { padding-top: 88px; }
`;

export default function DesignLabPage() {
  const [active, setActive] = useState<typeof VARIANTS[number]['id']>('A');
  const current = VARIANTS.find(v => v.id === active)!;
  const ActiveComponent = current.component;

  return (
    <div className="dl-root">
      <style dangerouslySetInnerHTML={{ __html: labStyles }} />

      {/* Tab bar */}
      <div className="dl-bar">
        <div className="dl-logo">
          PortSight
          <span className="dl-logo-tag">Design Lab · Assignments</span>
        </div>
        <div className="dl-tabs" role="tablist" aria-label="Design variants">
          {VARIANTS.map(v => (
            <button
              key={v.id}
              className={`dl-tab${active === v.id ? ' active' : ''}`}
              role="tab"
              aria-selected={active === v.id}
              onClick={() => setActive(v.id)}
            >
              <span className="dl-tab-id">{v.id}</span>
              <span className="dl-tab-name">{v.label}</span>
            </button>
          ))}
        </div>
        <div className="dl-hint">Click + Add Feedback to annotate</div>
      </div>

      {/* Description bar */}
      <div className="dl-desc-bar">
        <span className="dl-desc-id">Variant {current.id}</span>
        <span className="dl-desc-name">{current.label}</span>
        <span className="dl-desc-text">{current.desc}</span>
      </div>

      {/* Active variant */}
      <div className="dl-content" role="tabpanel" data-variant={current.id}>
        <ActiveComponent />
      </div>

      <FeedbackOverlay targetName="Assignments List" />
    </div>
  );
}
