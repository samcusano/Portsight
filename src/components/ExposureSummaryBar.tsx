import { useMemo } from 'react';
import { TASKS } from '../data/tasks';
import { useCountUp } from '../hooks/useCountUp';
import './ExposureSummaryBar.css';

const ExposureSummaryBar = () => {
  const stats = useMemo(() => {
    const active = TASKS.filter(
      t => t.lifecycleState !== 'resolved' && t.lifecycleState !== 'expired'
    );

    const totalExposure = active.reduce(
      (sum, t) => sum + t.urgencyInputs.impact,
      0
    );

    const criticalCount = active.filter(
      t => t.urgencyInputs.hoursRemainingToDeadline <= 12
    ).length;

    const dueTodayCount = active.filter(
      t => t.urgencyInputs.hoursRemainingToDeadline <= 24
    ).length;

    const actionedCount = active.filter(
      t => t.lifecycleState === 'actioned'
    ).length;

    return { totalExposure, criticalCount, dueTodayCount, actionedCount, total: active.length };
  }, []);

  const animExposure   = useCountUp(stats.totalExposure);
  const animCritical   = useCountUp(stats.criticalCount);
  const animDueToday   = useCountUp(stats.dueTodayCount);
  const animActioned   = useCountUp(stats.actionedCount);
  const animTotal      = useCountUp(stats.total);

  function formatUsd(n: number): string {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
    return `$${n.toLocaleString()}`;
  }

  return (
    <div className="exp-bar" role="region" aria-label="Exposure summary">
      <div className="exp-bar__tile">
        <span className="exp-bar__value exp-bar__value--exposure">
          {formatUsd(animExposure)}
        </span>
        <span className="exp-bar__label">Total exposure</span>
      </div>

      <div className="exp-bar__divider" aria-hidden="true" />

      <div className="exp-bar__tile">
        <span className={`exp-bar__value${stats.criticalCount > 0 ? ' exp-bar__value--critical' : ''}`}>
          {animCritical}
        </span>
        <span className="exp-bar__label">Critical (&lt;12h)</span>
      </div>

      <div className="exp-bar__divider" aria-hidden="true" />

      <div className="exp-bar__tile">
        <span className={`exp-bar__value${stats.dueTodayCount > 0 ? ' exp-bar__value--warning' : ''}`}>
          {animDueToday}
        </span>
        <span className="exp-bar__label">Due today</span>
      </div>

      <div className="exp-bar__divider" aria-hidden="true" />

      <div className="exp-bar__tile">
        <span className="exp-bar__value exp-bar__value--muted">
          {animActioned} / {animTotal}
        </span>
        <span className="exp-bar__label">Actioned</span>
      </div>
    </div>
  );
};

export default ExposureSummaryBar;
