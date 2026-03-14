import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HabitRow from '../components/HabitRow';
import { BrushIcon, FlossIcon, MouthwashIcon, SugarIcon, FlameIcon, CameraIcon } from '../components/Icons';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
const SYMPTOMS = ['Gum pain', 'Bleeding gums', 'Sensitivity', 'Bad breath', 'Tooth pain', 'Dry mouth', 'Jaw pain'];

export default function Checkin() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [symptoms,     setSymptoms]     = useState([]);
  const [sugar,        setSugar]        = useState('Low');
  const [photoUploaded,setPhotoUploaded]= useState(false);
  const [brushed,      setBrushed]      = useState(false);
  const [flossed,      setFlossed]      = useState(false);
  const [mouthwash,    setMouthwash]    = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);
  const [photoBase64,  setPhotoBase64]  = useState(null);
  const [alreadyDone,  setAlreadyDone]  = useState(false);
  const [checking,     setChecking]     = useState(true);
  const [streak,       setStreak]       = useState(null);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Check if already checked in today + get latest streak
  useEffect(() => {
    if (!accessToken) return;
    Promise.all([
      fetch(`${BASE}/api/checkins/today`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then(r => r.json()),
      fetch(`${BASE}/api/checkins/trends?days=30`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then(r => r.json()),
    ])
      .then(([todayData, trendsData]) => {
        if (todayData) setAlreadyDone(true);
        if (trendsData?.latest_streak) setStreak(trendsData.latest_streak);
      })
      .catch(console.error)
      .finally(() => setChecking(false));
  }, [accessToken]);

  const toggleSymptom = s =>
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        brushed,
        flossed,
        mouthwash,
        sugar_intake: sugar,          // "Low" | "Med" | "High" — matches your schema
        symptoms,                     // plain strings, matches your schema
        photo_base64: photoBase64 || null,
      };

      const res = await fetch(`${BASE}/api/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.detail ?? 'Submission failed');

      navigate('/result', { state: { result } });
    } catch (e) {
      console.error('Checkin error:', e);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) return (
    <div style={{ textAlign: 'center', padding: '80px', color: 'var(--muted)' }}>Loading…</div>
  );

  return (
    <div>
      {/* Hero */}
      <div className="hero-dark" style={{ padding: '28px 32px' }}>
        <div className="hero-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="page-title">Daily check-in</div>
            <div className="page-sub">{today} · Takes under 60 seconds</div>
          </div>
          {streak != null && streak > 0 && (
            <div style={{
              background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)',
              borderRadius: '20px', padding: '8px 16px', fontSize: '14px',
              color: 'var(--warn)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <FlameIcon size={14} color="var(--warn)" /> {streak}-day streak
            </div>
          )}
        </div>
      </div>

      {alreadyDone ? (
        <div className="container" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--teal)' }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>Already checked in today</div>
          <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px' }}>Come back tomorrow to log your next check-in.</div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-teal btn-lg" onClick={() => navigate('/dashboard')}>Back to dashboard</button>
            <button className="btn btn-outline" onClick={() => navigate('/trends')}>View trends →</button>
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="two-col">
            {/* LEFT — habits + symptoms */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="card">
                <div className="sec-label">Today's habits</div>
                <HabitRow icon={<BrushIcon />} name="Brushed teeth" sub="Twice today?" defaultOn={brushed} type="custom">
                  <button className={`toggle ${brushed ? 'on' : ''}`} onClick={() => setBrushed(v => !v)} />
                </HabitRow>
                <HabitRow icon={<FlossIcon />} name="Flossed" sub="Once before bed?" defaultOn={flossed} type="custom">
                  <button className={`toggle ${flossed ? 'on' : ''}`} onClick={() => setFlossed(v => !v)} />
                </HabitRow>
                <HabitRow icon={<MouthwashIcon />} name="Mouthwash" sub="Used today?" defaultOn={mouthwash} type="custom">
                  <button className={`toggle ${mouthwash ? 'on' : ''}`} onClick={() => setMouthwash(v => !v)} />
                </HabitRow>
                <HabitRow icon={<SugarIcon />} name="Sugar intake" sub="Drinks, snacks, sweets" type="custom">
                  <div className="sugar-opts">
                    {['Low', 'Med', 'High'].map(opt => (
                      <button key={opt} className={`sugar-opt ${sugar === opt ? 'sel' : ''}`}
                        onClick={() => setSugar(opt)}>{opt}</button>
                    ))}
                  </div>
                </HabitRow>
              </div>

              <div className="card">
                <div className="sec-label">Symptoms today</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>
                  Select any you noticed — or skip if you feel fine.
                </div>
                <div className="symp-wrap">
                  {SYMPTOMS.map(s => (
                    <button key={s} className={`symp ${symptoms.includes(s) ? 'sel' : ''}`}
                      onClick={() => toggleSymptom(s)}>{s}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — photo + submit */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="card">
                <div className="sec-label">Photo (optional)</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>
                  Claude Vision compares this week vs last week and flags visible changes.
                </div>
                <label style={{
                  border: '2px dashed var(--teal-m)', borderRadius: '10px', padding: '28px',
                  textAlign: 'center', background: 'var(--teal-l)', cursor: 'pointer', display: 'block',
                }}>
                  <input type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPhotoBase64(reader.result.split(',')[1]);
                        setPhotoUploaded(true);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                  {photoUploaded ? (
                    <div style={{ fontSize: '12px', color: 'var(--teal-d)', fontWeight: 600 }}>✓ Photo uploaded</div>
                  ) : (
                    <>
                      <CameraIcon size={28} color="var(--slate)" strokeWidth={1.6} />
                      <div style={{ fontSize: '13px', color: 'var(--slate)', marginTop: '8px' }}>Click to upload or drag & drop</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>JPG or PNG · Clear, well-lit photo</div>
                    </>
                  )}
                </label>
              </div>

              <div className="card" style={{ background: 'var(--teal-l)', borderColor: 'var(--teal-m)' }}>
                <div className="sec-label">What happens after you submit</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    'Habit Agent scores today and updates your streak',
                    'Risk Agent scans symptoms + 30-day history',
                    'Coach Agent generates your personalised tip',
                  ].map((text, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ width: '20px', height: '20px', background: 'var(--teal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#fff', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ fontSize: '13px', color: 'var(--navy)' }}>{text}</div>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div style={{ fontSize: '13px', color: 'var(--danger)', background: 'var(--danger-bg)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--danger-b)' }}>
                  {error}
                </div>
              )}

              <button className="btn btn-teal btn-full btn-lg" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Running agents…' : 'Submit check-in →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}