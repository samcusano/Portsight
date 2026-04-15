# Portsight Design System

Freight operations platform. Dense, data-heavy, professional. Dark theme.
Aesthetic: industrial precision — a Reuters terminal crossed with a naval chart room.

---

## Tokens

All tokens live in `src/index.css :root`.

### Color

#### Surfaces
| Token | Value | Use |
|-------|-------|-----|
| `--bg-color` | `#04101C` | App background |
| `--surface` | `#0A1A28` | Primary card/sidebar surface |
| `--surface-2` | `#0F2236` | Secondary surface, dropdown backgrounds |

#### Text (ink scale)
| Token | Value | Use |
|-------|-------|-----|
| `--text-color` | `#EAE2CC` | Primary text |
| `--ink-2` | `rgba(234,226,204,0.65)` | Secondary text |
| `--ink-3` | `rgba(234,226,204,0.55)` | Tertiary text — minimum for readable copy (≥4.5:1) |
| `--ink-4` | `rgba(234,226,204,0.20)` | Decorative only — never use for readable text |

#### Lines
| Token | Value | Use |
|-------|-------|-----|
| `--line-color` | `rgba(204,158,46,0.20)` | Default dividers |
| `--line-em` | `rgba(204,158,46,0.32)` | Emphasized borders, active states |

#### Brand accent (brass)
| Token | Value | Use |
|-------|-------|-----|
| `--brass` | `#CC9E2E` | Primary accent, CTAs, active states |
| `--brass-dim` | `rgba(204,158,46,0.08)` | Hover backgrounds |
| `--brass-border` | `rgba(204,158,46,0.22)` | Brass-tinted borders |
| `--brass-dark` | `#B8900A` | Hover state on filled brass buttons |
| `--brass-light` | `#d4a83a` | Hover state on ghost/text brass elements |

#### Semantic — Critical
| Token | Value | Use |
|-------|-------|-----|
| `--critical-red` | `#DC5A28` | Critical alerts, overdue items |
| `--critical-dim` | `rgba(220,90,40,0.10)` | Critical background tint |
| `--critical-border` | `rgba(220,90,40,0.28)` | Critical borders |

#### Semantic — Warning
| Token | Value | Use |
|-------|-------|-----|
| `--brass` | (see above) | Warning accent shares brass |
| `--brass-dim` | (see above) | Warning background tint |
| `--brass-border` | (see above) | Warning borders |

#### Semantic — Clear (on track)
| Token | Value | Use |
|-------|-------|-----|
| `--clear` | `#329164` | Success, on-track status |
| `--clear-dim` | `rgba(50,145,100,0.08)` | Clear background tint |
| `--clear-border` | `rgba(50,145,100,0.24)` | Clear borders |

#### Utility
| Token | Value | Use |
|-------|-------|-----|
| `--overlay-dark` | `rgba(4,16,28,0.75)` | Modal/dialog backdrop |

---

### Typography

#### Families
| Token | Value |
|-------|-------|
| `--font-serif` | `'Nyght Serif', Charter, Georgia, serif` |
| `--font-sans` | `'Geist', system-ui, 'Helvetica Neue', sans-serif` |
| `--font-mono` | `'Geist Mono', ui-monospace, 'SF Mono', monospace` |

#### Scale (informal — not yet tokenized)
| Size | Use |
|------|-----|
| `8px` | Global `.label` utility, captions |
| `9px` mono | Action buttons, badges, metadata tags |
| `10px` mono | Toolbar filters, column labels, form labels |
| `11–13px` sans | Body copy, descriptions |
| `14–15px` sans | Row names, primary row content |
| `18–26px` sans | Page/section headings |
| `32–48px` mono | KPI/stat values |

Letter-spacing conventions:
- Mono labels: `0.03em`
- All-caps removed globally — sentence case throughout

---

### Spacing

| Token | Value | Use |
|-------|-------|-----|
| `--space-1` | `4px` | Tight gaps within components |
| `--space-2` | `8px` | Component internal gaps |
| `--space-3` | `12px` | Grouped element gaps |
| `--space-4` | `16px` | Section internal spacing |
| `--space-5` | `24px` | Section padding (= `--spacing-unit`) |
| `--space-6` | `32px` | Large section gaps |
| `--space-8` | `48px` | Page-level spacing, empty states |
| `--spacing-unit` | `24px` | Default horizontal page padding |

Values not on this scale (`5px`, `7px`, `10px`, `14px`) should be replaced on next refactor pass.

---

### Timing

| Token | Value | Use |
|-------|-------|-----|
| `--duration-ultra-fast` | `75ms` | Scale/press micro-interactions |
| `--duration-fast` | `100ms` | Fast color/border transitions |
| `--duration-base` | `150ms` | Default hover transitions |
| `--duration-slow` | `300ms` | Expand/collapse, progress bars |

Easing conventions (Disney principles):
- Entrance: `ease-out` (arrive fast, settle gently)
- Exit: `ease-in` (build momentum before departure)
- Hover/color: `ease` or `ease-out`
- Press/active: no easing — instant down, `0.08s` ease-out release

---

### Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `--radius-sm` | `1px` | Subtle rounding on tags/badges |
| `--radius-md` | `2px` | Cards, inputs |
| `--radius-lg` | `4px` | Larger containers |

Note: Most UI uses no border-radius (sharp corners = industrial aesthetic). Radius tokens are for elements that benefit from slight softening.

---

## Components

All shared components live in `src/components/shared/`.

### Button
**File:** `src/components/shared/Button.tsx`
**Variants:** `primary` | `outline` | `action` | `link`

Use the shared `<Button>` component for all CTAs. Do not create one-off button classes.

```tsx
<Button variant="primary">Confirm & Submit</Button>
<Button variant="outline">Cancel</Button>
<Button variant="action">View documents</Button>
<Button variant="link">View details →</Button>
```

Active state: all buttons must have `transform: scale(0.97–0.98)` on `:active`.

**Filter button pattern:** Use `.btn-filter` / `.btn-filter--active` for compact sort and period-selector buttons (previously `sm-sort-btn`, `rp-period-btn`). Defined in `src/index.css`.

`assign-action` is one-off — it has unique padding for the assignments context. Acceptable.

---

### FilterDropdown
**File:** `src/components/shared/FilterDropdown.tsx`
**Used on:** Fleet (Shipments), Command (Dashboard)

Generic typed dropdown filter. Use instead of inline `<select>` or chip arrays.

```tsx
<FilterDropdown
  label="Status"
  options={SEVERITY_FILTERS}
  value={filter}
  onChange={setFilter}
  countFor={(v) => counts[v]}
/>
```

---

### StatusIndicator
**File:** `src/components/shared/StatusIndicator.tsx`
**Variants:** `live` | `updating` | `offline`

Used in the sidebar footer. The `live` dot pulses at 2.5s; `updating` at 1s.

---

### AlertBanner
**File:** `src/components/shared/AlertBanner.tsx`
**Variants:** `critical` | `warning` | `info`

Full-width alert bar at the top of page content. Dismissible.

---

### Sparkline
**File:** `src/components/shared/Sparkline.tsx`

Inline SVG line chart for trend data. 56×18px default. Color follows semantic tier:
- Upward trend: `var(--brass)`
- Downward trend: `var(--critical-red)`
- Flat: `var(--ink-3)`

---

### ShipmentRow
**File:** `src/components/shared/ShipmentRow.tsx`

Complex row component used on Fleet page. Contains severity indicator, progress bar, exception badge, compliance issue link.

---

### StatusBadge
**File:** `src/components/shared/StatusBadge.tsx`
**Variants:** `default` | `critical` | `watch` | `clear` | `dashed`

Use for all non-interactive status/severity labels. Do not use `.dr-tag--severity-*` or `.assign-task-badge` directly.

```tsx
<StatusBadge variant="critical">Critical</StatusBadge>
<StatusBadge variant="watch">Watch</StatusBadge>
<StatusBadge variant="clear">On Track</StatusBadge>
<StatusBadge>3</StatusBadge>  {/* default — task count, count badge */}
```

---

### Sparkline, Timeline, Tooltip, SearchBar, DataRow, InsightBlock, MetricBlock, SectionHeader
Standard shared utilities. See individual files in `src/components/shared/`.

---

## Patterns

### Page Layout
Every page follows: `<div className="*-page">` → sticky header/toolbar → scrollable `<main>`.

```
.page
  .toolbar (filters, search, sort)
  <main>
    .list or .grid
```

### Stat Strip
A horizontal row of 3–4 KPI values with dividers. Used on Command (ExposureSummaryBar) and Assignments.
KPI values animate in with `useCountUp` hook from `src/hooks/useCountUp.ts`.

### Severity Tiers
Three semantic tiers used consistently across the app:

| Tier | Color token | Dim | Border |
|------|-------------|-----|--------|
| Critical | `--critical-red` | `--critical-dim` | `--critical-border` |
| Warning | `--brass` | `--brass-dim` | `--brass-border` |
| Clear | `--clear` | `--clear-dim` | `--clear-border` |

Left-edge coloring on rows uses `border-left: 3px solid var(--[tier])`.

### Row Entrance Animation
All list rows use the `.row-enter` CSS class with `--row-i` CSS property for stagger:

```tsx
<div className="my-item row-enter" style={{ '--row-i': index } as React.CSSProperties}>
```

Max stagger: 35ms per item. Do not exceed 50ms (physics-no-excessive-stagger).

### Empty States
All empty states use `padding: var(--space-8)` with centered `.label` text.

```tsx
<div className="my-empty-state">
  <span className="label">No items match your filters</span>
</div>
```

### Confirmation Modal
For destructive/consequential actions, use the `.cp-confirm-overlay` / `.cp-confirm` pattern.
Overlay: `background: var(--overlay-dark)`.

---

## Known Drift (Backlog)

Remaining items after April 2026 refactor pass:

1. **Spacing off-grid (partial)**: Values of `7px`, `10px`, `14px` still appear in a few places (mostly padding, not gap). Nearest grid steps: 8px → `--space-2`, 12px → `--space-3`, 16px → `--space-4`. Low priority — visual impact is minimal.

2. **Font-size tokens in page-level CSS**: Shared component CSS now uses `--font-size-*` tokens. Page-level CSS files (Compliance.css, Dashboard.css, etc.) still use hard-coded values. Migrate on next per-page audit.

3. **`assign-action` button**: Unique padding for the assignments row context. Acceptable as-is.
