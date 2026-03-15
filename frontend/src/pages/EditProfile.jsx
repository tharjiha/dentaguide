import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyProfile, updateProfile } from '../api/profile';
import { SettingsSidebar } from './Settings';
import {
  GumIcon, DecayIcon, WarnIcon, GeneticIcon,
  DryMouthIcon, BoltIcon, CheckIcon, GrindIcon,
  PostTreatmentIcon, WellnessIcon
} from '../components/Icons';

const ALL_CONDITIONS = [
  { key: 'gum',         label: 'Gum disease',     icon: <GumIcon size={17} /> },
  { key: 'decay',       label: 'Tooth decay',      icon: <DecayIcon size={17} /> },
  { key: 'enamel',      label: 'Enamel erosion',   icon: <WarnIcon size={17} /> },
  { key: 'genetic',     label: 'Genetic risk',     icon: <GeneticIcon size={17} /> },
  { key: 'dry',         label: 'Dry mouth',        icon: <DryMouthIcon size={17} /> },
  { key: 'grind',       label: 'Teeth grinding',   icon: <GrindIcon size={17} /> },
  { key: 'sensitivity', label: 'Sensitivity',      icon: <BoltIcon size={17} /> },
  { key: 'post',        label: 'Post-treatment',   icon: <PostTreatmentIcon size={17} /> },
  { key: 'wellness',    label: 'General wellness', icon: <WellnessIcon size={17} /> },
];

export default function EditProfile() {
  const { accessToken } = useAuth();
  const [conditions, setConditions] = useState([]);
  const [customConditions, setCustomConditions] = useState([]);
  const [customInput, setCustomInput] = useState('');
  const [brushing, setBrushing] = useState('Twice a day');
  const [flossing, setFlossing] = useState('Daily');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accessToken) return;
    getMyProfile(accessToken)
      .then(profile => {
        const profileConditions = profile.conditions || [];
        setConditions(ALL_CONDITIONS.map(c => ({
          ...c,
          sel: profileConditions.includes(c.label),
        })));
        const knownLabels = ALL_CONDITIONS.map(c => c.label);
        const custom = profileConditions
          .filter(c => !knownLabels.includes(c))
          .map(label => ({ key: `custom_${label}`, label, icon: <CheckIcon size={17} />, sel: true }));
        setCustomConditions(custom);
        if (profile.brushing_frequency) setBrushing(profile.brushing_frequency);
        if (profile.flossing_frequency) setFlossing(profile.flossing_frequency);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [accessToken]);

  const toggle = key => {
    setConditions(prev => prev.map(c => c.key === key ? { ...c, sel: !c.sel } : c));
  };

  const toggleCustom = key => {
    setCustomConditions(prev => prev.map(c => c.key === key ? { ...c, sel: !c.sel } : c));
  };

  const addCustom = () => {
    const val = customInput.trim();
    if (!val) return;
    setCustomConditions(prev => [...prev, { key: `custom_${Date.now()}`, label: val, icon: <CheckIcon size={17} />, sel: true }]);
    setCustomInput('');
  };

  const handleSave = async () => {
    setError(''); setSaving(true);
    try {
      const selected = [
        ...conditions.filter(c => c.sel).map(c => c.label),
        ...customConditions.filter(c => c.sel).map(c => c.label),
      ];
      await updateProfile({
        conditions: selected,
        brushing_frequency: brushing,
        flossing_frequency: flossing,
      }, accessToken);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

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

            {saved && (
              <div className="card-ok" style={{ fontSize: '13px', color: '#0F5A3A' }}>
                Profile updated successfully. Your agents will use the new settings from your next check-in.
              </div>
            )}
            {error && (
              <div className="card-danger" style={{ fontSize: '13px', color: 'var(--danger)' }}>{error}</div>
            )}

            <div className="card-ok" style={{ fontSize: '13px', color: '#0F5A3A', lineHeight: 1.5 }}>
              Updating your conditions re-calibrates all three AI agents from your next check-in onwards.
            </div>

            {loading ? (
              <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>Loading your profile…</div>
            ) : (
              <>
                <div className="card">
                  <div className="sec-label">Conditions tracked</div>
                  <div className="cond-grid">
                    {conditions.map(c => (
                      <div key={c.key} className={`cond-card ${c.sel ? 'sel' : ''}`} onClick={() => toggle(c.key)}>
                        <div className="cond-icon">{c.icon}</div>
                        <div><div className="cond-name">{c.label}</div></div>
                      </div>
                    ))}
                    {customConditions.map(c => (
                      <div key={c.key} className={`cond-card ${c.sel ? 'sel' : ''}`} onClick={() => toggleCustom(c.key)}>
                        <div className="cond-icon">{c.icon}</div>
                        <div><div className="cond-name">{c.label}</div></div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>Add a custom condition</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input className="form-input" style={{ flex: 1 }} placeholder="e.g. Orthodontic treatment…"
                        value={customInput} onChange={e => setCustomInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addCustom()} />
                      <button className="btn btn-outline" onClick={addCustom}>+ Add</button>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="sec-label">Dental background</div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Brushing frequency</label>
                      <select className="form-input" value={brushing} onChange={e => setBrushing(e.target.value)}>
                        <option>Once a day</option>
                        <option>Twice a day</option>
                        <option>3+ times</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Flossing frequency</label>
                      <select className="form-input" value={flossing} onChange={e => setFlossing(e.target.value)}>
                        <option>Never</option>
                        <option>Rarely</option>
                        <option>A few times/week</option>
                        <option>Daily</option>
                      </select>
                    </div>
                  </div>
                  <button className="btn btn-teal" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving…' : 'Save profile'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}