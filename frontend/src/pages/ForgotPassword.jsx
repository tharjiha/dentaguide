import { useNavigate } from 'react-router-dom';
import { LockIcon } from '../components/Icons';

export default function ForgotPassword() {
  const navigate = useNavigate();
  return (
    <div className="container-sm">
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
          <LockIcon size={36} />
        </div>
        <div className="sec-title" style={{ fontSize: '22px' }}>Reset your password</div>
        <div className="sec-sub">We'll send a reset link to your email</div>
      </div>
      <div className="card">
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input className="form-input" placeholder="you@email.com" type="email" />
        </div>
        <button className="btn btn-teal btn-full btn-lg">Send reset link</button>
        <div style={{ textAlign: 'center', marginTop: '14px' }}>
          <span
            style={{ fontSize: '13px', color: 'var(--teal)', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => navigate('/login')}
          >
            ← Back to login
          </span>
        </div>
      </div>
    </div>
  );
}
