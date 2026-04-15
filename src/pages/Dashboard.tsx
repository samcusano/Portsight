import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LensProvider, useLens } from '../context/LensContext';
import { TASKS, computeUrgencyScore } from '../data/tasks';
import type { TaskType } from '../data/tasks';
import AlertBanner from '../components/shared/AlertBanner';
import TaskCard from '../components/TaskCard/TaskCard';
import ExposureSummaryBar from '../components/ExposureSummaryBar';
import FilterDropdown from '../components/shared/FilterDropdown';
import './Dashboard.css';

type TypeFilter = 'All' | TaskType;
type HorizonFilter = 'All' | 'Today' | 'This Week' | 'This Month';

const TYPE_FILTERS: TypeFilter[] = ['All', 'compliance', 'regulatory', 'congestion', 'shipment-exception'];
const HORIZON_FILTERS: HorizonFilter[] = ['All', 'Today', 'This Week', 'This Month'];

function typeFilterLabel(f: TypeFilter): string {
  if (f === 'All') return 'All types';
  if (f === 'compliance') return 'Compliance';
  if (f === 'regulatory') return 'Regulatory';
  if (f === 'congestion') return 'Congestion';
  return 'Exception';
}

function matchesHorizon(hours: number, filter: HorizonFilter): boolean {
  if (filter === 'All') return true;
  if (filter === 'Today') return hours <= 24;
  if (filter === 'This Week') return hours <= 168;
  if (filter === 'This Month') return hours <= 720;
  return true;
}

function DashboardQueue() {
  const { activeLens } = useLens();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const [horizonFilter, setHorizonFilter] = useState<HorizonFilter>('All');

  const visibleTasks = useMemo(() => {
    let tasks = TASKS.filter(
      t => t.lifecycleState !== 'resolved' && t.lifecycleState !== 'expired'
    );

    if (activeLens.defaultFilter?.taskTypes) {
      tasks = tasks.filter(t =>
        activeLens.defaultFilter!.taskTypes!.includes(t.type)
      );
    }

    if (typeFilter !== 'All') {
      tasks = tasks.filter(t => t.type === typeFilter);
    }

    if (horizonFilter !== 'All') {
      tasks = tasks.filter(t =>
        matchesHorizon(t.urgencyInputs.hoursRemainingToDeadline, horizonFilter)
      );
    }

    return tasks
      .map(t => ({
        ...t,
        urgencyScore: computeUrgencyScore(t.urgencyInputs, activeLens.weights),
      }))
      .sort((a, b) => (b.urgencyScore ?? 0) - (a.urgencyScore ?? 0));
  }, [activeLens, typeFilter, horizonFilter]);

  const resolvedCount = TASKS.filter(
    t => t.lifecycleState === 'resolved' || t.lifecycleState === 'expired'
  ).length;

  const totalActive = TASKS.filter(
    t => t.lifecycleState !== 'resolved' && t.lifecycleState !== 'expired'
  ).length;

  const filtersActive = typeFilter !== 'All' || horizonFilter !== 'All';

  function handleToggle(id: string) {
    setExpandedId(prev => (prev === id ? null : id));
  }

  function clearFilters() {
    setTypeFilter('All');
    setHorizonFilter('All');
  }

  return (
    <div className="dash-queue">
      <div className="dash-queue__header">
        {/* Filter toolbar */}
        <div className="dash-toolbar">
          <FilterDropdown
            label="Type"
            options={TYPE_FILTERS}
            value={typeFilter}
            onChange={setTypeFilter}
            displayValue={typeFilterLabel}
          />
          <FilterDropdown
            label="Deadline"
            options={HORIZON_FILTERS}
            value={horizonFilter}
            onChange={setHorizonFilter}
            displayValue={(f) => f === 'All' ? 'Any deadline' : f}
          />
          {filtersActive && (
            <button className="dash-filter-bar__clear" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      <main id="main-content" className="dash-queue__list" role="list">
        <h1 className="sr-only">Command — Operational Risk Queue</h1>
        {visibleTasks.length === 0 ? (
          <div className="dash-queue__empty">
            <span className="label">No tasks match this filter</span>
          </div>
        ) : (
          visibleTasks.map((task, i) => (
            <TaskCard
              key={task.id}
              task={task}
              rank={i + 1}
              isExpanded={expandedId === task.id}
              onToggle={() => handleToggle(task.id)}
            />
          ))
        )}
      </main>

      <div className="dash-queue__footer">
        <span className="label">
          {resolvedCount > 0 && `${resolvedCount} resolved this session · `}
          {filtersActive
            ? `${totalActive - visibleTasks.length} hidden by filter`
            : 'All tasks visible'}
        </span>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [alertDismissed, setAlertDismissed] = useState(false);

  return (
    <LensProvider>
      {!alertDismissed && (
        <AlertBanner
          severity="critical"
          title="Force majeure — 3 shipments held"
          message="Port of Long Beach operations halted. FLEX-997186, FLEX-884201, FLEX-103948 affected. Estimated recovery: Unknown."
          actionLabel="View affected shipments"
          onAction={() => navigate('/shipments')}
          onDismiss={() => setAlertDismissed(true)}
        />
      )}
      <ExposureSummaryBar />
      <DashboardQueue />
    </LensProvider>
  );
};

export default Dashboard;
