import { useNavigate } from 'react-router-dom';
import { RobotIcon, CameraIcon, ToothIcon } from '../components/Icons';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div>
      {}
      <div className="landing-hero">
        <h1>Monitor your dental health, <span>every single day.</span></h1>
        <p>DentaGuide uses agentic AI to track habits, detect risk patterns, and coach you — before problems become expensive.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-teal btn-lg" onClick={() => navigate('/signup')}>Start for free →</button>
          <button
            className="btn btn-lg"
            style={{ background: 'rgba(255,255,255,.1)', color: '#fff', border: '1px solid rgba(255,255,255,.2)' }}
            onClick={() => navigate('/login')}
          >
            Sign in
          </button>
        </div>
        <div className="feat-grid">
          <div className="feat-card">
            <div className="f-icon"><RobotIcon size={24} color="var(--teal)" /></div>
            <h3>3 AI agents, in parallel</h3>
            <p>Habit Agent, Risk Agent, and Coach Agent all fire every time you check in — results in under 2 seconds.</p>
          </div>
          <div className="feat-card">
            <div className="f-icon"><CameraIcon size={24} color="var(--teal)" /></div>
            <h3>Claude Vision photo scan</h3>
            <p>Upload a photo weekly. Claude compares it to last week and flags visible changes — redness, discolouration, buildup.</p>
          </div>
          <div className="feat-card">
            <div className="f-icon"><ToothIcon size={24} color="var(--teal)" /></div>
            <h3>Dentist referrals</h3>
            <p>When the Risk Agent flags a medium or high severity pattern, one tap connects you to a covered dentist nearby.</p>
          </div>
        </div>
      </div>

      {}
      <div className="how-section">
        <div className="how-inner">
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <div className="sec-label" style={{ display: 'inline-block' }}>How it works</div>
          </div>
          <div className="sec-title" style={{ textAlign: 'center', fontSize: '22px' }}>Four steps. Under 60 seconds a day.</div>
          <div className="how-steps">
            {[
              { n: 1, h: 'Set up your profile', p: 'Tell us your conditions, habits, and health history. One time only.' },
              { n: 2, h: 'Daily check-in', p: 'Tap your habits, select any symptoms, and optionally upload a photo.' },
              { n: 3, h: 'AI scans your data', p: 'Three agents analyse your history and surface risks before they develop.' },
              { n: 4, h: 'Act on your dashboard', p: 'Read your personalised tip, track trends, and book a dentist if flagged.' },
            ].map(s => (
              <div className="how-step" key={s.n}>
                <div className="hs-num">{s.n}</div>
                <h4>{s.h}</h4>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <button className="btn btn-teal btn-lg" onClick={() => navigate('/signup')}>Create your free account →</button>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '10px' }}>No credit card required</div>
          </div>
        </div>
      </div>
    </div>
  );
}
