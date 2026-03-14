import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { logIn } = useAuth();

  const handleLogin = () => {
    logIn();
    navigate('/dashboard');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 56px)' }}>
      {/* Left panel */}
      <div style={{
        background: 'linear-gradient(145deg, var(--navy) 0%, #0F2438 100%)',
        padding: '60px 48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '12px', lineHeight: 1.2 }}>
          Welcome back to <span style={{ color: 'var(--teal)' }}>DentaGuide</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '14px', lineHeight: 1.6 }}>
          Your dental health doesn't take days off — and neither do your agents.
        </p>
      </div>

      {/* Right form */}
      <div style={{ background: 'var(--body)', padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="sec-title">Sign in</div>
        <div className="sec-sub">Enter your email and password to continue</div>
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input className="form-input" placeholder="you@email.com" type="email" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" placeholder="••••••••" type="password" />
        </div>
        <div style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '18px' }}>
          <span
            style={{ fontSize: '12px', color: 'var(--teal)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => navigate('/forgot')}
          >
            Forgot password?
          </span>
        </div>
        <button className="btn btn-teal btn-full btn-lg" onClick={handleLogin}>Sign in →</button>
        <div className="divider"><span>or</span></div>
        <button className="btn btn-navy btn-full" onClick={() => navigate('/signup')}>Create a free account</button>
      </div>
    </div>
  );
}
