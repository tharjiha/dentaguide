import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyProfile } from '../api/profile';
import RiskAlert from '../components/RiskAlert';
import { CameraIcon, ImageIcon } from '../components/Icons';

const CoachIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function ProfileSummaryCard({ profile }) {
  const fields = [
    { label: 'Age',               value: profile.age },
    { label: 'Brushing',          value: profile.brushing_frequency },
    { label: 'Flossing',          value: profile.flossing_frequency },
    { label: 'Last dentist visit',value: profile.last_dentist_visit },
    { label: 'Treatments',        value: profile.previous_treatments },
    { label: 'Medications',       value: profile.medications },
    { label: 'Allergies',         value: profile.allergies },
    { label: 'Habits',            value: profile.dental_habits },
  ].filter(f => f.value);

  if (!fields.length) return null;

  return (
    <div className="card card-accent card-sm" style={{ marginBottom: '16px', borderLeftColor: 'var(--teal)' }}>
      <div className="sec-label">Your profile</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px' }}>
        {fields.map(f => (
          <div key={f.label}>
            <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.3px' }}>{f.label}: </span>
            <span style={{ fontSize: '13px', color: 'var(--navy)' }}>{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConditionsCard({ conditions }) {
  if (!conditions?.length) return null;
  return (
    <div style={{ marginBottom: '16px' }}>
      <div className="sec-label">Your tracked conditions</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
        {conditions.map(c => (
          <span key={c} className="badge badge-teal" style={{ fontSize: '12px', padding: '5px 12px' }}>{c}</span>
        ))}
      </div>
    </div>
  );
}

function HealthHistoryCard({ profile }) {
  const items = [
    { label: 'Ongoing issues',    value: profile.ongoing_issues },
    { label: 'Medical procedures',value: profile.medical_procedures },
  ].filter(f => f.value);

  if (!items.length) return null;

  return (
    <div className="card-warn" style={{ marginBottom: '16px', display: 'flex', gap: '13px', alignItems: 'flex-start' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E89B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#7A4A00', marginBottom: '6px' }}>Health notes on file</div>
        {items.map(item => (
          <div key={item.label} style={{ fontSize: '13px', color: '#9A6200', lineHeight: 1.5 }}>
            <b>{item.label}:</b> {item.value}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    getMyProfile(accessToken)
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [accessToken]);

  const firstName = user?.first_name || user?.name || 'there';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div>
      {/* Hero */}
      <div className="hero-dark">
        <div className="hero-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>{getGreeting()}</div>
            <div className="page-title">{firstName}</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.4)', marginTop: '5px' }}>{today}</div>
            <button className="btn btn-teal btn-sm" style={{ marginTop: '14px' }} onClick={() => navigate('/checkin')}>
              + Today's check-in
            </button>
          </div>
          {profile?.onboarding_complete && (
            <div style={{ background: 'rgba(42,191,191,.15)', border: '1px solid rgba(42,191,191,.3)', borderRadius: '10px', padding: '12px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--teal-m)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Profile</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--teal)' }}>Complete ✓</div>
            </div>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="container" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--muted)' }}>
          Loading your profile…
        </div>
      )}

      {/* Main content */}
      {!loading && profile && (
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '22px', paddingTop: '28px' }}>
          <div>
            {/* Profile summary */}
            <ProfileSummaryCard profile={profile} />

            {/* Conditions */}
            <ConditionsCard conditions={profile.conditions} />

            {/* Health history warnings */}
            <HealthHistoryCard profile={profile} />

            {/* Onboarding incomplete nudge */}
            {!profile.onboarding_complete && (
              <div className="card-warn" style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#7A4A00', marginBottom: '6px' }}>Complete your profile</div>
                <div style={{ fontSize: '13px', color: '#9A6200', marginBottom: '10px' }}>Finish the onboarding steps so your AI agents can be fully calibrated.</div>
                <button className="btn btn-sm" style={{ background: 'var(--warn)', color: '#fff' }} onClick={() => navigate('/profile/1')}>
                  Continue setup →
                </button>
              </div>
            )}

            {/* Check-in prompt */}
            {profile.onboarding_complete && (
              <div className="card card-accent card-sm" style={{ marginBottom: '16px', borderLeftColor: 'var(--teal)' }}>
                <div className="sec-label">Ready to check in?</div>
                <div style={{ fontSize: '14px', color: 'var(--navy)', lineHeight: 1.6, marginBottom: '12px' }}>
                  Log today's habits and symptoms to keep your AI agents up to date.
                </div>
                <button className="btn btn-teal btn-sm" onClick={() => navigate('/checkin')}>+ Start today's check-in</button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Coach tip */}
            <div className="card" style={{ background: 'var(--navy)' }}>
              <div className="sec-label" style={{ color: 'var(--teal)' }}>
                <CoachIcon />Coach tip
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.8)', lineHeight: 1.6 }}>
                {profile.conditions?.includes('Gum disease')
                  ? 'Given your gum disease tracking, try rinsing with warm salt water after brushing to reduce inflammation.'
                  : profile.conditions?.includes('Sensitivity')
                  ? 'For sensitivity, try using a soft-bristled toothbrush and fluoride toothpaste designed for sensitive teeth.'
                  : profile.conditions?.includes('Enamel erosion')
                  ? 'To protect enamel, wait 30 minutes after eating acidic foods before brushing.'
                  : 'Brush for a full 2 minutes twice a day and floss daily to maintain great dental health.'}
              </div>
            </div>

            {/* Photo */}
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '10px' }}>Photo tracking</div>
              <div className="photo-row">
                <div className="photo-thumb"><ImageIcon size={26} color="var(--muted)" /><small>Last week</small></div>
                <div className="photo-thumb"><CameraIcon size={26} color="var(--muted)" /><small>This week</small></div>
              </div>
              <button className="btn btn-outline btn-sm btn-full" style={{ marginTop: '10px' }} onClick={() => navigate('/photos')}>
                View all photos →
              </button>
            </div>

            {/* Quick links */}
            <div className="card card-sm">
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '12px' }}>Quick links</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'View trends',       path: '/trends' },
                  { label: 'Find a dentist',    path: '/dentist' },
                  { label: 'Edit your profile', path: '/settings/profile' },
                ].map(l => (
                  <button key={l.path} className="btn btn-outline btn-sm btn-full" onClick={() => navigate(l.path)}>
                    {l.label} →
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No profile yet */}
      {!loading && !profile && (
        <div className="container" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: '16px', color: 'var(--navy)', marginBottom: '12px' }}>Let's set up your profile</div>
          <button className="btn btn-teal btn-lg" onClick={() => navigate('/profile/1')}>Start setup →</button>
        </div>
      )}
    </div>
  );
}