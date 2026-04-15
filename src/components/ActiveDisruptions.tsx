import { useNavigate } from 'react-router-dom';
import SectionHeader from './shared/SectionHeader';
import Button from './shared/Button';
import ShipmentRow from './shared/ShipmentRow';

interface ActiveDisruptionsProps {
  showHeader?: boolean;
}

interface ArrivingShipment {
  id: string;
  route: string;
  eta: string;
  progressPct: number;
}

const ARRIVING: ArrivingShipment[] = [
  { id: 'FLEX-210774', route: 'IN-MUN → GB-FXT', eta: 'Jul 11', progressPct: 55 },
  { id: 'FLEX-551847', route: 'KR-ICN → NL-RTM', eta: 'Jul 14', progressPct: 60 },
];

const ActiveDisruptions = ({ showHeader = true }: ActiveDisruptionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="col">
      {showHeader && <SectionHeader title="Active disruptions" number="(02)" />}

      <div style={{ padding: '0 var(--spacing-unit) var(--spacing-unit)', borderBottom: '1px solid var(--line-color)' }}>
        <span className="label" style={{ fontSize: '10px', opacity: 0.7 }}>
          3 violations · $28,000 fine exposure · action required
        </span>
      </div>

      <ShipmentRow
        id="FLEX-997186"
        name="Palm disposable paper plates"
        refs={['PO0019282', 'BL0019282']}
        route="CN-SHG → US-LGB"
        progressPct={70}
        location="At arrival port"
        cause="Cargo breakdown — contact carrier"
        complianceIssue="WEEE Directive Violation"
        assignee="O. Lev Haaret"
        date="Jul 7"
        severity="critical"
        onClick={() => navigate('/compliance/FLEX-997186')}
      />

      <ShipmentRow
        id="FLEX-103948"
        name="Textiles — winter collection"
        refs={['PO0012088']}
        route="BD-CGP → US-LGB"
        progressPct={92}
        location="Near destination"
        cause="ISF amendment required"
        complianceIssue="ISF Filing Overdue"
        assignee="O. Lev Haaret"
        date="Jul 8"
        severity="critical"
        onClick={() => navigate('/compliance/FLEX-103948')}
      />

      <ShipmentRow
        id="FLEX-761034"
        name="Raw material batch C7"
        refs={['PO0017650', 'BL0017650']}
        route="BR-SSZ → NL-RTM"
        progressPct={88}
        location="Rotterdam approach"
        cause="CBAM Form 12-A missing"
        complianceIssue="CBAM Reporting Violation"
        assignee="A. Chen"
        date="Jul 9"
        severity="critical"
        onClick={() => navigate('/compliance/FLEX-761034')}
      />

      <ShipmentRow
        id="FLEX-884201"
        name="Industrial steel coils"
        refs={['PO0018741']}
        route="DE-HAM → SG-SIN"
        progressPct={45}
        location="Mid-Pacific"
        cause="ETS emissions declaration required"
        assignee="S. Kimura"
        date="Jul 12"
        severity="watch"
        onClick={() => navigate('/shipments')}
      />

      {/* Divider — arriving soon, no action needed */}
      <div className="ad-arriving-header">
        <span className="label">Arriving · no issues</span>
      </div>

      <div className="ad-arriving-cards">
        {ARRIVING.map((s) => (
          <button
            key={s.id}
            className="ad-arriving-card"
            onClick={() => navigate('/shipments')}
          >
            <div className="ad-arriving-card-top">
              <span className="ad-arriving-id">{s.id}</span>
              <span className="ad-arriving-eta">{s.eta}</span>
            </div>
            <div className="ad-arriving-progress">
              <div className="ad-arriving-bar">
                <div className="ad-arriving-bar-fill" style={{ width: `${s.progressPct}%` }} />
              </div>
              <span className="ad-arriving-pct">{s.progressPct}%</span>
            </div>
            <div className="ad-arriving-route">{s.route}</div>
          </button>
        ))}
      </div>

      <div style={{ padding: 'var(--spacing-unit)', textAlign: 'center' }}>
        <Button variant="link" onClick={() => navigate('/shipments')}>View full manifest</Button>
      </div>
    </div>
  );
};

export default ActiveDisruptions;
