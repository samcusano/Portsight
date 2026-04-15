export const metrics = {
  riskScore: 72,
  financialImpact: '$4.2M',
  regulatoryHolds: 12,
  insuranceScore: 'B+',
};

export const shipments = [
  {
    id: 'PS-99284',
    route: 'CN-SHG → US-LGB',
    vessel: 'HMM ALGECIRAS',
    status: 'Critical' as const,
    delay: '+14 Days',
    clause: 'Force majeure',
    risk: 'High',
    compliance: null,
    fine: null,
    progress: 67,
  },
  {
    id: 'PS-87441',
    route: 'DE-HAM → SG-SIN',
    vessel: 'EVER GIVEN',
    status: 'Watch' as const,
    delay: '+2 Days',
    clause: null,
    reg: 'ETS Emissions',
    risk: 'Low',
    compliance: null,
    fine: null,
    progress: 42,
  },
  {
    id: 'PS-76109',
    route: 'BR-SSZ → NL-RTM',
    vessel: 'MSC GÜLSÜN',
    status: 'Audit' as const,
    delay: null,
    clause: null,
    risk: 'Medium',
    compliance: 'Missing doc',
    fine: '$12,000',
    progress: 88,
  },
];

export const insights = [
  {
    label: 'Prediction analysis',
    title: 'Port congestion detected.',
    text: 'Based on current dwell times at Long Beach, we predict a 92% probability of SLA breach for the Q3 Electronics shipment. Re-routing to Oakland reduces financial exposure by 18%.',
    confidence: 0.92,
    ref: 'LG-2024-89',
    time: '14:02 UTC',
  },
  {
    label: 'Regulatory update',
    title: 'New CBAM requirements.',
    text: 'Carbon Border Adjustment Mechanism reporting is mandatory for steel imports starting next month. 3 active shipments are flagged for non-compliance.',
    confidence: null,
    ref: null,
    time: null,
  },
];
