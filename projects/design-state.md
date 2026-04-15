# Portsight — Design State
Last updated: 2026-04-09

## Decisions Log

### Dashboard — Decision-First Queue (Direction B)
**Chosen:** Replace 3-panel cockpit with ranked decision queue.  
**Rationale:** The cockpit model fails the primary test — users can't immediately answer "what do I do right now?" A ranked queue with dollar impact + time remaining + single CTA per item serves the core operational need. Situational awareness lives *inside* each item as expandable context, not alongside it.  
**Rejected:** System health cockpit (Direction A) — right model in principle but requires opinionated, data-rich panels to work. Build this after the product has real data fidelity.  
**Downstream effect:** RiskIndex, ActiveDisruptions, and AILegalAudit become data sources feeding task cards — not standalone panels.

---

### Shipments — Exception-First List (Direction A)
**Chosen:** Remove map. Replace with richer exception-handling list: prominent progress bars, ETA countdown, compliance status explicit, exception type dimension added to filters, mini-timeline in expanded detail.  
**Rationale:** The map is a beautiful lie — hardcoded CSS percentages, no real AIS data, delivers no operational value over the list. Exception management is the real job; the list should be excellent at it. Map returns when real AIS data exists.  
**Rejected:** Map rebuild (Direction B) — right vision but wrong time. Real map requires AIS data integration, coordinate rendering, clustering. Build it when data is real.  
**Taste signal:** Prefers functional excellence over visual impressiveness when they compete for space.

---

### Compliance — Triage Board (Direction B)
**Chosen:** Replace 5-step wizard with kanban triage board (Open → In Progress → Submitted → Resolved) + single-screen action view per violation. Mandatory review embedded as confirmation sheet before submission, not a separate step.  
**Rationale:** The wizard doesn't scale to multi-violation scenarios (UFLPA-style enforcement creates 5–20 simultaneous compliance holds). Parallel violation management is the realistic operational scenario. Triage board enables batch workflow without removing completeness checks.  
**Rejected:** Wizard + fast track (Direction A) — correct for single violations, insufficient for scale. Fast track is a patch; board is a structural fix.  
**Constraint:** Confirmation sheet before submission must be complete (all required fields, document uploaded, authority contact shown) — the wizard's review step must be replicated, not eliminated.

---

### Reports — Intelligence Briefing (Direction A)
**Chosen:** Replace chart grid with narrative intelligence briefing: (1) What happened — top 3 risk events with dollar impact, (2) What's building — 30-day leading indicators, (3) What to decide — 2–3 recommended actions with estimated ROI. Charts move to sidebar supporting narrative.  
**Rationale:** CFOs and risk officers open Reports to make decisions, not to interpret charts. $14.8M projected loss with no "so what" guidance is not useful. The briefing model answers the question the chart model raises without answering.  
**Rejected:** Fixed analytics grid (Direction B) — necessary but insufficient. Working filters and real exports are prerequisites, not the destination. Build them under the briefing format.  
**Taste signal:** Prefers narrative + editorial stance over neutral data display for senior stakeholder surfaces.

---

## Product Direction Signal

These four decisions together define a coherent product thesis:

**Portsight is a decision-support tool, not a monitoring tool.**

Every page now answers a specific question:
- Dashboard → *What do I act on right now, in what order?*
- Shipments → *Which shipments are off-plan and why?*
- Compliance → *What violations need resolution, and which can I batch?*
- Reports → *What does our risk exposure mean and what should we do about it?*

The rejected directions (cockpit, real map, wizard, analytics grid) are not wrong — they are the right next layer after this foundation is proven. Build the decision layer first. Add intelligence and awareness on top.

---

## Pending Work

- [ ] Dashboard: implement decision queue + lens system
- [ ] Shipments: remove map, rebuild as exception-first list with timeline expansion
- [ ] Compliance: design triage board + single-screen action view
- [ ] Reports: design intelligence briefing format
