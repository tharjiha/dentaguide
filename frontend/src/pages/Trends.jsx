import { useNavigate } from 'react-router-dom';

const ChartBars = ({ bars, height = 140 }) => (
  <div className="chart-placeholder" style={{ height }}>
    {bars.map((b, i) => (
      <div key={i} className="chart-bar" style={{ height: `${b}%`, background: 'var(--teal)', opacity: 0.7 }} />
    ))}
  </div>
);

const SymptomBar = ({ label, value, days, color }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--slate)', marginBottom: '4px' }}>
      <span>{label}</span><span>{days}</span>
    </div>
    <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: '3px' }} />
    </div>
  </div>
);

const HEALTH_BARS = [55, 58, 52, 60, 63, 65, 68, 70, 67, 72, 75, 73, 78, 80];
const BRUSH_BARS  = [40, 60, 80, 100, 80, 100, 100, 80, 100, 60, 100, 80, 100, 100];
const SUGAR_BARS  = [
  { h: 20, c: 'var(--teal)' }, { h: 80, c: 'var(--danger)' }, { h: 40, c: 'var(--warn)' },
  { h: 20, c: 'var(--teal)' }, { h: 80, c: 'var(--danger)' }, { h: 80, c: 'var(--danger)' },
  { h: 20, c: 'var(--teal)' }, { h: 40, c: 'var(--warn)' },   { h: 20, c: 'var(--teal)' },
  { h: 80, c: 'var(--danger)' }, { h: 20, c: 'var(--teal)' }, { h: 40, c: 'var(--warn)' },
  { h: 80, c: 'var(--danger)' }, { h: 20, c: 'var(--teal)' },
];

export default function Trends() {
  return (
    <div>
      <div className="hero-dark" style={{ padding: '28px 32px' }}>
        <div className="hero-inner">
          <div className="page-title">Trends</div>
          <div className="page-sub">30-day history across all your conditions</div>
        </div>
      </div>

      <div className="container">
        <div className="two-col">
          {/* Left column */}
          <div>
            <div className="chart-wrap" style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)' }}>Habit adherence — last 30 days</div>
                <span className="badge badge-ok">↑ Improving</span>
              </div>
              <ChartBars bars={HEALTH_BARS} />
              <div className="chart-labels">
                {['Feb 12', 'Feb 19', 'Feb 26', 'Mar 7', 'Mar 14'].map(l => (
                  <span key={l} className="chart-label">{l}</span>
                ))}
              </div>
            </div>

            <div className="chart-wrap">
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)', marginBottom: '14px' }}>Brushing rate — last 30 days</div>
              <ChartBars bars={BRUSH_BARS} />
            </div>
          </div>

          {/* Right column */}
          <div>
            <div className="chart-wrap" style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)', marginBottom: '14px' }}>Symptom frequency — last 30 days</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <SymptomBar label="Sensitivity" value={71} days="5/7 days" color="var(--danger)" />
                <SymptomBar label="Gum pain"   value={43} days="3/7 days" color="var(--warn)" />
                <SymptomBar label="Bleeding"   value={28} days="2/7 days" color="var(--warn)" />
                <SymptomBar label="Bad breath" value={14} days="1/7 days" color="var(--teal)" />
              </div>
            </div>

            <div className="chart-wrap">
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)', marginBottom: '14px' }}>Sugar intake — last 14 days</div>
              <div className="chart-placeholder" style={{ height: '100px' }}>
                {SUGAR_BARS.map((b, i) => (
                  <div key={i} className="chart-bar" style={{ height: `${b.h}%`, background: b.c, opacity: 0.7 }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                {[['var(--teal)', 'Low'], ['var(--warn)', 'Med'], ['var(--danger)', 'High']].map(([c, l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--muted)' }}>
                    <div style={{ width: '8px', height: '8px', background: c, borderRadius: '2px' }} />
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
