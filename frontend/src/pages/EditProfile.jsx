import { useState } from 'react';
import { SettingsSidebar } from './Settings';
import {
  GumIcon, DecayIcon, WarnIcon, GeneticIcon,
  DryMouthIcon, BoltIcon, CheckIcon
} from '../components/Icons';

const DEFAULT_CONDITIONS = [
  { key: 'gum', label: 'Gum disease', icon: <GumIcon size={17} />, sel: true },
  { key: 'decay', label: 'Tooth decay', icon: <DecayIcon size={17} />, sel: false },
  { key: 'enamel', label: 'Enamel erosion', icon: <WarnIcon size={17} />, sel: true },
  { key: 'genetic', label: 'Genetic risk', icon: <GeneticIcon size={17} />, sel: false },
  { key: 'dry', label: 'Dry mouth', icon: <DryMouthIcon size={17} />, sel: false },
  { key: 'sensitivity', label: 'Sensitivity', icon: <BoltIcon size={17} />, sel: true },
];

export default function EditProfile() {
  const [conditions, setConditions] = useState(DEFAULT_CONDITIONS);
  const toggle = (key) => setConditions(prev => prev.map(c => c.key === key ? { ...c, sel: !c.sel } : c));

  return (
    <div>
      <div className="hero-dark" style={{ padding: '28px 32px' }}>
        <div className="hero-inner">
          <div className="page-title">Edit profile</div>
          <div className="page-sub">Update your conditions and dental history</div>
        </div>
      </div>

      <div className="container-md">
        <div className="settings-layout">
          <SettingsSidebar active="editprofile" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card-ok" style={{ fontSize: '13px', color: '#0F5A3A', lineHeight: 1.5 }}>
              Updating your conditions re-calibrates all three AI agents from your next check-in onwards.
            </div>

            <div className="card">
              <div className="sec-label">Conditions tracked</div>
              <div className="cond-grid">
                {conditions.map(c => (
                  <div
                    key={c.key}
                    className={`cond-card ${c.sel ? 'sel' : ''}`}
                    onClick={() => toggle(c.key)}
                  >
                    <div className="cond-icon">{c.icon}</div>
                    <div><div className="cond-name">{c.label}</div></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="sec-label">Dental background</div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Brushing frequency</label>
                  <select className="form-input">
                    <option>Once a day</option>
                    <option defaultValue>Twice a day</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Flossing frequency</label>
                  <select className="form-input">
                    <option>Rarely</option>
                    <option>A few times/week</option>
                    <option defaultValue>Daily</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-teal">Save profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
