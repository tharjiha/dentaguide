import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyProfile } from '../api/profile';
import { getTodayCheckin, getTrends } from '../api/checkins';
import { WarnIcon, CameraIcon, ImageIcon } from '../components/Icons';

const CoachIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const RISK_BADGE = {
  none:   { cls: 'badge-ok',   label: 'Clear' },
  low:    { cls: 'badge-ok',   label: 'Low risk' },
  medium: { cls: 'badge-warn', label: 'Medium risk' },
  high:   { cls: 'badge-alert',label: 'High risk' },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const [profile,  setProfile]  = useState(null);
  const [today,    setToday]    = useState(null);
  const [trends,   setTrends]   = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([
      getMyProfile(accessToken),
      getTodayCheckin(accessToken).catch(() => null),
      getTrends(accessToken, 30).catch(() => null),
    ])
      .then(([p, t, tr]) => { setProfile(p); setToday(t); setTrends(tr); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [accessToken]);

  const firstName = user?.first_name || user?.name || 'there';
  const dateStr   = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const checkedInToday = !!today;

  // Risk level from today's check-in (uses risk_severity from your schema)
  const riskLevel = (today?.risk_severity || 'none').toLowerCase();
  const showRiskAlert = riskLevel === 'medium' || riskLevel === 'high';

  // Habit summary line built from boolean fields
  const habitSummary = today ? [
    today.brushed   ? 'Brushed ✓' : 'Brushed ✗',
    today.flossed   ? 'Flossed ✓' : 'Flossed ✗',
    today.mouthwash ? 'Mouthwash ✓' : 'Mouthwash ✗',
    `Sugar: ${(today.sugar_intake || 'Low').toLowerCase()}`,
  ].join(' · ') : '';

  // Coach tip: today's real tip, or a profile-based default
  const getCoachTip = () => {
    if (today?.coach_tip) return today.coach_tip;
    const conditions = profile?.conditions || [];
    if (conditions.includes('Gum disease'))    return 'Rinse with warm salt water after brushing to reduce gum inflammation.';
    if (conditions.includes('Sensitivity'))    return 'Use a soft-bristled toothbrush and fluoride toothpaste designed for sensitive teeth.';
    if (conditions.includes('Enamel erosion')) return 'Wait 30 minutes after eating acidic foods before brushing to protect enamel.';
    return 'Brush for a full 2 minutes twice a day and floss daily to maintain great dental health.';
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: 'var(--muted)' }}>Loading your dashboard…</div>
  );

  return (
    <div>
      {/* Hero */}
      <div className="hero-dark">
        <div className="hero-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>{getGreeting()}</div>
            <div className="page-title">{firstName}</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.4)', marginTop: '5px' }}>{dateStr}</div>
            {checkedInToday ? (
              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--teal-m)', fontWeight: 600 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Checked in today
              </div>
            ) : (
              <button className="btn btn-teal btn-sm" style={{ marginTop: '14px' }} onClick={() => navigate('/checkin')}>
                + Today's check-in
              </button>
            )}
          </div>

          {/* Live stats from real trends */}
          {trends && trends.total_checkins > 0 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { val: trends.latest_streak,      label: 'Streak' },
                { val: trends.total_checkins,     label: 'Check-ins' },
                { val: `${trends.brush_rate}%`,   label: 'Brush rate' },
                ...(trends.avg_dental_score > 0 ? [{ val: trends.avg_dental_score, label: 'Avg dental score' }] : []),
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '10px', padding: '10px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--teal)' }}>{s.val}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.8px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '22px', paddingTop: '28px' }}>
        <div>
          {/* Today's check-in card */}
          {today ? (
            <div className="card card-accent card-sm" style={{ marginBottom: '16px', borderLeftColor: 'var(--teal)' }}>
              <div className="sec-label">Today's check-in</div>
              <div style={{ fontSize: '14px', color: 'var(--navy)', lineHeight: 1.6, marginBottom: today.symptoms?.length ? '10px' : 0 }}>
                {habitSummary}
                {today.habit_score != null && (
                  <span style={{ marginLeft: '10px', color: 'var(--muted)', fontSize: '12px' }}>Habit score: {today.habit_score}</span>
                )}
              </div>
              {today.symptoms?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {today.symptoms.map(s => <span key={s} className="badge badge-alert">{s}</span>)}
                </div>
              )}
            </div>
          ) : (
            <div className="card card-accent card-sm" style={{ marginBottom: '16px', borderLeftColor: 'var(--teal)' }}>
              <div className="sec-label">Ready to check in?</div>
              <div style={{ fontSize: '14px', color: 'var(--navy)', lineHeight: 1.6, marginBottom: '10px' }}>
                Log today's habits and symptoms to keep your AI agents up to date.
              </div>
              <button className="btn btn-teal btn-sm" onClick={() => navigate('/checkin')}>+ Start today's check-in</button>
            </div>
          )}

          {/* Risk alert */}
          {showRiskAlert && (
            <div className="card-warn" style={{ marginBottom: '16px', display: 'flex', gap: '13px', alignItems: 'flex-start' }}>
              <WarnIcon size={20} color="#E89B2A" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#7A4A00', marginBottom: '4px', textTransform: 'capitalize' }}>
                  {riskLevel} risk detected today
                </div>
                <div style={{ fontSize: '13px', color: '#9A6200', lineHeight: 1.5 }}>
                  {today?.risk_explanation || today?.risk_flags?.join(', ') || 'Risk pattern detected — consider booking a check-up.'}
                </div>
              </div>
            </div>
          )}

          {/* Conditions with real risk status */}
          {profile?.conditions?.length > 0 && (
            <>
              <div className="sec-label">Your tracked conditions</div>
              {profile.conditions.map(c => {
                const badge = RISK_BADGE[riskLevel] || RISK_BADGE.none;
                return (
                  <div key={c} className="panel" onClick={() => navigate('/condition')} style={{ cursor: 'pointer' }}>
                    <div className="panel-top">
                      <div className="panel-name">{c}</div>
                      <span className={`badge ${today ? badge.cls : 'badge-teal'}`}>
                        {today ? badge.label : 'No data yet'}
                      </span>
                    </div>
                    <div className="panel-sub">
                      {today ? habitSummary : 'Complete a check-in to see condition status'}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* Onboarding nudge */}
          {!profile?.onboarding_complete && (
            <div className="card-warn" style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#7A4A00', marginBottom: '6px' }}>Complete your profile</div>
              <div style={{ fontSize: '13px', color: '#9A6200', marginBottom: '10px' }}>Finish the onboarding steps so your AI agents can be fully calibrated.</div>
              <button className="btn btn-sm" style={{ background: 'var(--warn)', color: '#fff' }} onClick={() => navigate('/profile/1')}>Continue setup →</button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Coach tip — uses real coach_tip from latest check-in */}
          <div className="card" style={{ background: 'var(--navy)' }}>
            <div className="sec-label" style={{ color: 'var(--teal)' }}><CoachIcon />Coach tip</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.8)', lineHeight: 1.6 }}>{getCoachTip()}</div>
          </div>

          
          {/* Real stats from trends */}
          {trends && trends.total_checkins > 0 && (
            <div className="card card-sm">
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '12px' }}>Last 30 days</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { val: trends.total_checkins,           label: 'Check-ins',       bg: 'var(--teal-l)',  color: 'var(--teal-d)' },
                  { val: `${trends.brush_rate}%`,         label: 'Brush rate',      bg: 'var(--teal-l)',  color: 'var(--teal-d)' },
                  { val: trends.high_sugar_days,          label: 'High sugar days', bg: 'var(--warn-bg)', color: 'var(--warn)' },
                  { val: trends.latest_streak,            label: 'Streak',          bg: 'var(--teal-l)',  color: 'var(--teal-d)' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', padding: '10px', background: s.bg, borderRadius: '8px' }}>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button className="btn btn-outline btn-full btn-sm" onClick={() => navigate('/trends')}>View full trends →</button>
        </div>
      </div>
    </div>
  );
}