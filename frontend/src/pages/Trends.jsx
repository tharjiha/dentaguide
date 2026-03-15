import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTrends } from '../api/checkins';

const SUGAR_COLORS = { Low: 'var(--teal)', Med: 'var(--warn)', High: 'var(--danger)' };
const RISK_COLORS = { none: 'var(--teal)', low: 'var(--teal)', medium: 'var(--warn)', high: 'var(--danger)' };
const RISK_BG = { none: 'var(--teal-l)', low: 'var(--teal-l)', medium: 'var(--warn-bg)', high: 'var(--danger-bg)' };

function RateBar({ label, value, color = 'var(--teal)' }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--slate)', marginBottom: '4px' }}>
        <span>{label}</span><span>{value}%</span>
      </div>
      <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: '3px', transition: 'width .5s ease' }} />
      </div>
    </div>
  );
}

function BarChart({ daily, colorFn, valueFn, height = 120, emptyMsg = 'No data' }) {
  if (!daily.length) return (
    <div style={{ height, background: 'var(--teal-l)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'var(--muted)' }}>
      {emptyMsg}
    </div>
  );
  return (
    <div style={{ background: 'var(--teal-l)', borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'flex-end', gap: '3px', height }}>
      {daily.map((d, i) => (
        <div
          key={i}
          title={`${d.date}`}
          style={{ flex: 1, background: colorFn(d), borderRadius: '2px 2px 0 0', height: `${valueFn(d) * 85}%`, opacity: 0.85, minHeight: '3px' }}
        />
      ))}
    </div>
  );
}

function ScoreLine({ daily, field, color, height = 100 }) {
  if (!daily.length) return (
    <div style={{ height, background: 'var(--teal-l)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'var(--muted)' }}>No data</div>
  );
  const values = daily.map(d => d[field] ?? 0);
  const max = Math.max(...values, 1);
  return (
    <div style={{ background: 'var(--teal-l)', borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'flex-end', gap: '3px', height }}>
      {values.map((v, i) => (
        <div key={i} title={`${daily[i].date}: ${v}`}
          style={{ flex: 1, background: color, borderRadius: '2px 2px 0 0', height: `${(v / max) * 85}%`, opacity: 0.8, minHeight: '3px' }} />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--teal)' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      </div>
      <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>No check-in data yet</div>
      <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px' }}>Complete your first daily check-in to start seeing trends here.</div>
      <a href="/checkin" className="btn btn-teal btn-lg">Start today's check-in →</a>
    </div>
  );
}

export default function Trends() {
  const { accessToken } = useAuth();
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    getTrends(accessToken, days)
      .then(setTrends)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [accessToken, days]);

  return (
    <div>
      <div className="hero-dark" style={{ padding: '28px 32px' }}>
        <div className="hero-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="page-title">Trends</div>
            <div className="page-sub">Your check-in history and habit patterns</div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[7, 14, 30].map(d => (
              <button key={d} onClick={() => setDays(d)} className="btn btn-sm"
                style={{ background: days === d ? 'var(--teal)' : 'rgba(255,255,255,.1)', color: days === d ? '#fff' : 'rgba(255,255,255,.6)', border: 'none' }}>
                {d}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--muted)' }}>Loading trends…</div>
      ) : !trends || trends.total_checkins === 0 ? (
        <div className="container"><EmptyState /></div>
      ) : (
        <div className="container">
          {}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
            {[
              { val: trends.total_checkins, label: 'Check-ins', bg: 'var(--teal-l)', color: 'var(--teal-d)' },
              { val: `${trends.brush_rate}%`, label: 'Brush rate', bg: 'var(--teal-l)', color: 'var(--teal-d)' },
              { val: trends.high_sugar_days, label: 'High sugar days', bg: 'var(--warn-bg)', color: 'var(--warn)' },
              { val: trends.latest_streak, label: 'Current streak', bg: 'var(--teal-l)', color: 'var(--teal-d)' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '14px', background: s.bg, borderRadius: '10px' }}>
                <div style={{ fontSize: '26px', fontWeight: 700, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {}
          {(trends.avg_habit_score > 0) && (
            <div style={{ marginBottom: '28px' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'var(--teal-l)' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--teal-d)' }}>{trends.avg_habit_score}</div>
                <div style={{ fontSize: '13px', color: 'var(--slate)' }}>
                  Avg habit score<br />
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>last {days} days</span>
                </div>
              </div>
            </div>
          )}

          <div className="two-col">
            {}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              <div className="chart-wrap">
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)', marginBottom: '14px' }}>Habit adherence rates</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <RateBar label="Brushing" value={trends.brush_rate} color={trends.brush_rate >= 80 ? 'var(--teal)' : trends.brush_rate >= 50 ? 'var(--warn)' : 'var(--danger)'} />
                  <RateBar label="Flossing" value={trends.floss_rate} color={trends.floss_rate >= 80 ? 'var(--teal)' : trends.floss_rate >= 50 ? 'var(--warn)' : 'var(--danger)'} />
                  <RateBar label="Mouthwash" value={trends.mouthwash_rate} color="var(--teal)" />
                </div>
              </div>

              <div className="chart-wrap">
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)', marginBottom: '10px' }}>Brushing — last {days} days</div>
                <BarChart
                  daily={trends.daily}
                  valueFn={d => d.brushed ? 1 : 0.15}
                  colorFn={d => d.brushed ? 'var(--teal)' : 'var(--border-m)'}
                />
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  {[['var(--teal)', 'Brushed'], ['var(--border-m)', 'Skipped']].map(([c, l]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--muted)' }}>
                      <div style={{ width: '8px', height: '8px', background: c, borderRadius: '2px' }} />{l}
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-wrap">
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)', marginBottom: '10px' }}>Sugar intake — last {days} days</div>
                <BarChart
                  daily={trends.daily}
                  valueFn={d => d.sugar_intake === 'High' ? 1 : d.sugar_intake === 'Med' ? 0.55 : 0.2}
                  colorFn={d => SUGAR_COLORS[d.sugar_intake] || 'var(--teal)'}
                  height={100}
                />
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  {['Low', 'Med', 'High'].map(l => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--muted)' }}>
                      <div style={{ width: '8px', height: '8px', background: SUGAR_COLORS[l], borderRadius: '2px' }} />{l}
                    </div>
                  ))}
                </div>
              </div>

              {}
              {trends.avg_habit_score > 0 && (
                <div className="chart-wrap">
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)', marginBottom: '10px' }}>Habit score — last {days} days</div>
                  <ScoreLine daily={trends.daily} field="habit_score" color="var(--teal)" />
                </div>
              )}
            </div>

            {}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              <div className="chart-wrap">
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)', marginBottom: '14px' }}>Symptom frequency</div>
                {Object.keys(trends.symptom_frequency).length === 0 ? (
                  <div style={{ fontSize: '13px', color: 'var(--muted)', textAlign: 'center', padding: '20px' }}>No symptoms logged — great!</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {Object.entries(trends.symptom_frequency).slice(0, 7).map(([sym, pct]) => (
                      <RateBar key={sym} label={sym} value={pct}
                        color={pct >= 50 ? 'var(--danger)' : pct >= 25 ? 'var(--warn)' : 'var(--teal)'} />
                    ))}
                  </div>
                )}
              </div>

              <div className="chart-wrap">
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)', marginBottom: '14px' }}>Risk breakdown</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { key: 'none', label: 'Clear' },
                    { key: 'low', label: 'Low' },
                    { key: 'medium', label: 'Medium' },
                    { key: 'high', label: 'High' },
                  ].map(({ key, label }) => (
                    <div key={key} style={{ textAlign: 'center', padding: '10px', background: RISK_BG[key], borderRadius: '8px' }}>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: RISK_COLORS[key] }}>{trends.risk_breakdown[key] ?? 0}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-wrap">
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)', marginBottom: '10px' }}>Risk history — last {days} days</div>
                <BarChart
                  daily={trends.daily}
                  valueFn={d => d.risk_severity === 'high' ? 1 : d.risk_severity === 'medium' ? 0.6 : d.risk_severity === 'low' ? 0.3 : 0.1}
                  colorFn={d => RISK_COLORS[d.risk_severity] || 'var(--teal)'}
                />
              </div>

              {}
              {trends.avg_dental_score > 0 && (
                <div className="chart-wrap">
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)', marginBottom: '10px' }}>Dental score — last {days} days</div>
                  <ScoreLine daily={trends.daily} field="dental_score" color="var(--navy-m)" />
                </div>
              )}
            </div>
          </div>

          {}
          {trends.daily.length > 0 && trends.daily[trends.daily.length - 1].coach_tip && (
            <div className="card" style={{ background: 'var(--navy)', marginTop: '24px' }}>
              <div className="sec-label" style={{ color: 'var(--teal)' }}>Latest coach tip</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,.8)', lineHeight: 1.6 }}>
                {trends.daily[trends.daily.length - 1].coach_tip}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}