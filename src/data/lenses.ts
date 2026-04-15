import type { TaskType, LensWeights } from './tasks';

export type LensId =
  | 'port-ops'
  | 'logistics-coord'
  | 'shipping-planner'
  | 'terminal-operator';

export interface LensConfig {
  id: LensId;
  label: string;
  roleTitle: string;
  entryQuestion: string;
  weights: LensWeights;
  defaultFilter?: {
    taskTypes?: TaskType[];
  };
}

export const LENSES: LensConfig[] = [
  {
    id: 'port-ops',
    label: 'Port Ops',
    roleTitle: 'Port Operations Manager',
    entryQuestion: 'What is breaking right now?',
    weights: {
      impact: 0.8,
      probability: 0.8,
      timePressure: 2.5,
      effort: 1.0,
    },
  },
  {
    id: 'logistics-coord',
    label: 'Logistics',
    roleTitle: 'Logistics Coordinator',
    entryQuestion: 'Which shipments need my intervention?',
    weights: {
      impact: 2.0,
      probability: 1.2,
      timePressure: 1.0,
      effort: 0.8,
    },
    defaultFilter: {
      taskTypes: ['compliance', 'shipment-exception'],
    },
  },
  {
    id: 'shipping-planner',
    label: 'Planner',
    roleTitle: 'Shipping Line Planner',
    entryQuestion: 'Where will things break next?',
    weights: {
      impact: 1.0,
      probability: 2.5,
      timePressure: 0.6,
      effort: 1.2,
    },
  },
  {
    id: 'terminal-operator',
    label: 'Terminal',
    roleTitle: 'Terminal Operator',
    entryQuestion: 'Where is throughput degrading?',
    weights: {
      impact: 1.5,
      probability: 1.5,
      timePressure: 1.2,
      effort: 0.7,
    },
    defaultFilter: {
      taskTypes: ['congestion', 'shipment-exception'],
    },
  },
];

export const DEFAULT_LENS = LENSES[0];
