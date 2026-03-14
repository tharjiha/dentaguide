import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveStep1 } from '../api/profile';

const StepSidebar = ({ current }) => (
  <div>
    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '16px' }}>Setup steps</div>
    <div className="step-list">
      {[
        { n: 1, title: 'Dental background', sub: 'Age, visit history, habits' },
        { n: 2, title: 'Conditions to track', sub: 'Select what applies' },
        { n: 3, title: 'Health history',      sub: 'Issues, meds, habits' },
      ].map(s => (
        <div className="step-item" key={s.n}>
          <div className={`step-circle ${s.n < current ? 'done' : s.n === current ? 'active' : ''}`}>
            {s.n < current ? '✓' : s.n}
          </div>
          <div className="step-info">
            <div className="st-title">{s.title}</div>
            <div className="st-sub">{s.n < current ? 'Done' : s.sub}</div>
          </div>
        </div>
      ))}
    </div>
    <div className="card" style={{ marginTop: '20px', background: 'var(--teal-l)', borderColor: 'var(--teal-m)' }}>
      <div className="sec-label">Why we ask</div>
      <div style={{ fontSize: '12px', color: 'var(--slate)', lineHeight: 1.6 }}>
        This profile shapes every AI agent prompt. A user tracking gum disease gets different risk thresholds than one tracking sensitivity.
      </div>
    </div>
  </div>
);

export default function ProfileSetup1() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [form, setForm]     = useState({ age: '', brushing_frequency: 'Twice a day', flossing_frequency: 'Daily', last_dentist_visit: '', previous_treatments: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleContinue = async () => {
    if (!form.age || !form.last_dentist_visit) { setError('Please fill in all required fields'); return; }
    setError(''); setLoading(true);
    try {
      await saveStep1({ ...form, age: parseInt(form.age, 10) }, accessToken);
      navigate('/profile/2');
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="sidebar-layout">
      <StepSidebar current={1} />
      <div>
        <div className="sec-label">Step 1 of 3</div>
        <div className="sec-title">Your dental background</div>
        <div className="sec-sub">Helps us calibrate your risk baseline from day one.</div>
        {error && <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-b)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: 'var(--danger)', marginBottom: '16px' }}>{error}</div>}
        <div className="card">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Age *</label>
              <input className="form-input" placeholder="e.g. 34" type="number" value={form.age} onChange={set('age')} />
            </div>
            <div className="form-group">
              <label className="form-label">Brushing frequency (times/day)</label>
              <select className="form-input" value={form.brushing_frequency} onChange={set('brushing_frequency')}>
                <option>Once a day</option><option>Twice a day</option><option>3+ times</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Do you floss? How often?</label>
              <select className="form-input" value={form.flossing_frequency} onChange={set('flossing_frequency')}>
                <option>Never</option><option>Rarely</option><option>A few times/week</option><option>Daily</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Last dentist visit *</label>
              <input className="form-input" placeholder="e.g. 6 months ago" value={form.last_dentist_visit} onChange={set('last_dentist_visit')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Previous dental treatments</label>
            <input className="form-input" placeholder="e.g. fillings, braces, extractions" value={form.previous_treatments} onChange={set('previous_treatments')} />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button className="btn btn-outline" onClick={() => navigate('/signup')}>← Back</button>
            <button className="btn btn-teal" onClick={handleContinue} disabled={loading}>{loading ? 'Saving…' : 'Continue →'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { StepSidebar };
