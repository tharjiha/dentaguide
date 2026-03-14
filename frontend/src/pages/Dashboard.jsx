import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyProfile } from '../api/profile';
import { getTodayCheckin, getTrends } from '../api/checkins';
import { WarnIcon } from '../components/Icons';

const CoachIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const RISK_BADGE = {
  none: { cls: 'badge-ok', label: 'Clear' },
  low: { cls: 'badge-ok', label: 'Low risk' },
  medium: { cls: 'badge-warn', label: 'Medium risk' },
  high: { cls: 'badge-alert', label: 'High risk' },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [today, setToday] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentPhotos, setRecentPhotos] = useState([]);


  useEffect(() => {
    if (!accessToken) return;
    Promise.all([
      getMyProfile(accessToken),
      getTodayCheckin(accessToken).catch(() => null),
      getTrends(accessToken, 30).catch(() => null),
      // Fetch check-in history for photos
      fetch(`${import.meta.env.VITE_API_URL}/api/checkin/history`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }).then(r => r.json()).catch(() => []),
    ])
      .then(([p, t, tr, history]) => {
        setProfile(p);
        setToday(t);
        setTrends(tr);
        // Only keep check-ins that have a photo, take latest 3
        const photos = (history || []).filter(c => c.photo_url).slice(0, 3);
        setRecentPhotos(photos);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [accessToken]);

  const firstName = user?.first_name || user?.name || 'there';
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const checkedInToday = !!today;
  const riskLevel = (today?.risk_severity || 'none').toLowerCase();
  const showRiskAlert = riskLevel === 'medium' || riskLevel === 'high';

  const habitItems = today ? [
    { label: 'Brushed', done: today.brushed },
    { label: 'Flossed', done: today.flossed },
    { label: 'Mouthwash', done: today.mouthwash },
    { label: `Sugar: ${(today.sugar_intake || 'low')}`, done: today.sugar_intake === 'low' },
  ] : [];

  const getCoachTip = () => {
    if (today?.coach_tip) {
      const sentences = today.coach_tip.match(/[^.!?]+[.!?]+/g) || [today.coach_tip];
      return sentences.slice(0, 2).join(' ').trim();
    }
    const conditions = profile?.conditions || [];
    if (conditions.includes('Gum disease')) return 'Rinse with warm salt water after brushing to reduce gum inflammation.';
    if (conditions.includes('Sensitivity')) return 'Use a soft-bristled toothbrush designed for sensitive teeth.';
    if (conditions.includes('Enamel erosion')) return 'Wait 30 minutes after acidic foods before brushing.';
    return 'Brush for 2 minutes twice a day and floss daily.';
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: 'var(--muted)' }}>
      Loading your dashboard…
    </div>
  );

  return (
    <div>

      {/* ── Hero ── */}
      <div className="hero-dark">
        <div className="hero-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {getGreeting()}
            </div>
            <div className="page-title" style={{ marginTop: '4px' }}>{firstName}</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.4)', marginTop: '6px' }}>{dateStr}</div>

            <div style={{ marginTop: '16px' }}>
              {checkedInToday ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--teal-m)', fontWeight: 600 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Checked in today
                </div>
              ) : (
                <button className="btn btn-teal btn-sm" onClick={() => navigate('/checkin')}>
                  + Today's check-in
                </button>
              )}
            </div>
          </div>

          {trends && trends.total_checkins > 0 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { val: trends.latest_streak, label: 'Streak' },
                { val: trends.total_checkins, label: 'Check-ins' },
                { val: `${trends.brush_rate}%`, label: 'Brush rate' },
                ...(trends.avg_dental_score > 0 ? [{ val: trends.avg_dental_score, label: 'Avg score' }] : []),
              ].map(s => (
                <div key={s.label} style={{
                  background: 'rgba(255,255,255,.08)',
                  border: '1px solid rgba(255,255,255,.12)',
                  borderRadius: '10px',
                  padding: '12px 18px',
                  textAlign: 'center',
                  minWidth: '72px',
                }}>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--teal)' }}>{s.val}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.8px', marginTop: '3px' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', paddingTop: '32px' }}>

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Today's check-in summary */}
          {today ? (
            <div className="card" style={{ borderLeft: '4px solid var(--teal)', borderRadius: '0 12px 12px 0' }}>
              <div className="sec-label" style={{ marginBottom: '12px' }}>Today's check-in</div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                {habitItems.map(h => (
                  <div key={h.label} style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: h.done ? 'var(--teal-l)' : 'var(--danger-bg)',
                    color: h.done ? 'var(--teal-d)' : 'var(--danger)',
                  }}>
                    {h.label} {h.done ? '✓' : '✗'}
                  </div>
                ))}
                {today.habit_score != null && (
                  <div style={{ fontSize: '12px', color: 'var(--muted)', alignSelf: 'center', marginLeft: '4px' }}>
                    Habit score: {today.habit_score}/10
                  </div>
                )}
              </div>

              {today.symptoms?.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Symptoms reported
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {today.symptoms.map(s => (
                      <span key={s} className="badge badge-alert">{s.replace('_', ' ')}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ borderLeft: '4px solid var(--teal)', borderRadius: '0 12px 12px 0' }}>
              <div className="sec-label" style={{ marginBottom: '10px' }}>Ready to check in?</div>
              <div style={{ fontSize: '14px', color: 'var(--navy)', lineHeight: 1.6, marginBottom: '14px' }}>
                Log today's habits and symptoms to keep your AI agents up to date.
              </div>
              <button className="btn btn-teal btn-sm" onClick={() => navigate('/checkin')}>
                + Start today's check-in
              </button>
            </div>
          )}

          {/* Risk alert */}
          {showRiskAlert && (
            <div className="card-warn" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <WarnIcon size={22} color="#E89B2A" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#7A4A00', marginBottom: '8px', textTransform: 'capitalize' }}>
                  {riskLevel} risk detected
                </div>
                <div style={{ fontSize: '13px', color: '#9A6200', lineHeight: 1.7 }}>
                  {today?.risk_explanation || today?.risk_flags?.join(', ') || 'Risk pattern detected — consider booking a check-up.'}
                </div>
              </div>
            </div>
          )}

          {/* Conditions */}
          {profile?.conditions?.length > 0 && (
            <div>
              <div className="sec-label" style={{ marginBottom: '10px' }}>Your tracked conditions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {profile.conditions.map(c => {
                  const badge = RISK_BADGE[riskLevel] || RISK_BADGE.none;
                  return (
                    <div
                      key={c}
                      className="panel"
                      onClick={() => navigate('/condition')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="panel-top">
                        <div className="panel-name">{c}</div>
                        <span className={`badge ${today ? badge.cls : 'badge-teal'}`}>
                          {today ? badge.label : 'No data yet'}
                        </span>
                      </div>
                      <div className="panel-sub" style={{ marginTop: '4px' }}>
                        {today
                          ? `Habit score ${today.habit_score}/10 · ${today.symptoms?.length || 0} symptoms today`
                          : 'Complete a check-in to see condition status'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent photos */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Recent photos</div>
              <button
                className="btn btn-outline btn-sm"
                style={{ fontSize: '11px', padding: '4px 10px' }}
                onClick={() => navigate('/photos')}
              >
                View all →
              </button>
            </div>

            {recentPhotos.length === 0 ? (
              <div
                style={{
                  border: '2px dashed var(--border)',
                  borderRadius: '10px',
                  padding: '24px',
                  textAlign: 'center',
                  background: 'var(--bg)',
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/checkin')}
              >
                <div style={{ fontSize: '22px', marginBottom: '8px' }}>📷</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--slate)' }}>No photos yet</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                  Upload a photo in your next check-in
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {recentPhotos.map((photo, i) => (
                  <div
                    key={i}
                    style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '1', cursor: 'pointer' }}
                    onClick={() => navigate('/photos')}
                  >
                    <img
                      src={photo.photo_url}
                      alt={`Check-in ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
                      padding: '6px 6px 4px',
                      fontSize: '9px',
                      color: 'rgba(255,255,255,.8)',
                      fontWeight: 600,
                    }}>
                      {new Date(photo.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Onboarding nudge */}
          {!profile?.onboarding_complete && (
            <div className="card-warn" style={{ marginTop: '4px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#7A4A00', marginBottom: '8px' }}>
                Complete your profile
              </div>
              <div style={{ fontSize: '13px', color: '#9A6200', lineHeight: 1.6, marginBottom: '12px' }}>
                Finish the onboarding steps so your AI agents can be fully calibrated.
              </div>
              <button
                className="btn btn-sm"
                style={{ background: 'var(--warn)', color: '#fff' }}
                onClick={() => navigate('/profile/1')}
              >
                Continue setup →
              </button>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Coach tip */}
          <div className="card" style={{ background: 'var(--navy)' }}>
            <div className="sec-label" style={{ color: 'var(--teal)', marginBottom: '12px' }}>
              <CoachIcon /> Coach tip
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,.85)', lineHeight: 1.8 }}>
              {getCoachTip()}
            </div>
          </div>

          {/* Stats */}
          {trends && trends.total_checkins > 0 && (
            <div className="card card-sm">
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '14px' }}>
                Last 30 days
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { val: trends.total_checkins, label: 'Check-ins', bg: 'var(--teal-l)', color: 'var(--teal-d)' },
                  { val: `${trends.brush_rate}%`, label: 'Brush rate', bg: 'var(--teal-l)', color: 'var(--teal-d)' },
                  { val: trends.high_sugar_days, label: 'High sugar days', bg: 'var(--warn-bg)', color: 'var(--warn)' },
                  { val: trends.latest_streak, label: 'Streak', bg: 'var(--teal-l)', color: 'var(--teal-d)' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', padding: '12px 8px', background: s.bg, borderRadius: '8px' }}>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button className="btn btn-outline btn-full btn-sm" onClick={() => navigate('/trends')}>
            View full trends →
          </button>

        </div>
      </div>
    </div>
  );
}