// Live font preview — renders each candidate in the Nautical Command palette.
// Visit /__design_lab/fonts to see all options side by side.

const candidates = [
  {
    name: 'Cinzel',
    import: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap',
    style: "'Cinzel', serif",
    note: 'Roman inscription — naval insignia, ship registry. Commands authority.',
    weight: 600,
  },
  {
    name: 'Spectral',
    import: 'https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,600;1,400&display=swap',
    style: "'Spectral', serif",
    note: 'Screen-optimised editorial. Precise, cold, intelligence-platform feel.',
    weight: 400,
  },
  {
    name: 'IM Fell English',
    import: 'https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&display=swap',
    style: "'IM Fell English', serif",
    note: '17th-century revival. Admiralty chart, ship\'s logbook, weathered elegance.',
    weight: 400,
  },
  {
    name: 'Rufina',
    import: 'https://fonts.googleapis.com/css2?family=Rufina:wght@400;700&display=swap',
    style: "'Rufina', serif",
    note: 'Art deco spurs, vintage cartography. Premium ornate maritime brand.',
    weight: 400,
  },
  {
    name: 'Libre Baskerville',
    import: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap',
    style: "'Libre Baskerville', serif",
    note: 'Sturdy, reliable, maximum legibility at every size. Understated authority.',
    weight: 400,
  },
  {
    name: 'Cormorant Garamond',
    import: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&display=swap',
    style: "'Cormorant Garamond', serif",
    note: 'Ultra-refined, very high contrast. Luxury editorial — think FT Weekend.',
    weight: 600,
  },
  {
    name: 'Lora',
    import: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&display=swap',
    style: "'Lora', serif",
    note: 'Calligraphic roots, sturdy at small sizes. Warm, readable, journalistic.',
    weight: 600,
  },
  {
    name: 'DM Serif Display',
    import: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap',
    style: "'DM Serif Display', serif",
    note: 'Modern high-contrast serif. Clean, fashionable, works at large display sizes.',
    weight: 400,
  },
];

// Inject all font links at page load
candidates.map(c => {
  const el = document.createElement('link');
  el.rel = 'stylesheet';
  el.href = c.import;
  document.head.appendChild(el);
  return el;
});
// cleanup on unmount is handled below

const BG      = '#04101C';
const SURFACE = '#0A1A28';
const BORDER  = 'rgba(204,158,46,0.18)';
const BRASS   = '#CC9E2E';
const INK1    = '#EAE2CC';
const INK2    = 'rgba(234,226,204,0.55)';
const INK3    = 'rgba(234,226,204,0.30)';
const MONO    = "'JetBrains Mono', monospace";

export default function FontPreviewPage() {
  return (
    <div style={{ background: BG, minHeight: '100vh', padding: '0 0 80px' }}>

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${BORDER}`,
        padding: '18px 32px',
        display: 'flex',
        alignItems: 'baseline',
        gap: '16px',
        background: SURFACE,
      }}>
        <span style={{ fontFamily: MONO, fontSize: '9px', letterSpacing: '0.12em', color: BRASS, textTransform: 'uppercase' }}>
          Nautical Command
        </span>
        <span style={{ color: INK2, fontSize: '11px' }}>Headline font candidates</span>
        <span style={{ marginLeft: 'auto', fontFamily: MONO, fontSize: '9px', color: INK3 }}>
          {candidates.length} options · pick the one that feels right
        </span>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '1px',
        background: BORDER,
        margin: '32px',
        border: `1px solid ${BORDER}`,
      }}>
        {candidates.map(font => (
          <div key={font.name} style={{
            background: SURFACE,
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}>
            {/* Font name label */}
            <div style={{
              fontFamily: MONO,
              fontSize: '8px',
              letterSpacing: '0.10em',
              color: BRASS,
              textTransform: 'uppercase',
              borderBottom: `1px solid ${BORDER}`,
              paddingBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}>
              <span>{font.name}</span>
              <span style={{ color: INK3, fontFamily: MONO, fontSize: '8px' }}>Google Fonts</span>
            </div>

            {/* Brand / large headline */}
            <div style={{ fontFamily: font.style, fontSize: '32px', fontWeight: font.weight, color: BRASS, letterSpacing: '-0.01em', lineHeight: 1 }}>
              PortSight
            </div>

            {/* Section title */}
            <div style={{ fontFamily: font.style, fontSize: '22px', fontWeight: font.weight, color: INK1, lineHeight: 1.1 }}>
              Risk index
            </div>

            {/* Route / mid-size */}
            <div style={{ fontFamily: font.style, fontSize: '17px', fontWeight: font.weight, color: INK1 }}>
              CN-SHG → US-LGB
            </div>

            {/* Metric value */}
            <div style={{ fontFamily: font.style, fontSize: '52px', fontWeight: font.weight, color: BRASS, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              72
            </div>

            {/* Body text (stays Inter) */}
            <div style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              color: INK2,
              lineHeight: 1.6,
            }}>
              {font.note}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
