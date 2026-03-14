import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HabitRow from '../components/HabitRow';
import { BrushIcon, FlossIcon, MouthwashIcon, SugarIcon, FlameIcon, CameraIcon } from '../components/Icons';

const SYMPTOMS = ['Gum pain', 'Bleeding gums', 'Sensitivity', 'Bad breath', 'Tooth pain', 'Dry mouth', 'Jaw pain'];

export default function Checkin() {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState(['Gum pain', 'Sensitivity']);
  const [sugar, setSugar] = useState('Low');
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const toggleSymptom = (s) =>
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

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
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Habits */}
            <div className="card">
              <div className="sec-label">Today's habits</div>
              <HabitRow icon={<BrushIcon />} name="Brushed teeth" sub="Twice today?" defaultOn={true} />
              <HabitRow icon={<FlossIcon />} name="Flossed" sub="Once before bed?" defaultOn={false} />
              <HabitRow icon={<MouthwashIcon />} name="Mouthwash" sub="Used today?" defaultOn={true} />
              <HabitRow icon={<SugarIcon />} name="Sugar intake" sub="Drinks, snacks, sweets" type="custom">
                <div className="sugar-opts">
                  {['Low', 'Med', 'High'].map(opt => (
                    <button
                      key={opt}
                      className={`sugar-opt ${sugar === opt ? 'sel' : ''}`}
                      onClick={() => setSugar(opt)}
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

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Photo upload */}
            <div className="card">
              <div className="sec-label">Photo (optional)</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>
                Claude Vision compares this week vs last week and flags visible changes.
              </div>
              {photoUploaded ? (
                <div style={{
                  border: '2px dashed var(--teal-m)',
                  borderRadius: '10px',
                  padding: '28px',
                  textAlign: 'center',
                  background: 'var(--teal-l)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--teal-d)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--teal-d)', fontWeight: 600 }}>Photo uploaded</div>
                </div>
              ) : (
                <div
                  style={{
                    border: '2px dashed var(--teal-m)',
                    borderRadius: '10px',
                    padding: '28px',
                    textAlign: 'center',
                    background: 'var(--teal-l)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setPhotoUploaded(true)}
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <CameraIcon size={28} color="var(--slate)" strokeWidth={1.6} />
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--slate)', marginTop: '8px' }}>Click to upload or drag & drop</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>JPG or PNG · Clear, well-lit photo</div>
                </div>
              )}
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
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--navy)' }}>{text}</div>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-teal btn-full btn-lg" onClick={() => navigate('/result')}>
              Submit check-in →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
