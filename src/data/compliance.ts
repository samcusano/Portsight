export interface AuthorityContact {
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface AuditEntry {
  timestamp: string;
  text: string;
  code?: string;
  voyagePct?: number; // undefined = system event with no vessel position
}

export interface ComplianceIssue {
  regulation: string;
  regulationRef: string;
  summary: string;
  body: string;
  documentRequired: string;
  documentSub: string;
  producerField?: string;
  containerId?: string;
  submitsTo: string;
  deadline: string;
  hoursRemaining: number;
  fineExposure: string;
  exposureBasis: string;
  holdRisk: 'High' | 'Medium' | 'Low';
  delayIfHeld: string;
  errorCode: string;
  status: 'new' | 'in-progress';
  assignee: string;
  authorityContact: AuthorityContact;
  auditTrail: AuditEntry[];
}

export interface ComplianceShipment {
  id: string;
  name: string;
  route: string;
  cargo: string;
  ref: string;
  voyageProgressPct: number; // 0–100, vessel's current position on the route
  issue: ComplianceIssue;
}

const COMPLIANCE_DATA: Record<string, ComplianceShipment> = {
  'FLEX-997186': {
    id: 'FLEX-997186',
    name: 'Palm disposable paper plates',
    route: 'CN-SHG → US-LGB',
    cargo: 'Lithium-ion components · ELEC-Q3-01',
    ref: 'HMMU-441209',
    voyageProgressPct: 88,
    issue: {
      regulation: 'WEEE Directive Violation',
      regulationRef: 'Regulation (EU) 2012/19/EU · Article 14(3)',
      summary: 'WEEE compliance statement missing',
      body: 'A WEEE Directive compliance statement is required for all lithium-ion component shipments entering the EU/US under the electronics waste directive. This document is missing from the manifest.',
      documentRequired: 'WEEE Compliance Statement',
      documentSub: 'Signed declaration from manufacturer confirming WEEE compliance for all lithium-ion units in container HMMU-441209',
      producerField: 'EU WEEE producer registration for the originating manufacturer (China)',
      containerId: 'HMMU-441209',
      submitsTo: 'US Customs & Border Protection',
      deadline: 'Jul 7, 14:00 EST',
      hoursRemaining: 14,
      fineExposure: '$12,000',
      exposureBasis: 'CBP penalty schedule 19 CFR 1592 — per-shipment fixed penalty for missing WEEE documentation. Verified Oct 24 against current schedule.',
      holdRisk: 'High',
      delayIfHeld: '+5–9 Days',
      errorCode: 'ERR_CODE: 611 · MISSING_COMPLIANCE_DOC',
      status: 'new',
      assignee: 'Alex Chen',
      authorityContact: {
        name: 'J. Morrow',
        role: 'CBP Trade Compliance Officer',
        phone: '+1 (562) 980-3100',
        email: 'trade.lgb@cbp.dhs.gov',
      },
      auditTrail: [
        {
          timestamp: '2024-10-24 08:45:11 UTC',
          text: 'Alert raised: WEEE compliance statement missing from manifest for container HMMU-441209.',
          code: 'ERR_CODE: 611 · MISSING_COMPLIANCE_DOC',
          voyagePct: 8,
        },
        {
          timestamp: '2024-10-24 08:00:00 UTC',
          text: 'Manifest received and parsed. 4 containers logged. 1 compliance gap detected by AI Audit.',
          voyagePct: 6,
        },
        {
          timestamp: '2024-10-23 22:00:00 UTC',
          text: 'WEEE Directive regulation update integrated into risk models. Threshold: all lithium-ion imports >10 KG.',
          // system event — no voyagePct
        },
        {
          timestamp: '2024-10-23 14:12:04 UTC',
          text: 'Shipment FLEX-997186 registered. Route CN-SHG → US-LGB. ETA Jul 7.',
          voyagePct: 0,
        },
        {
          timestamp: '2024-10-20 09:30:00 UTC',
          text: 'Container HMMU-441209 contents declared: PV Inverters + lithium-ion battery packs.',
          // system event — pre-departure declaration
        },
      ],
    },
  },

  'FLEX-761034': {
    id: 'FLEX-761034',
    name: 'Raw material batch C7',
    route: 'BR-SSZ → NL-RTM',
    cargo: 'Iron & steel raw material · RAW-MAT-2024',
    ref: 'MSCU-001284',
    voyageProgressPct: 82,
    issue: {
      regulation: 'CBAM Reporting Violation',
      regulationRef: 'EU Carbon Border Adjustment Mechanism · Regulation 2023/956',
      summary: 'Carbon emissions data mismatch',
      body: 'The reported carbon intensity (tCO₂e) for steel imports does not match the declared shipment weight in the manifest. A corrected CBAM Form 12-A must be filed before Rotterdam port entry.',
      documentRequired: 'CBAM Form 12-A (Iron & Steel)',
      documentSub: 'Corrected carbon data submission with verified production site ID and direct emissions figure matching manifest weight',
      producerField: 'Production site ID from originating facility (Brazil)',
      containerId: 'MSCU-001284',
      submitsTo: 'EU Customs Authority (Rotterdam)',
      deadline: 'Jul 9, 09:00 CET',
      hoursRemaining: 36,
      fineExposure: '$8,500',
      exposureBasis: 'EU CBAM penalty schedule — €50 per tCO₂e of underreported emissions, estimated at 170 tCO₂e variance. Rate locked at current EUR/USD.',
      holdRisk: 'Medium',
      delayIfHeld: '+3–5 Days',
      errorCode: 'ERR_CODE: 402 · DATA_INCONSISTENCY',
      status: 'in-progress',
      assignee: 'S. Kimura',
      authorityContact: {
        name: 'B. van der Berg',
        role: 'EU Customs CBAM Coordinator',
        phone: '+31 (0)10 252 1111',
        email: 'cbam@douane.nl',
      },
      auditTrail: [
        {
          timestamp: '2024-10-24 08:45:11 UTC',
          text: 'Flag raised: CBAM reporting mismatch for Shipment BR-SSZ. Reported carbon vs manifest weight inconsistency.',
          code: 'ERR_CODE: 402 · DATA_INCONSISTENCY',
          voyagePct: 80,
        },
        {
          timestamp: '2024-10-24 07:00:00 UTC',
          text: 'AI Audit cross-referenced manifest weight (22,500 KG steel) against declared tCO₂e. Discrepancy detected.',
          voyagePct: 75,
        },
        {
          timestamp: '2024-10-23 18:30:00 UTC',
          text: 'CBAM Form 12-A initially submitted for Shipment FLEX-761034.',
          voyagePct: 5,
        },
        {
          timestamp: '2024-10-23 12:00:00 UTC',
          text: 'Shipment FLEX-761034 registered. Route BR-SSZ → NL-RTM. ETA Jul 9.',
          voyagePct: 0,
        },
      ],
    },
  },

  'FLEX-103948': {
    id: 'FLEX-103948',
    name: 'Textiles — winter collection',
    route: 'BD-CGP → US-LGB',
    cargo: 'Garments & textiles · BD-TEXTILE-Q4',
    ref: 'HMMU-882190',
    voyageProgressPct: 97,
    issue: {
      regulation: 'ISF Filing Overdue',
      regulationRef: 'CBP 10+2 Importer Security Filing · 19 CFR 149',
      summary: 'Importer Security Filing not submitted',
      body: 'The ISF (10+2) must be filed at least 24 hours before vessel departure from a foreign port. This shipment departed without a valid ISF on record, triggering an automatic violation.',
      documentRequired: 'ISF Amendment Filing',
      documentSub: 'Complete 10+2 data elements including manufacturer, seller, buyer, ship-to party, and container stuffing location',
      containerId: 'HMMU-882190',
      submitsTo: 'US Customs & Border Protection — ACE Portal',
      deadline: 'Jul 8, 10:00 EST',
      hoursRemaining: 6,
      fineExposure: '$7,500',
      exposureBasis: 'CBP fixed penalty 19 CFR 149.7 — $5,000 base for late ISF + $2,500 for missing consolidation data. Not subject to mitigation at this stage.',
      holdRisk: 'High',
      delayIfHeld: '+2–4 Days',
      errorCode: 'ERR_CODE: 201 · ISF_LATE_FILING',
      status: 'new',
      assignee: 'O. Lev Haaret',
      authorityContact: {
        name: 'R. Castillo',
        role: 'CBP ISF Compliance Desk',
        phone: '+1 (571) 468-5000',
        email: 'isf.compliance@cbp.dhs.gov',
      },
      auditTrail: [
        {
          timestamp: '2024-10-24 09:00:00 UTC',
          text: 'ISF violation confirmed: filing window missed. Vessel departed BD-CGP without valid ISF on record.',
          code: 'ERR_CODE: 201 · ISF_LATE_FILING',
          voyagePct: 96,
        },
        {
          timestamp: '2024-10-24 06:00:00 UTC',
          text: 'Automated check: ISF not found in ACE system for FLEX-103948. Alert escalated to Risk Officer.',
          // system event — ACE portal check, no vessel position
        },
        {
          timestamp: '2024-10-23 20:00:00 UTC',
          text: 'Vessel departed BD-CGP. ISF filing window closed. No ISF on record at time of departure.',
          voyagePct: 3,
        },
        {
          timestamp: '2024-10-23 10:00:00 UTC',
          text: 'Shipment FLEX-103948 registered. Route BD-CGP → US-LGB. ETA Jul 8.',
          voyagePct: 0,
        },
      ],
    },
  },
};

export default COMPLIANCE_DATA;
