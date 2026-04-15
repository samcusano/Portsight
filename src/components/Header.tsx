import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import StatusIndicator from './shared/StatusIndicator';
import { Bell, LayoutDashboard, Globe, Logs, ChartNetwork, ListTodo } from 'lucide-react';
import './Header.css';

interface Notification {
  type: 'critical' | 'warning' | 'info';
  text: string;
  time: string;
  href: string;
}

const NOTIFICATIONS: Notification[] = [
  { type: 'critical', text: 'FLEX-103948 ISF violation — due Jul 8, 10:00 EST', time: '14:02 UTC', href: '/compliance/FLEX-103948' },
  { type: 'critical', text: 'FLEX-997186 WEEE violation — due Jul 7, 14:00 EST', time: '13:46 UTC', href: '/compliance/FLEX-997186' },
  { type: 'warning',  text: 'Port of Long Beach force majeure — 3 shipments held', time: '13:04 UTC', href: '/shipments' },
  { type: 'info',     text: 'CBAM Form 12-A in progress — FLEX-761034', time: '11:04 UTC', href: '/compliance/FLEX-761034' },
];

const NOTIFICATION_GROUP_LABELS: Partial<Record<Notification['type'], string>> = {
  critical: 'Action required',
  warning:  'Watch',
  info:     'Updates',
};

const NAV_LINKS = [
  { to: '/',             label: 'Command',     icon: LayoutDashboard },
  { to: '/shipments',    label: 'Fleet',       icon: Globe           },
  { to: '/compliance',   label: 'Exposure',    icon: Logs            },
  { to: '/reports',      label: 'Analytics',   icon: ChartNetwork    },
  { to: '/assignments',  label: 'Assignments', icon: ListTodo        },
];

const Header = () => {
  const location = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [utcTime, setUtcTime] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);

  const getSubtitle = () => {
    switch (location.pathname) {
      case '/shipments':    return 'Tracking: CN-SHG > US-LGB';
      case '/compliance':   return 'Regulatory affairs';
      case '/reports':      return 'Analytics: 12M';
      case '/assignments':  return 'Team workload';
      default:              return 'CFO view: Global';
    }
  };

  useEffect(() => {
    const tick = () => setUtcTime(new Date().toUTCString().slice(17, 22) + ' UTC');
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [notifOpen]);

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  const badgeCount = NOTIFICATIONS.length;

  return (
    <header>
      {/* Brand */}
      <Link to="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
        PortSight
      </Link>

      {/* Nav links */}
      <nav aria-label="Main navigation">
        {NAV_LINKS.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className={isActive(to) ? 'active' : ''}>
            <Icon size={14} strokeWidth={1.5} aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer utilities */}
      <div className="header-footer">
        <div className="header-status-row">
          <StatusIndicator status="live" label="Live" lastUpdated="2m ago" />
        </div>
        <div className="header-context">
          <span className="label">{getSubtitle()}</span>
          {utcTime && <span className="header-clock">{utcTime}</span>}
        </div>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            className="header-notif-btn"
            onClick={() => setNotifOpen(v => !v)}
            aria-label="Notifications"
          >
            <Bell size={14} strokeWidth={1.5} />
            <span style={{ flex: 1 }}>Notifications</span>
            <span className="header-notif-badge">{badgeCount}</span>
          </button>
          {notifOpen && (
            <div className="header-notif-panel" role="menu" aria-label="Notifications">
              {(['critical', 'warning', 'info'] as Notification['type'][]).map((type) => {
                const group = NOTIFICATIONS.filter(n => n.type === type);
                if (group.length === 0) return null;
                return (
                  <div key={type}>
                    <div className={`header-notif-group-label header-notif-group-label--${type}`}>
                      {NOTIFICATION_GROUP_LABELS[type]}
                    </div>
                    {group.map((n, i) => (
                      <a
                        key={i}
                        href={n.href}
                        className="header-notif-row"
                        role="menuitem"
                        onClick={() => setNotifOpen(false)}
                      >
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                          <span className={`header-notif-dot header-notif-dot--${n.type}`} />
                          <div style={{ flex: 1 }}>
                            <div className="header-notif-text">{n.text}</div>
                            <div className="header-notif-time">{n.time}</div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* User */}
        <div className="header-user">
          <div className="header-avatar">AC</div>
          <span className="header-username">Alex Chen</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
