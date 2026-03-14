import { useLocation, useNavigate } from 'react-router-dom';
import { WarnIcon, InfoIcon } from '../components/Icons';

const IMPRESSION_CONFIG = {
  healthy:              { label: 'Looks healthy',        badge: 'badge-ok',    color: 'var(--ok)' },
  mild_concerns:        { label: 'Mild concerns noted',  badge: 'badge-warn',  color: 'var(--warn)' },
  notable_concerns:     { label: 'Notable concerns',     badge: 'badge-warn',  color: 'var(--warn)' },
  significant_concerns: { label: 'Significant concerns', badge: 'badge-alert', color: 'var(--danger)' },
};

const ACTION_CONFIG = {
  none:                { label: 'No action needed',         color: 'var(--ok)' },
  monitor:             { label: 'Monitor over time',        color: 'var(--teal-d)' },
  mention_to_dentist:  { label: 'Mention to your dentist',  color: 'var(--warn)' },
  see_dentist_soon:    { label: 'See a dentist soon',       color: 'var(--danger)' },
};

const RISK_COLORS = {
  none: 'var(--teal)', low: 'var(--teal)', medium: 'var(--warn)', high: 'var(--danger)',
};

function BulletList({ items, color }) {
  if (!items?.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '13px', color: 'var(--slate)' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, marginTop: '5px', flexShrink: 0 }} />
          {item}
        </div>
      ))}
    </div>
  );
}

function PhotoAnalysisCard({ analysis }) {
  if (!analysis) return null;

  const impression = IMPRESSION_CONFIG[analysis.overall_visual_impression] || IMPRESSION_CONFIG.healthy;
  const action     = ACTION_CONFIG[analysis.recommended_action]             || ACTION_CONFIG.none;
  const hasContext = analysis.context_matched_findings?.length > 0;

  return (
    <div className="card" style={{ marginBottom: '18px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div className="sec-label" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          Photo analysis
        </div>
        <span className={`badge ${impression.badge}`}>{impression.label}</span>
      </div>

      {analysis.error ? (
        <div style={{ fontSize: '13px', color: 'var(--muted)', padding: '12px', background: 'var(--bg)', borderRadius: '8px', marginBottom: '12px' }}>
          {analysis.summary}
        </div>
      ) : (
        <>
          {/* Summary */}
          <div style={{ fontSize: '14px', color: 'var(--navy)', lineHeight: 1.7, marginBottom: '16px' }}>
            {analysis.summary}
          </div>

          {/* Context-matched findings — most valuable section */}
          {hasContext && (
            <div style={{ background: 'var(--teal-l)', border: '1.5px solid var(--teal-m)', borderRadius: '10px', padding: '12px 14px', marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--teal-d)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Relevant to your health profile
              </div>
              <BulletList items={analysis.context_matched_findings} color="var(--teal-d)" />
            </div>
          )}

          {/* Areas of concern */}
          {analysis.areas_of_concern?.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--warn)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '6px' }}>
                Areas to watch
              </div>
              <BulletList items={analysis.areas_of_concern} color="var(--warn)" />
            </div>
          )}

          {/* Positive signs */}
          {analysis.positive_signs?.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ok)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '6px' }}>
                Positive signs
              </div>
              <BulletList items={analysis.positive_signs} color="var(--ok)" />
            </div>
          )}

          {/* Recommended action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'var(--bg)', borderRadius: '8px', marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>Recommended:</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: action.color }}>{action.label}</div>
          </div>

          {/* Poor photo quality warning */}
          {analysis.photo_quality === 'poor' && analysis.photo_quality_note && (
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px', fontStyle: 'italic' }}>
              Note: {analysis.photo_quality_note}
            </div>
          )}
        </>
      )}

      {/* Disclaimer */}
      <div style={{ fontSize: '11px', color: 'var(--muted)', background: 'var(--bg)', borderRadius: '6px', padding: '8px 10px', lineHeight: 1.5, borderLeft: '3px solid var(--border)' }}>
        ⚠️ {analysis.disclaimer}
      </div>
    </div>
  );
}

export default function CheckinResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const result   = location.state?.result;

  if (!result) return (
    <div style={{ textAlign: 'center', padding: '80px' }}>
      <div style={{ marginBottom: '16px', color: 'var(--muted)' }}>No check-in result found.</div>
      <button className="btn btn-teal" onClick={() => navigate('/checkin')}>Start check-in →</button>
    </div>
  );

  const riskColor = RISK_COLORS[result.risk_severity] || 'var(--teal)';
  const showAlert = result.risk_severity === 'medium' || result.risk_severity === 'high';
  const today     = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div>
      {/* Hero */}
      <div className="result-hero">
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.4)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Check-in complete
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--teal)' }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,.5)', marginTop: '6px' }}>{today}</div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '8px', padding: '10px 18px', fontSize: '12px', color: 'rgba(255,255,255,.7)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Risk: <span style={{ fontWeight: 700, color: riskColor, textTransform: 'capitalize' }}>{result.risk_severity}</span>
          </div>
          {result.streak > 0 && (
            <div style={{ background: 'rgba(42,191,191,.15)', border: '1px solid rgba(42,191,191,.3)', borderRadius: '8px', padding: '10px 18px', fontSize: '12px', color: 'var(--teal-m)', fontWeight: 600 }}>
              {result.streak}-day streak
            </div>
          )}
        </div>
      </div>

      <div className="container-md">
        {/* Agent results */}
        <div className="card" style={{ marginBottom: '18px' }}>
          <div className="sec-label">Agent results</div>
          <div className="agent-row">
            <div className="agent-dot" style={{ background: 'var(--teal)' }} />
            <div>
              <div className="agent-name">Habit Agent</div>
              <div className="agent-result">
                Habit score: {result.habit_score}/10
                {result.streak > 0 && ` · ${result.streak}-day streak`}
              </div>
            </div>
          </div>
          <div className="agent-row">
            <div className="agent-dot" style={{ background: riskColor }} />
            <div>
              <div className="agent-name">Risk Agent</div>
              <div className="agent-result">{result.risk_explanation}</div>
            </div>
          </div>
          <div className="agent-row" style={{ borderBottom: 'none' }}>
            <div className="agent-dot" style={{ background: 'var(--teal-d)' }} />
            <div>
              <div className="agent-name">Coach Agent</div>
              <div className="agent-result">{result.coach_tip}</div>
            </div>
          </div>
        </div>

        {/* Photo analysis card */}
        <PhotoAnalysisCard analysis={result.photo_analysis} />

        {/* Risk alert */}
        {showAlert && (
          <div className="card-warn" style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#7A4A00', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <WarnIcon size={14} color="#7A4A00" /> Risk alert: {result.risk_severity} severity
            </div>
            <div style={{ fontSize: '13px', color: '#9A6200', lineHeight: 1.5, marginBottom: '8px' }}>{result.risk_explanation}</div>
            {result.risk_flags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                {result.risk_flags.map((f, i) => <span key={i} className="badge badge-warn">{f}</span>)}
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button className="btn btn-teal btn-lg" onClick={() => navigate('/dashboard')}>Go to dashboard →</button>
          <button className="btn btn-outline" onClick={() => navigate('/trends')}>View trends</button>
        </div>
      </div>
    </div>
  );
}