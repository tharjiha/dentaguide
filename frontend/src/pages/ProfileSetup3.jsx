import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveStep3 } from '../api/profile';
import { StepSidebar } from './ProfileSetup1';

export default function ProfileSetup3() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [form, setForm]     = useState({ ongoing_issues: '', medications: '', allergies: '', medical_procedures: '', dental_habits: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleFinish = async () => {
    setError(''); setLoading(true);
    try {
      await saveStep3(form, accessToken);
      navigate('/dashboard');
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="sidebar-layout">
      <div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '16px' }}>Setup steps</div>
        <div className="step-list">
          {[
            { n: 1, title: 'Dental background', done: true },
            { n: 2, title: 'Conditions to track', done: true },
            { n: 3, title: 'Health history', active: true, sub: 'Primes the Risk Agent' },
          ].map(s => (
            <div className="step-item" key={s.n}>
              <div className={`step-circle ${s.done ? 'done' : s.active ? 'active' : ''}`}>{s.done ? '✓' : s.n}</div>
              <div className="step-info">
                <div className="st-title">{s.title}</div>
                <div className="st-sub">{s.done ? 'Done' : s.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={{ marginTop: '20px', background: 'var(--teal-l)', borderColor: 'var(--teal-m)' }}>
          <div className="sec-label">Risk priming</div>
          <div style={{ fontSize: '12px', color: 'var(--slate)', lineHeight: 1.6 }}>
            Your health history raises the Risk Agent's baseline sensitivity — the same symptoms will flag earlier for you.
          </div>
        </div>
      </div>
      <div>
        <div className="sec-label">Step 3 of 3</div>
        <div className="sec-title">Health history</div>
        <div className="sec-sub">This is the final step. Your profile will be complete and your agents calibrated.</div>
        {error && <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-b)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: 'var(--danger)', marginBottom: '16px' }}>{error}</div>}
        <div className="card">
          {[
            { key: 'ongoing_issues',      label: 'Any ongoing dental issues',         placeholder: 'e.g. persistent gum bleeding, loose tooth, jaw pain' },
            { key: 'medications',         label: 'Medications taken',                  placeholder: 'e.g. blood thinners, antihistamines, antidepressants' },
            { key: 'allergies',           label: 'Allergies',                          placeholder: 'e.g. latex, penicillin, local anaesthetics' },
            { key: 'medical_procedures',  label: 'Medical procedures',                 placeholder: 'e.g. heart surgery, chemotherapy, radiation to head/neck' },
            { key: 'dental_habits',       label: 'Habits that affect your dental health', placeholder: 'e.g. smoking, nail biting, teeth grinding, frequent coffee/wine' },
          ].map(f => (
            <div className="form-group" key={f.key}>
              <label className="form-label">{f.label}</label>
              <input className="form-input" placeholder={f.placeholder} value={form[f.key]} onChange={set(f.key)} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button className="btn btn-outline" onClick={() => navigate('/profile/2')}>← Back</button>
            <button className="btn btn-teal" onClick={handleFinish} disabled={loading}>{loading ? 'Saving…' : 'Finish setup & go to dashboard →'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
