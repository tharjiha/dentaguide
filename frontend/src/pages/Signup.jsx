import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  return (
    <div className="container-sm">
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div className="sec-label" style={{ display: 'inline-block' }}>New account</div>
        <div className="sec-title" style={{ fontSize: '22px' }}>Create your DentaGuide account</div>
        <div className="sec-sub">Free forever · No credit card needed</div>
      </div>
      <div className="card">
        <div className="form-row">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">First name</label>
            <input className="form-input" placeholder="Sarah" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Last name</label>
            <input className="form-input" placeholder="Chen" />
          </div>
        </div>
        <div className="form-group" style={{ marginTop: '16px' }}>
          <label className="form-label">Email address</label>
          <input className="form-input" placeholder="you@email.com" type="email" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" placeholder="Min. 8 characters" type="password" />
          <div className="form-hint">Must include a number and a special character</div>
        </div>
        <div className="form-group">
          <label className="form-label">Confirm password</label>
          <input className="form-input" placeholder="••••••••" type="password" />
        </div>
        <button
          className="btn btn-teal btn-full btn-lg"
          style={{ marginTop: '4px' }}
          onClick={() => navigate('/profile/1')}
        >
          Create account & set up profile →
        </button>
        <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--muted)', marginTop: '12px' }}>
          By signing up you agree to our Terms of Service. Your data is never shared or sold.
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--slate)', marginTop: '16px' }}>
        Already have an account?{' '}
        <span style={{ color: 'var(--teal)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/login')}>
          Sign in
        </span>
      </div>
    </div>
  );
}
