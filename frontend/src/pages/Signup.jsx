import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm]     = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 8)       { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password });
      navigate('/profile/1');
    } catch (e) {
      setError(e.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-sm">
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div className="sec-label" style={{ display: 'inline-block' }}>New account</div>
        <div className="sec-title" style={{ fontSize: '22px' }}>Create your DentaGuide account</div>
        <div className="sec-sub">Free forever · No credit card needed</div>
      </div>
      <div className="card">
        {error && (
          <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-b)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: 'var(--danger)', marginBottom: '16px' }}>
            {error}
          </div>
        )}
        <div className="form-row">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">First name</label>
            <input className="form-input" placeholder="Sarah" value={form.firstName} onChange={set('firstName')} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Last name</label>
            <input className="form-input" placeholder="Chen" value={form.lastName} onChange={set('lastName')} />
          </div>
        </div>
        <div className="form-group" style={{ marginTop: '16px' }}>
          <label className="form-label">Email address</label>
          <input className="form-input" placeholder="you@email.com" type="email" value={form.email} onChange={set('email')} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" placeholder="Min. 8 characters" type="password" value={form.password} onChange={set('password')} />
          <div className="form-hint">Must be at least 8 characters</div>
        </div>
        <div className="form-group">
          <label className="form-label">Confirm password</label>
          <input className="form-input" placeholder="••••••••" type="password" value={form.confirm} onChange={set('confirm')} />
        </div>
        <button className="btn btn-teal btn-full btn-lg" style={{ marginTop: '4px' }}
          onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating account…' : 'Create account & set up profile →'}
        </button>
        <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--muted)', marginTop: '12px' }}>
          By signing up you agree to our Terms of Service. Your data is never shared or sold.
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--slate)', marginTop: '16px' }}>
        Already have an account?{' '}
        <span style={{ color: 'var(--teal)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/login')}>Sign in</span>
      </div>
    </div>
  );
}
