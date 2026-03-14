import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StepSidebar } from './ProfileSetup1';

export default function ProfileSetup3() {
  const navigate = useNavigate();
  const { logIn } = useAuth();

  const handleFinish = () => {
    logIn();
    navigate('/dashboard');
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
              <div className={`step-circle ${s.done ? 'done' : s.active ? 'active' : ''}`}>
                {s.done ? '✓' : s.n}
              </div>
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
            Your health history raises the Risk Agent's baseline sensitivity — the same symptoms will flag earlier for you than for someone without a relevant background.
          </div>
        </div>
      </div>

      <div>
        <div className="sec-label">Step 3 of 3</div>
        <div className="sec-title">Health history</div>
        <div className="sec-sub">This is the final step. Your profile will be complete and your agents calibrated.</div>
        <div className="card">
          <div className="form-group">
            <label className="form-label">Any ongoing dental issues</label>
            <input className="form-input" placeholder="e.g. persistent gum bleeding, loose tooth, jaw pain" />
          </div>
          <div className="form-group">
            <label className="form-label">Medications taken</label>
            <input className="form-input" placeholder="e.g. blood thinners, antihistamines, antidepressants" />
          </div>
          <div className="form-group">
            <label className="form-label">Allergies</label>
            <input className="form-input" placeholder="e.g. latex, penicillin, local anaesthetics" />
          </div>
          <div className="form-group">
            <label className="form-label">Medical procedures</label>
            <input className="form-input" placeholder="e.g. heart surgery, chemotherapy, radiation to head/neck" />
          </div>
          <div className="form-group">
            <label className="form-label">Habits that affect your dental health</label>
            <input className="form-input" placeholder="e.g. smoking, nail biting, teeth grinding, frequent coffee/wine" />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button className="btn btn-outline" onClick={() => navigate('/profile/2')}>← Back</button>
            <button className="btn btn-teal" onClick={handleFinish}>Finish setup & go to dashboard →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
