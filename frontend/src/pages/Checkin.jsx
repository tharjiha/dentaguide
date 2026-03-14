import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HabitRow from '../components/HabitRow';
import { BrushIcon, FlossIcon, MouthwashIcon, SugarIcon, FlameIcon, CameraIcon } from '../components/Icons';
import { submitCheckin } from '../api/checkin';

const SYMPTOMS = ['Gum pain', 'Bleeding gums', 'Sensitivity', 'Bad breath', 'Tooth pain', 'Dry mouth', 'Jaw pain'];

export default function Checkin() {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState(['Gum pain', 'Sensitivity']);
  const [sugar, setSugar] = useState('low');
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [brushed, setBrushed] = useState(true);
  const [flossed, setFlossed] = useState(false);
  const [mouthwash, setMouthwash] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [photoBase64, setPhotoBase64] = useState(null);

  const toggleSymptom = (s) =>
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        brushed,
        flossed,
        mouthwash,
        sugar_intake: sugar.toLowerCase(),
        symptoms: symptoms.map(s => s.toLowerCase().replace(' ', '_')),
        photo_base64: photoBase64 || null,
      };
      const token = 'temp';
      const result = await submitCheckin(payload, token);
      navigate('/result', { state: { result } });
    } catch (e) {
      console.error('fetch error:', e);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <div className="hero-dark" style={{ padding: '28px 32px' }}>
        <div className="hero-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="page-title">Daily check-in</div>
            <div className="page-sub">Saturday, March 14 · Takes under 60 seconds</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,.1)',
            border: '1px solid rgba(255,255,255,.15)',
            borderRadius: '20px',
            padding: '8px 16px',
            fontSize: '14px',
            color: 'var(--warn)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <FlameIcon size={14} color="var(--warn)" /> 12-day streak
          </div>
        </div>
      </div>

      <div className="container">
        <div className="two-col">

          {/* LEFT column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Habits */}
            <div className="card">
              <div className="sec-label">Today's habits</div>
              <HabitRow icon={<BrushIcon />} name="Brushed teeth" sub="Twice today?" defaultOn={brushed} onChange={setBrushed} />
              <HabitRow icon={<FlossIcon />} name="Flossed" sub="Once before bed?" defaultOn={flossed} onChange={setFlossed} />
              <HabitRow icon={<MouthwashIcon />} name="Mouthwash" sub="Used today?" defaultOn={mouthwash} onChange={setMouthwash} />
              <HabitRow icon={<SugarIcon />} name="Sugar intake" sub="Drinks, snacks, sweets" type="custom">
                <div className="sugar-opts">
                  {['Low', 'Med', 'High'].map(opt => (
                    <button
                      key={opt}
                      className={`sugar-opt ${sugar === opt.toLowerCase() ? 'sel' : ''}`}
                      onClick={() => setSugar(opt.toLowerCase())}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </HabitRow>
            </div>

            {/* Symptoms */}
            <div className="card">
              <div className="sec-label">Symptoms today</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>
                Select any you noticed — or skip if you feel fine.
              </div>
              <div className="symp-wrap">
                {SYMPTOMS.map(s => (
                  <button
                    key={s}
                    className={`symp ${symptoms.includes(s) ? 'sel' : ''}`}
                    onClick={() => toggleSymptom(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Photo upload */}
            <div className="card">
              <div className="sec-label">Photo (optional)</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>
                Claude Vision compares this week vs last week and flags visible changes.
              </div>
              <label style={{
                border: '2px dashed var(--teal-m)',
                borderRadius: '10px',
                padding: '28px',
                textAlign: 'center',
                background: 'var(--teal-l)',
                cursor: 'pointer',
                display: 'block',
              }}>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64 = reader.result.split(',')[1];
                      setPhotoBase64(base64);
                      setPhotoUploaded(true);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                {photoUploaded ? (
                  <div style={{ fontSize: '12px', color: 'var(--teal-d)', fontWeight: 600 }}>✓ Photo uploaded</div>
                ) : (
                  <>
                    <CameraIcon size={28} color="var(--slate)" strokeWidth={1.6} />
                    <div style={{ fontSize: '13px', color: 'var(--slate)', marginTop: '8px' }}>Click to upload or drag & drop</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>JPG or PNG · Clear, well-lit photo</div>
                  </>
                )}
              </label>
            </div>

            {/* What happens next */}
            <div className="card" style={{ background: 'var(--teal-l)', borderColor: 'var(--teal-m)' }}>
              <div className="sec-label">What happens after you submit</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Habit Agent scores today and updates your streak',
                  'Risk Agent scans symptoms + 30-day history',
                  'Coach Agent generates your personalised tip',
                ].map((text, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '20px', height: '20px',
                      background: 'var(--teal)',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', color: '#fff', fontWeight: 700, flexShrink: 0,
                    }}>{i + 1}</div>
                    <div style={{ fontSize: '13px', color: 'var(--navy)' }}>{text}</div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ fontSize: '13px', color: 'var(--danger)', background: 'var(--danger-bg)', padding: '10px 14px', borderRadius: '8px' }}>
                {error}
              </div>
            )}

            <button
              className="btn btn-teal btn-full btn-lg"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Running agents...' : 'Submit check-in →'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}