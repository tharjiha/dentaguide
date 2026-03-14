import { useLocation, useNavigate } from 'react-router-dom';
import { WarnIcon, FlameIcon } from '../components/Icons';

export default function CheckinResult() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const result = state?.result;

  // Fallback if navigated directly without data
  if (!result) {
    navigate('/checkin');
    return null;
  }

  const agentRows = [
    {
      color: 'var(--teal)',
      name: 'Habit Agent',
      result: `Habit score: ${result.habit_score}/10 · Streak: ${result.streak} days`,
    },
    {
      color: result.risk_severity === 'high' ? 'var(--danger)'
        : result.risk_severity === 'medium' ? 'var(--warn)'
          : 'var(--teal)',
      name: 'Risk Agent',
      result: result.risk_explanation || 'No significant risk patterns detected.',
    },
    {
      color: 'var(--teal-d)',
      name: 'Coach Agent',
      result: result.coach_tip,
    },
  ];

  return (
    <div>
      <div className="result-hero">
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.4)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Check-in complete
        </div>
        <div style={{ fontSize: '64px', fontWeight: 700, color: 'var(--teal)', lineHeight: 1 }}>
          {result.dental_score}
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,.5)', marginTop: '6px' }}>
          Your dental health score
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
            <FlameIcon size={12} color="rgba(255,255,255,.6)" /> {result.streak}-day streak
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
            Agents ran successfully
          </div>
        </div>
      </div>

      <div className="container-md">
        <div className="card" style={{ marginBottom: '18px' }}>
          <div className="sec-label">Agent results</div>
          {agentRows.map(agent => (
            <div className="agent-row" key={agent.name}>
              <div className="agent-dot" style={{ background: agent.color }} />
              <div>
                <div className="agent-name">{agent.name}</div>
                <div className="agent-result">{agent.result}</div>
              </div>
            </div>
          ))}
        </div>

        {result.alert && (
          <div className="card-warn" style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#7A4A00', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <WarnIcon size={14} color="#7A4A00" /> Risk alert: {result.alert.severity} severity
            </div>
            <div style={{ fontSize: '13px', color: '#9A6200', lineHeight: 1.5 }}>
              {result.alert.explanation}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button className="btn btn-teal btn-lg" onClick={() => navigate('/dashboard')}>Go to dashboard →</button>
          {result.alert && (
            <button className="btn btn-outline" onClick={() => navigate('/alert', { state: { alert: result.alert } })}>
              View full risk alert
            </button>
          )}
        </div>
      </div>
    </div>
  );
}