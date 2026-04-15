import { useNavigate } from 'react-router-dom';
import SectionHeader from './shared/SectionHeader';
import InsightBlock from './shared/InsightBlock';
import Button from './shared/Button';
import StatusIndicator from './shared/StatusIndicator';
import './AILegalAudit.css';

const AILegalAudit = () => {
  const navigate = useNavigate();

  return (
    <div className="col">
      <SectionHeader title="Regulatory intelligence" number="(03)" />
      <div style={{ padding: '0 var(--spacing-unit) var(--spacing-unit)', borderBottom: '1px solid var(--line-color)' }}>
        <StatusIndicator status="updating" label="AI Models" lastUpdated="Updating…" />
      </div>

      <InsightBlock
        label="Prediction analysis"
        title="US-LGB congestion — reroute to reduce SLA breach risk."
        auditTrail="REF: LG-2024-89\nCONFIDENCE: 0.92\nTIMESTAMP: 14:02 UTC"
      >
        Reroute Q3 Electronics to Oakland — reduces financial exposure by 18%. 92% SLA breach probability on current Long Beach dwell times.
        <div style={{ marginTop: '16px' }}>
          <Button variant="link" onClick={() => navigate('/shipments')}>Open affected shipments</Button>
        </div>
      </InsightBlock>

      <InsightBlock
        label="Regulatory update"
        title="CBAM mandatory for steel imports — 3 shipments require action."
      >
        <p className="insight-text">
          Review FLEX-761034, FLEX-884201, and one other shipment before next month. CBAM reporting is now mandatory for all steel imports.
        </p>
        <div style={{ marginTop: '16px' }}>
          <Button variant="link" onClick={() => navigate('/compliance')}>Open compliance queue</Button>
        </div>
      </InsightBlock>
      
      <InsightBlock style={{ borderBottom: 'none' }}>
        <span className="label" style={{ display: 'block', marginBottom: '8px' }}>System status</span>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px' }}>
          <span>Trade Data</span>
          <span>Live</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '12px' }}>
          <span>Risk Models</span>
          <span>Updating...</span>
        </div>
      </InsightBlock>
    </div>
  );
};

export default AILegalAudit;
