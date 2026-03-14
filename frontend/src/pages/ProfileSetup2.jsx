import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepSidebar } from './ProfileSetup1';
import {
  GumIcon, DecayIcon, WarnIcon, GeneticIcon,
  DryMouthIcon, GrindIcon, BoltIcon, PostTreatmentIcon, WellnessIcon, CheckIcon
} from '../components/Icons';

const DEFAULT_CONDITIONS = [
  { key: 'gum', label: 'Gum disease', icon: <GumIcon size={17} />, sel: true },
  { key: 'decay', label: 'Tooth decay', icon: <DecayIcon size={17} />, sel: false },
  { key: 'enamel', label: 'Enamel erosion', icon: <WarnIcon size={17} />, sel: true },
  { key: 'genetic', label: 'Genetic risk', icon: <GeneticIcon size={17} />, sel: false },
  { key: 'dry', label: 'Dry mouth', icon: <DryMouthIcon size={17} />, sel: false },
  { key: 'grind', label: 'Teeth grinding', icon: <GrindIcon size={17} />, sel: false },
  { key: 'sensitivity', label: 'Sensitivity', icon: <BoltIcon size={17} />, sel: true },
  { key: 'post', label: 'Post-treatment', icon: <PostTreatmentIcon size={17} />, sel: false },
  { key: 'wellness', label: 'General wellness', icon: <WellnessIcon size={17} />, sel: false },
];

export default function ProfileSetup2() {
  const navigate = useNavigate();
  const [conditions, setConditions] = useState(DEFAULT_CONDITIONS);
  const [customInput, setCustomInput] = useState('');

  const toggle = (key) => {
    setConditions(prev => prev.map(c => c.key === key ? { ...c, sel: !c.sel } : c));
  };

  const addCustom = () => {
    const val = customInput.trim();
    if (!val) return;
    setConditions(prev => [...prev, {
      key: `custom_${Date.now()}`,
      label: val,
      icon: <CheckIcon size={17} />,
      sel: true,
    }]);
    setCustomInput('');
  };

  return (
    <div className="sidebar-layout">
      <StepSidebar current={2} />
      <div>
        <div className="sec-label">Step 2 of 3</div>
        <div className="sec-title">Conditions to track</div>
        <div className="sec-sub">Select all that apply. Your AI agents are tuned specifically to what you pick here.</div>
        <div className="card">
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

          {/* Custom condition input */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
              Add a custom condition
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                className="form-input"
                style={{ flex: 1 }}
                placeholder="e.g. Orthodontic treatment, implants…"
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustom()}
              />
              <button className="btn btn-outline" onClick={addCustom}>+ Add</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '18px' }}>
            <button className="btn btn-outline" onClick={() => navigate('/profile/1')}>← Back</button>
            <button className="btn btn-teal" onClick={() => navigate('/profile/3')}>Continue →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
