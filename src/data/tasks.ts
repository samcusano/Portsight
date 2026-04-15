export type TaskType = 'compliance' | 'congestion' | 'shipment-exception' | 'regulatory';
export type TaskLifecycleState = 'detected' | 'ranked' | 'actioned' | 'resolved' | 'expired';

export interface UrgencyInputs {
  impact: number;               // raw dollar value
  probability: number;          // 0.0–1.0
  hoursRemainingToDeadline: number;
  effort: number;               // 1 (easy) – 5 (hard)
}

export interface LensWeights {
  impact: number;
  probability: number;
  timePressure: number;
  effort: number;
}

export interface CTAConfig {
  label: string;
  action: 'navigate' | 'modal' | 'external';
  target: string;
}

export interface Scenario {
  label: string;
  outcome: string;
  impactDelta: number;          // negative = savings, positive = added cost
  probabilityOfSuccess: number;
}

export interface TimelineEntry {
  timestamp: string;
  label: string;
  type: 'planned' | 'actual' | 'system' | 'alert';
  voyagePct?: number;
}

export interface RiskDriver {
  factor: string;
  weight: 'high' | 'medium' | 'low';
}

export interface TaskContext {
  shipmentId?: string;
  route?: string;
  voyageProgressPct?: number;
  regulation?: string;
  assignee: string;
  riskDrivers: RiskDriver[];
  timelineEntries: TimelineEntry[];
  relatedShipmentIds: string[];
  scenarios: Scenario[];
}

export interface OperationalTask {
  id: string;
  type: TaskType;
  lifecycleState: TaskLifecycleState;
  problemStatement: string;
  impactLabel: string;          // pre-formatted: "$12,000"
  confidencePct: number;
  urgencyInputs: UrgencyInputs;
  urgencyScore?: number;        // computed at render, not stored
  cta: CTAConfig;
  context: TaskContext;
}

export const DEFAULT_WEIGHTS: LensWeights = {
  impact: 1.0,
  probability: 1.0,
  timePressure: 1.0,
  effort: 1.0,
};

// Nonlinear decay curve: 72h→~0.10, 36h→~0.22, 24h→~0.33, 12h→~0.60, 6h→~0.85, 0h→1.0
function computeTimePressure(hours: number): number {
  if (hours <= 0) return 1.0;
  return Math.min(1.0, 1 - Math.exp(-72 / hours));
}

export function computeUrgencyScore(
  inputs: UrgencyInputs,
  weights: LensWeights = DEFAULT_WEIGHTS
): number {
  const tp = computeTimePressure(inputs.hoursRemainingToDeadline);
  return (
    (inputs.impact * weights.impact) *
    (inputs.probability * weights.probability) *
    (tp * weights.timePressure)
  ) / (inputs.effort * weights.effort);
}

export const TASKS: OperationalTask[] = [
  {
    id: 'TASK-001',
    type: 'compliance',
    lifecycleState: 'ranked',
    problemStatement: 'ISF 10+2 filing not submitted — vessel arrives in 6h, violation auto-triggered',
    impactLabel: '$7,500',
    confidencePct: 97,
    urgencyInputs: { impact: 7500, probability: 0.85, hoursRemainingToDeadline: 6, effort: 2 },
    cta: { label: 'File ISF Amendment', action: 'navigate', target: '/compliance/FLEX-103948' },
    context: {
      shipmentId: 'FLEX-103948',
      route: 'BD-CGP → US-LGB',
      voyageProgressPct: 97,
      regulation: 'CBP 10+2 Importer Security Filing',
      assignee: 'O. Lev Haaret',
      riskDrivers: [
        { factor: 'Vessel 97% complete — at US-LGB approach', weight: 'high' },
        { factor: 'CBP violation auto-triggered at departure', weight: 'high' },
        { factor: 'No mitigation available per 19 CFR 149.7', weight: 'medium' },
      ],
      timelineEntries: [
        { timestamp: '2024-10-20 06:00 UTC', label: 'Vessel departed BD-CGP', type: 'actual', voyagePct: 0 },
        { timestamp: '2024-10-22 14:30 UTC', label: 'ISF filing deadline passed — violation flagged', type: 'alert', voyagePct: 45 },
        { timestamp: '2024-10-24 08:45 UTC', label: 'AI audit detected missing ISF', type: 'system' },
        { timestamp: '2024-10-26 10:00 EST', label: 'Estimated arrival US-LGB', type: 'planned', voyagePct: 100 },
      ],
      relatedShipmentIds: [],
      scenarios: [
        {
          label: 'File amendment now',
          outcome: 'Penalty may reduce to $5,000 base — hold avoidable',
          impactDelta: -2500,
          probabilityOfSuccess: 0.65,
        },
        {
          label: 'Do nothing',
          outcome: 'Full $7,500 fine + possible hold +2–4 days',
          impactDelta: 0,
          probabilityOfSuccess: 0,
        },
      ],
    },
  },

  {
    id: 'TASK-002',
    type: 'compliance',
    lifecycleState: 'ranked',
    problemStatement: 'WEEE compliance statement missing from manifest — $12,000 fine exposure at arrival',
    impactLabel: '$12,000',
    confidencePct: 91,
    urgencyInputs: { impact: 12000, probability: 0.85, hoursRemainingToDeadline: 14, effort: 2 },
    cta: { label: 'Upload WEEE Statement', action: 'navigate', target: '/compliance/FLEX-997186' },
    context: {
      shipmentId: 'FLEX-997186',
      route: 'CN-SHG → US-LGB',
      voyageProgressPct: 88,
      regulation: 'WEEE Directive (EU) 2012/19/EU · Article 14(3)',
      assignee: 'Alex Chen',
      riskDrivers: [
        { factor: 'Lithium-ion components require WEEE producer registration', weight: 'high' },
        { factor: 'Deadline Jul 7 14:00 EST — vessel 88% complete', weight: 'high' },
        { factor: 'Hold risk classified High — +5–9 days if triggered', weight: 'medium' },
      ],
      timelineEntries: [
        { timestamp: '2024-10-18 09:00 UTC', label: 'Vessel departed CN-SHG', type: 'actual', voyagePct: 0 },
        { timestamp: '2024-10-23 11:12 UTC', label: 'AI audit: WEEE statement absent from manifest', type: 'alert', voyagePct: 72 },
        { timestamp: '2024-10-24 08:45 UTC', label: 'Regulation update confirmed — HMMU-441209 flagged', type: 'system' },
        { timestamp: 'Jul 7, 14:00 EST', label: 'CBP compliance deadline', type: 'planned' },
      ],
      relatedShipmentIds: ['FLEX-884201'],
      scenarios: [
        {
          label: 'Upload statement now',
          outcome: 'Violation cleared — vessel clears customs on schedule',
          impactDelta: -12000,
          probabilityOfSuccess: 0.91,
        },
        {
          label: 'Delay 24h',
          outcome: 'Misses deadline — full fine + hold +5–9 days',
          impactDelta: 0,
          probabilityOfSuccess: 0,
        },
      ],
    },
  },

  {
    id: 'TASK-003',
    type: 'regulatory',
    lifecycleState: 'actioned',
    problemStatement: 'CBAM Form 12-A carbon data mismatch — 170 tCO₂e discrepancy blocks Rotterdam entry',
    impactLabel: '$8,500',
    confidencePct: 88,
    urgencyInputs: { impact: 8500, probability: 0.55, hoursRemainingToDeadline: 36, effort: 3 },
    cta: { label: 'Submit Corrected CBAM Form', action: 'navigate', target: '/compliance/FLEX-761034' },
    context: {
      shipmentId: 'FLEX-761034',
      route: 'BR-SSZ → NL-RTM',
      voyageProgressPct: 82,
      regulation: 'EU CBAM Regulation (EU) 2023/956',
      assignee: 'S. Kimura',
      riskDrivers: [
        { factor: '170 tCO₂e discrepancy between declared and verified data', weight: 'high' },
        { factor: 'Rotterdam entry blocked until CBAM form corrected', weight: 'medium' },
        { factor: 'Iron & steel: full CBAM scope from Jan 2026', weight: 'low' },
      ],
      timelineEntries: [
        { timestamp: '2024-10-15 07:30 UTC', label: 'Vessel departed BR-SSZ', type: 'actual', voyagePct: 0 },
        { timestamp: '2024-10-21 15:00 UTC', label: 'CBAM discrepancy detected — 170 tCO₂e gap', type: 'alert', voyagePct: 60 },
        { timestamp: '2024-10-23 09:00 UTC', label: 'S. Kimura assigned — form correction in progress', type: 'system' },
        { timestamp: 'Jul 9, 09:00 CET', label: 'EU Customs CBAM deadline', type: 'planned' },
      ],
      relatedShipmentIds: ['FLEX-884201'],
      scenarios: [
        {
          label: 'Submit correction now',
          outcome: 'Rotterdam entry cleared — 36h window is sufficient',
          impactDelta: -8500,
          probabilityOfSuccess: 0.82,
        },
        {
          label: 'Delay past deadline',
          outcome: 'Full fine + hold +3–5 days at Rotterdam',
          impactDelta: 0,
          probabilityOfSuccess: 0,
        },
      ],
    },
  },

  {
    id: 'TASK-004',
    type: 'congestion',
    lifecycleState: 'detected',
    problemStatement: 'US-LGB dwell-time congestion — 92% SLA breach probability on Q3 Electronics route',
    impactLabel: '~$756K',
    confidencePct: 92,
    urgencyInputs: { impact: 756000, probability: 0.92, hoursRemainingToDeadline: 72, effort: 4 },
    cta: { label: 'Open Affected Shipments', action: 'navigate', target: '/shipments' },
    context: {
      route: 'CN-SHG → US-LGB',
      assignee: 'A. Rodriguez',
      riskDrivers: [
        { factor: 'Long Beach dwell times 3.2× above seasonal baseline', weight: 'high' },
        { factor: '3 shipments with combined 92% SLA breach probability', weight: 'high' },
        { factor: 'Reroute to Oakland saves 18% of exposure ($136K)', weight: 'medium' },
      ],
      timelineEntries: [
        { timestamp: '2024-10-22 00:00 UTC', label: 'Congestion index crossed critical threshold', type: 'alert' },
        { timestamp: '2024-10-23 14:02 UTC', label: 'AI model flagged reroute opportunity — confidence 0.92', type: 'system' },
        { timestamp: '2024-10-25 12:00 UTC', label: 'Reroute decision window closes', type: 'planned' },
      ],
      relatedShipmentIds: ['FLEX-997186', 'FLEX-884201', 'FLEX-210774'],
      scenarios: [
        {
          label: 'Reroute to Oakland',
          outcome: 'Saves $136K, adds 1.5 days transit time',
          impactDelta: -136000,
          probabilityOfSuccess: 0.88,
        },
        {
          label: 'Hold current route',
          outcome: '92% chance of SLA breach — full $756K exposure',
          impactDelta: 0,
          probabilityOfSuccess: 0.08,
        },
        {
          label: 'Split shipments',
          outcome: 'FLEX-997186 via Oakland, others hold — partial mitigation',
          impactDelta: -55000,
          probabilityOfSuccess: 0.71,
        },
      ],
    },
  },

  {
    id: 'TASK-005',
    type: 'shipment-exception',
    lifecycleState: 'ranked',
    problemStatement: 'EU ETS emissions declaration required — FLEX-884201 industrial steel coils mid-transit',
    impactLabel: '~$4,200',
    confidencePct: 78,
    urgencyInputs: { impact: 4200, probability: 0.55, hoursRemainingToDeadline: 120, effort: 2 },
    cta: { label: 'View Shipment', action: 'navigate', target: '/shipments' },
    context: {
      shipmentId: 'FLEX-884201',
      route: 'CN-SHG → NL-RTM',
      voyageProgressPct: 55,
      regulation: 'EU ETS Maritime (Regulation (EU) 2023/1805)',
      assignee: 'P. Nair',
      riskDrivers: [
        { factor: 'Steel coils: full ETS scope from Jan 2024', weight: 'medium' },
        { factor: 'Emissions declaration not yet filed for this voyage', weight: 'medium' },
        { factor: '120h window — low urgency but non-zero risk', weight: 'low' },
      ],
      timelineEntries: [
        { timestamp: '2024-10-20 10:00 UTC', label: 'Vessel departed CN-SHG', type: 'actual', voyagePct: 0 },
        { timestamp: '2024-10-23 16:30 UTC', label: 'ETS declaration gap identified by AI audit', type: 'alert', voyagePct: 55 },
        { timestamp: 'Jul 11, 00:00 CET', label: 'EU ETS filing deadline', type: 'planned' },
      ],
      relatedShipmentIds: ['FLEX-761034'],
      scenarios: [
        {
          label: 'File now',
          outcome: 'Declaration complete — no fine risk',
          impactDelta: -4200,
          probabilityOfSuccess: 0.97,
        },
        {
          label: 'Wait and file later',
          outcome: '55% chance of fine if missed — $4,200 exposure',
          impactDelta: 0,
          probabilityOfSuccess: 0.45,
        },
      ],
    },
  },

  {
    id: 'TASK-006',
    type: 'regulatory',
    lifecycleState: 'detected',
    problemStatement: 'CBAM now mandatory for all steel imports — 3 shipments require compliance review',
    impactLabel: 'Portfolio risk',
    confidencePct: 99,
    urgencyInputs: { impact: 25000, probability: 0.99, hoursRemainingToDeadline: 480, effort: 3 },
    cta: { label: 'Open Compliance Queue', action: 'navigate', target: '/compliance' },
    context: {
      regulation: 'EU CBAM Phase II (Regulation (EU) 2023/956)',
      assignee: 'Alex Chen',
      riskDrivers: [
        { factor: 'CBAM mandatory for steel imports from Jan 2026 — 3 active shipments in scope', weight: 'high' },
        { factor: 'FLEX-761034 already has active CBAM violation', weight: 'high' },
        { factor: 'FLEX-884201 and one additional shipment unreviewed', weight: 'medium' },
      ],
      timelineEntries: [
        { timestamp: '2024-10-24 00:00 UTC', label: 'EU CBAM Phase II enforcement confirmed', type: 'alert' },
        { timestamp: '2024-10-24 08:00 UTC', label: 'AI model cross-referenced active manifests', type: 'system' },
        { timestamp: 'Jan 1, 2026', label: 'Full CBAM Phase II enforcement date', type: 'planned' },
      ],
      relatedShipmentIds: ['FLEX-761034', 'FLEX-884201'],
      scenarios: [
        {
          label: 'Review all 3 shipments now',
          outcome: 'Full compliance — no fines, no holds',
          impactDelta: -25000,
          probabilityOfSuccess: 0.95,
        },
        {
          label: 'Defer to next cycle',
          outcome: 'Risk of incremental fines per shipment as enforcement ramps',
          impactDelta: 0,
          probabilityOfSuccess: 0.3,
        },
      ],
    },
  },
];
