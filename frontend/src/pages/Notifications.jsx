import { useState } from 'react';
import { SettingsSidebar } from './Settings';

const Toggle = ({ defaultOn = false }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <button className={`toggle ${on ? 'on' : ''}`} onClick={() => setOn(v => !v)} />
  );
};

const NOTIFS = [
  { label: 'Daily check-in reminder', sub: 'Sent at 8pm if you haven\'t checked in yet', on: true },
  { label: 'Risk alert emails', sub: 'Sent immediately when Risk Agent flags medium or high severity', on: true },
  { label: 'Weekly summary', sub: 'Every Monday — your past week at a glance', on: true },
  { label: 'Dentist appointment reminders', sub: 'Every 6 months — remind me to book a cleaning', on: false },
  { label: 'Tips & product updates', sub: 'Occasional dental health tips from our team', on: false },
];

export default function Notifications() {
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
            <div className="card">
              <div className="sec-label">Email notifications</div>
              {NOTIFS.map(n => (
                <div className="notif-row" key={n.label}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--navy)' }}>{n.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{n.sub}</div>
                  </div>
                  <Toggle defaultOn={n.on} />
                </div>
              ))}
              <div style={{ marginTop: '18px' }}>
                <div className="form-group">
                  <label className="form-label">Preferred reminder time</label>
                  <select className="form-input">
                    <option>7:00 PM</option>
                    <option defaultValue>8:00 PM</option>
                    <option>9:00 PM</option>
                    <option>10:00 PM</option>
                  </select>
                </div>
                <button className="btn btn-teal">Save preferences</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
