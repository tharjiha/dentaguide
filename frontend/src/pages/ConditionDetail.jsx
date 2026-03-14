import { useNavigate } from 'react-router-dom';
import { GumIcon } from '../components/Icons';

const CoachIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const TREND_BARS = [
  { h: 30, c: 'teal' }, { h: 35, c: 'teal' }, { h: 40, c: 'teal' },
  { h: 50, c: 'warn' }, { h: 55, c: 'warn' }, { h: 60, c: 'warn' },
  { h: 70, c: 'danger' }, { h: 75, c: 'danger' }, { h: 80, c: 'danger' },
  { h: 70, c: 'danger' }, { h: 75, c: 'danger' }, { h: 80, c: 'danger' },
  { h: 70, c: 'danger' }, { h: 80, c: 'danger' },
];

export default function ConditionDetail() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="hero-dark" style={{ padding: '28px 32px' }}>
        <div className="hero-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <GumIcon size={24} color="rgba(255,255,255,.9)" />
              Gum disease
            </div>
            <div className="page-sub">Gingivitis / periodontitis · Tracking since Feb 1</div>
          </div>
          <span className="badge badge-warn" style={{ fontSize: '13px', padding: '6px 16px' }}>Watching</span>
        </div>
      </div>

      <div className="container">
        <div className="two-col">
          {/* Left */}
          <div>
            <div className="card" style={{ marginBottom: '18px' }}>
              <div className="sec-label">30-day trend</div>
              <div className="chart-placeholder">
                {TREND_BARS.map((b, i) => (
                  <div key={i} className="chart-bar" style={{ height: `${b.h}%`, background: `var(--${b.c})`, opacity: 0.8 }} />
                ))}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>Risk level increasing over 30 days</div>
            </div>

            <div className="card">
              <div className="sec-label">Key metrics this week</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '4px' }}>
                {[
                  { val: '2×', label: 'Bleeding', bg: 'var(--danger-bg)', color: 'var(--danger)' },
                  { val: '4/7', label: 'Flossed', bg: 'var(--warn-bg)', color: 'var(--warn)' },
                  { val: '10/12', label: 'Brushed ×2', bg: 'var(--teal-l)', color: 'var(--teal-d)' },
                ].map(m => (
                  <div key={m.label} style={{ textAlign: 'center', padding: '12px', background: m.bg, borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: m.color }}>{m.val}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ background: 'var(--navy)' }}>
              <div className="sec-label" style={{ color: 'var(--teal)' }}>
                <CoachIcon />Coach tip for gum disease
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.8)', lineHeight: 1.6 }}>
                Flossing consistency is the single biggest lever for gingivitis. Try keeping floss next to your toothbrush so it's a natural part of the same routine.
              </div>
            </div>

            <div className="card card-sm">
              <div className="sec-label">About this condition</div>
              <div style={{ fontSize: '13px', color: 'var(--slate)', lineHeight: 1.6 }}>
                Gum disease progresses from gingivitis (reversible) to periodontitis (permanent bone loss). Daily flossing and professional cleanings every 6 months are the primary prevention methods. DentaGuide monitors for bleeding gums, gum pain, and flossing consistency.
              </div>
            </div>

            <button className="btn btn-outline btn-full" onClick={() => navigate('/dashboard')}>← Back to dashboard</button>
          </div>
        </div>
      </div>
    </div>
  );
}
