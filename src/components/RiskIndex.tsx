import { useNavigate } from 'react-router-dom';
import './RiskIndex.css';

const SCORE  = 72;
const MEDIAN = 58;

const RiskIndex = () => {
  const navigate = useNavigate();

  return (
    <div className="risk-bar">
      {/* Score + bullet chart */}
      <div className="risk-bar-gauge">
        <div className="risk-bar-score-block">
          <span className="risk-bar-score">{SCORE}</span>
          <span className="risk-bar-label">Risk exposure</span>
          <span className="risk-bar-delta">▲4 · higher than 68% of peers</span>
        </div>

        <div className="risk-bullet">
          <div className="risk-bullet-zones">
            <span>Low</span>
            <span>Elevated</span>
            <span>Critical</span>
          </div>
          <div className="risk-bullet-track" role="meter" aria-valuenow={SCORE} aria-valuemin={0} aria-valuemax={100}>
            <div className="risk-bullet-fill" style={{ width: `${SCORE}%` }} />
            <div className="risk-bullet-marker" style={{ left: `${MEDIAN}%` }} aria-label={`Industry median: ${MEDIAN}`} />
          </div>
          <div className="risk-bullet-scale">
            <span>0</span>
            <span className="risk-bullet-median-label" style={{ left: `${MEDIAN}%` }}>median {MEDIAN}</span>
            <span>100</span>
          </div>
        </div>
      </div>

      <div className="risk-bar-divider" />

      <button className="risk-bar-metric" onClick={() => navigate('/reports')}>
        <span className="risk-bar-metric-value">$4.2M</span>
        <span className="risk-bar-metric-label">Financial impact</span>
        <span className="risk-bar-metric-sub trend-up">Projected loss</span>
      </button>

      <div className="risk-bar-divider" />

      <button className="risk-bar-metric" onClick={() => navigate('/compliance')}>
        <span className="risk-bar-metric-value">12</span>
        <span className="risk-bar-metric-label">Regulatory hold</span>
        <span className="risk-bar-metric-sub">Active audits</span>
      </button>

      <div className="risk-bar-divider" />

      <button className="risk-bar-metric" onClick={() => navigate('/reports')}
        title="Scale: A+ (lowest risk) to F (highest risk)">
        <span className="risk-bar-metric-value serif-display">B+</span>
        <span className="risk-bar-metric-label">Insurance score</span>
        <span className="risk-bar-metric-sub">A+ best · F worst</span>
      </button>
    </div>
  );
};

export default RiskIndex;
