import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConditionPanel from '../components/ConditionPanel';
import RiskAlert from '../components/RiskAlert';
import { GumIcon, BoltIcon, WarnIcon, InfoIcon, CameraIcon, ImageIcon } from '../components/Icons';

const CoachIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const GUM_BARS = [
  { h: 35, color: 'teal' }, { h: 45, color: 'teal' }, { h: 60, color: 'warn' },
  { h: 65, color: 'warn' }, { h: 75, color: 'danger' }, { h: 70, color: 'danger' }, { h: 80, color: 'danger' },
];
const SENS_BARS = [
  { h: 20, color: 'light' }, { h: 30, color: 'teal' }, { h: 50, color: 'warn' },
  { h: 70, color: 'danger' }, { h: 80, color: 'danger' }, { h: 85, color: 'danger' }, { h: 90, color: 'danger' },
];
const ENAMEL_BARS = [
  { h: 70, color: 'danger' }, { h: 55, color: 'warn' }, { h: 45, color: 'warn' },
  { h: 35, color: 'teal' }, { h: 28, color: 'teal' }, { h: 22, color: 'teal' }, { h: 18, color: 'teal' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <div className="hero-dark">
        <div className="hero-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>Good morning</div>
            <div className="page-title">{user?.name || 'Sarah'}</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.4)', marginTop: '5px' }}>Saturday, March 14 · Last check-in: today</div>
            <button className="btn btn-teal btn-sm" style={{ marginTop: '14px' }} onClick={() => navigate('/checkin')}>
              + Today's check-in
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '22px', paddingTop: '28px' }}>
        <div>
          {/* Today's summary */}
          <div className="card card-accent card-sm" style={{ marginBottom: '16px', borderLeftColor: 'var(--teal)' }}>
            <div className="sec-label">Today's summary</div>
            <div style={{ fontSize: '14px', color: 'var(--navy)', lineHeight: 1.6 }}>
              Your habits improved this week — 10 of 12 days brushed twice. Gum sensitivity is trending up and may be linked to your sugar intake. Consider reducing sugary drinks.
            </div>
          </div>

          {/* Risk alert */}
          <RiskAlert
            title="Early cavity risk flagged"
            description="3 weeks of sensitivity + high sugar on 6 of 14 days. This is a screening flag, not a diagnosis."
          />

          {/* Conditions */}
          <div className="sec-label">Your conditions</div>
          <ConditionPanel
            icon={<GumIcon size={14} />}
            name="Gum disease"
            severity="warn"
            severityLabel="Watching"
            sub="Bleeding 2× this week · Flossed 4 of 7 days"
            bars={GUM_BARS}
          />
          <ConditionPanel
            icon={<BoltIcon size={14} />}
            name="Sensitivity"
            severity="alert"
            severityLabel="Elevated"
            sub="Reported 5 of last 7 days · Correlates with high sugar"
            bars={SENS_BARS}
          />
          <ConditionPanel
            icon={<WarnIcon size={14} />}
            name="Enamel erosion"
            severity="ok"
            severityLabel="Stable"
            sub="Low sugar 8 of 14 days · Brushing trend improving"
            bars={ENAMEL_BARS}
          />
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Coach tip */}
          <div className="card" style={{ background: 'var(--navy)' }}>
            <div className="sec-label" style={{ color: 'var(--teal)' }}>
              <CoachIcon />Coach tip
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.8)', lineHeight: 1.6 }}>
              Given your gum sensitivity trend, try rinsing with warm salt water after brushing. Especially helpful for gingivitis-prone users.
            </div>
          </div>

          {/* Photo comparison */}
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '10px' }}>Photo comparison</div>
            <div className="photo-row">
              <div className="photo-thumb">
                <ImageIcon size={26} color="var(--muted)" />
                <small>Last week</small>
              </div>
              <div className="photo-thumb">
                <CameraIcon size={26} color="var(--muted)" />
                <small>This week</small>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--slate)', background: 'var(--teal-l)', borderRadius: '8px', padding: '9px 11px', lineHeight: 1.5 }}>
              <b>Claude Vision:</b> Slight gumline redness vs last week. No new discolouration. <em style={{ color: 'var(--muted)' }}>(Not a diagnosis)</em>
            </div>
            <button className="btn btn-outline btn-sm btn-full" style={{ marginTop: '10px' }} onClick={() => navigate('/photos')}>
              View all photos →
            </button>
          </div>

          {/* This month stats */}
          <div className="card card-sm">
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '12px' }}>This month</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { val: '10', label: 'Check-ins', bg: 'var(--teal-l)', color: 'var(--teal-d)' },
                { val: '83%', label: 'Brush rate', bg: 'var(--teal-l)', color: 'var(--teal-d)' },
                { val: '6', label: 'High sugar days', bg: 'var(--warn-bg)', color: 'var(--warn)' },
                { val: '12', label: 'Day streak', bg: 'var(--teal-l)', color: 'var(--teal-d)' },
              ].map(stat => (
                <div key={stat.label} style={{ textAlign: 'center', padding: '10px', background: stat.bg, borderRadius: '8px' }}>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: stat.color }}>{stat.val}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <button className="btn btn-outline btn-full btn-sm" onClick={() => navigate('/trends')}>
            View full trends →
          </button>
        </div>
      </div>
    </div>
  );
}
