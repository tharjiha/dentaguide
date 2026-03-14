import { useNavigate } from 'react-router-dom';
import { WarnIcon, FlameIcon } from '../components/Icons';

export default function CheckinResult() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Result hero */}
      <div className="result-hero">
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.4)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Check-in complete
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--teal)' }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,.5)', marginTop: '6px' }}>
          Check-in recorded for today
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '16px' }}>
          <div style={{
            background: 'rgba(255,255,255,.08)',
            border: '1px solid rgba(255,255,255,.12)',
            borderRadius: '8px',
            padding: '10px 18px',
            fontSize: '12px',
            color: 'rgba(255,255,255,.6)',
            display: 'flex', alignItems: 'center', gap: '5px',
          }}>
            <FlameIcon size={12} color="rgba(255,255,255,.6)" /> 12-day streak
          </div>
          <div style={{
            background: 'rgba(42,191,191,.15)',
            border: '1px solid rgba(42,191,191,.3)',
            borderRadius: '8px',
            padding: '10px 18px',
            fontSize: '12px',
            color: 'var(--teal-m)',
            fontWeight: 600,
          }}>
            Agents ran in 1.4s
          </div>
        </div>
      </div>

      <div className="container-md">
        {/* Agent results */}
        <div className="card" style={{ marginBottom: '18px' }}>
          <div className="sec-label">Agent results</div>
          {[
            {
              color: 'var(--teal)',
              name: 'Habit Agent',
              result: 'Brushed ✓ · Mouthwash ✓ · Floss ✗ · Sugar: low. Streak extended to 12 days.',
            },
            {
              color: 'var(--warn)',
              name: 'Risk Agent',
              result: 'Gum pain + sensitivity on 5 of 7 days. Combined with low flossing — early gingivitis pattern. Severity: medium. Dentist referral recommended.',
            },
            {
              color: 'var(--teal-d)',
              name: 'Coach Agent',
              result: 'Tip: Rinse with warm salt water tonight. Given your gum disease tracking, this reduces inflammation before symptoms progress.',
            },
          ].map(agent => (
            <div className="agent-row" key={agent.name}>
              <div className="agent-dot" style={{ background: agent.color }} />
              <div>
                <div className="agent-name">{agent.name}</div>
                <div className="agent-result">{agent.result}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Risk alert */}
        <div className="card-warn" style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#7A4A00', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <WarnIcon size={14} color="#7A4A00" /> Risk alert: medium severity
          </div>
          <div style={{ fontSize: '13px', color: '#9A6200', lineHeight: 1.5 }}>
            3 weeks of sensitivity + high sugar pattern detected. Not a diagnosis — but worth a check-up.
          </div>
          <button
            className="btn btn-sm"
            style={{ marginTop: '10px', background: 'var(--warn)', color: '#fff' }}
            onClick={() => navigate('/dentist')}
          >
            Find a covered dentist →
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button className="btn btn-teal btn-lg" onClick={() => navigate('/dashboard')}>Go to dashboard →</button>
          <button className="btn btn-outline" onClick={() => navigate('/alert')}>View full risk alert</button>
        </div>
      </div>
    </div>
  );
}
