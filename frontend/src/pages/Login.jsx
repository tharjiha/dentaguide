import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { logIn } = useAuth();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await logIn(form);
      navigate('/dashboard');
    } catch (e) {
      setError(e.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 56px)' }}>
      {}
      <div style={{
        background: 'linear-gradient(145deg, var(--navy) 0%, #0F2438 100%)',
        padding: '60px 48px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '12px', lineHeight: 1.2 }}>
          Welcome back to <span style={{ color: 'var(--teal)' }}>DentaGuide</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '14px', lineHeight: 1.6 }}>
          Your dental health doesn't take days off — and neither do your agents.
        </p>
      </div>

      {}
      <div style={{ background: 'var(--body)', padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="sec-title">Sign in</div>
        <div className="sec-sub">Enter your email and password to continue</div>

        {error && (
          <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-b)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: 'var(--danger)', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Email address</label>
          <input className="form-input" type="email" placeholder="you@email.com"
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••"
            value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>
        <div style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '18px' }}>
          <span style={{ fontSize: '12px', color: 'var(--teal)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => navigate('/forgot')}>Forgot password?</span>
        </div>
        <button className="btn btn-teal btn-full btn-lg" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in →'}
        </button>
        <div className="divider"><span>or</span></div>
        <button className="btn btn-navy btn-full" onClick={() => navigate('/signup')}>Create a free account</button>
      </div>
    </div>
  );
}
