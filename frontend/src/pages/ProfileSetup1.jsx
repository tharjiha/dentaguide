import { useNavigate } from 'react-router-dom';

const StepSidebar = ({ current }) => (
  <div>
    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '16px' }}>Setup steps</div>
    <div className="step-list">
      {[
        { n: 1, title: 'Dental background', sub: 'Age, visit history, habits' },
        { n: 2, title: 'Conditions to track', sub: 'Select what applies' },
        { n: 3, title: 'Health history', sub: 'Issues, meds, habits' },
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
  return (
    <div className="sidebar-layout">
      <StepSidebar current={1} />
      <div>
        <div className="sec-label">Step 1 of 3</div>
        <div className="sec-title">Your dental background</div>
        <div className="sec-sub">Helps us calibrate your risk baseline from day one.</div>
        <div className="card">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Age</label>
              <input className="form-input" placeholder="e.g. 34" />
            </div>
            <div className="form-group">
              <label className="form-label">Current brushing frequency (times/day)</label>
              <select className="form-input">
                <option>Once a day</option>
                <option defaultValue>Twice a day</option>
                <option>3+ times</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Do you floss? How often?</label>
              <select className="form-input">
                <option>Never</option>
                <option>Rarely</option>
                <option>A few times/week</option>
                <option defaultValue>Daily</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Last dentist visit</label>
              <input className="form-input" placeholder="e.g. 6 months ago" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Previous dental treatments</label>
            <input className="form-input" placeholder="e.g. fillings, braces, extractions, root canal" />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button className="btn btn-outline" onClick={() => navigate('/signup')}>← Back</button>
            <button className="btn btn-teal" onClick={() => navigate('/profile/2')}>Continue →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { StepSidebar };
