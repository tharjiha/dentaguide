import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function SettingsSidebar({ active }) {
  const navigate = useNavigate();
  const { logOut } = useAuth();

  const links = [
    { key: 'settings',      label: 'Account',       path: '/settings' },
    { key: 'editprofile',   label: 'Edit profile',  path: '/settings/profile' },
    { key: 'notifications', label: 'Notifications', path: '/settings/notifications' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {links.map(l => (
        <button key={l.key} onClick={() => navigate(l.path)} style={{
          textAlign: 'left', borderRadius: '7px', padding: '9px 13px',
          fontSize: '13px', fontWeight: active === l.key ? 600 : 500,
          color: active === l.key ? 'var(--teal-d)' : 'var(--slate)',
          background: active === l.key ? 'var(--teal-l)' : 'transparent',
          border: 'none', cursor: 'pointer', transition: 'all .15s',
        }}>
          {l.label}
        </button>
      ))}
      <button onClick={() => { logOut(); navigate('/'); }} style={{
        textAlign: 'left', borderRadius: '7px', padding: '9px 13px',
        fontSize: '13px', fontWeight: 500, color: 'var(--danger)',
        background: 'transparent', border: 'none', cursor: 'pointer',
      }}>
        Sign out
      </button>
    </div>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const firstName = user?.first_name || '';
  const lastName  = user?.last_name  || '';
  const email     = user?.email      || '';

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div className="hero-dark" style={{ padding: '28px 32px' }}>
        <div className="hero-inner">
          <div className="page-title">Account settings</div>
          <div className="page-sub">Manage your DentaGuide account</div>
        </div>
      </div>

      <div className="container-md">
        <div className="settings-layout">
          <SettingsSidebar active="settings" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {saved && (
              <div className="card-ok" style={{ fontSize: '13px', color: '#0F5A3A' }}>
                Changes saved successfully.
              </div>
            )}

            <div className="card">
              <div className="sec-label">Personal info</div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First name</label>
                  <input className="form-input" defaultValue={firstName} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last name</label>
                  <input className="form-input" defaultValue={lastName} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email address</label>
                <input className="form-input" defaultValue={email} type="email" />
              </div>
              <button className="btn btn-teal" onClick={handleSave}>Save changes</button>
            </div>

            <div className="card">
              <div className="sec-label">Change password</div>
              <div className="form-group">
                <label className="form-label">Current password</label>
                <input className="form-input" type="password" placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label className="form-label">New password</label>
                <input className="form-input" type="password" placeholder="••••••••" />
              </div>
              <button className="btn btn-outline">Update password</button>
            </div>

            <div className="card">
              <div className="sec-label" style={{ color: 'var(--danger)' }}>Danger zone</div>
              <div style={{ fontSize: '13px', color: 'var(--slate)', marginBottom: '12px' }}>
                Deleting your account removes all check-in history, photos, and profile data permanently.
              </div>
              <button className="btn btn-danger">Delete account</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}