import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SettingsSidebar } from './Settings';

const Toggle = ({ defaultOn = false, onChange }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      className={`toggle ${on ? 'on' : ''}`}
      onClick={() => { setOn(v => !v); onChange?.(!on); }}
    />
  );
};

const NOTIF_CONFIG = [
  { key: 'checkin_reminder',   label: 'Daily check-in reminder',      sub: "Sent at your preferred time if you haven't checked in yet", defaultOn: true },
  { key: 'risk_alerts',        label: 'Risk alert emails',             sub: 'Sent immediately when Risk Agent flags medium or high severity', defaultOn: true },
  { key: 'weekly_summary',     label: 'Weekly summary',                sub: 'Every Monday — your past week at a glance', defaultOn: true },
  { key: 'dentist_reminders',  label: 'Dentist appointment reminders', sub: 'Every 6 months — remind me to book a cleaning', defaultOn: false },
  { key: 'tips',               label: 'Tips & product updates',        sub: 'Occasional dental health tips from our team', defaultOn: false },
];

export default function Notifications() {
  const { user } = useAuth();
  const [reminderTime, setReminderTime] = useState('8:00 PM');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div className="hero-dark" style={{ padding: '28px 32px' }}>
        <div className="hero-inner">
          <div className="page-title">Notifications</div>
          <div className="page-sub">Control when and how DentaGuide contacts you</div>
        </div>
      </div>

      <div className="container-md">
        <div className="settings-layout">
          <SettingsSidebar active="notifications" />
          <div>
            {saved && (
              <div className="card-ok" style={{ fontSize: '13px', color: '#0F5A3A', marginBottom: '16px' }}>
                Notification preferences saved.
              </div>
            )}

            <div className="card">
              <div className="sec-label">Email notifications</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '14px' }}>
                Notifications will be sent to <b style={{ color: 'var(--navy)' }}>{user?.email}</b>
              </div>

              {NOTIF_CONFIG.map(n => (
                <div className="notif-row" key={n.key}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--navy)' }}>{n.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{n.sub}</div>
                  </div>
                  <Toggle defaultOn={n.defaultOn} />
                </div>
              ))}

              <div style={{ marginTop: '18px' }}>
                <div className="form-group">
                  <label className="form-label">Preferred reminder time</label>
                  <select className="form-input" value={reminderTime} onChange={e => setReminderTime(e.target.value)}>
                    <option>7:00 PM</option>
                    <option>8:00 PM</option>
                    <option>9:00 PM</option>
                    <option>10:00 PM</option>
                  </select>
                </div>
                <button className="btn btn-teal" onClick={handleSave}>Save preferences</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}