import { useLocation, useNavigate } from 'react-router-dom';
import { WarnIcon } from '../components/Icons';

const IMPRESSION_CONFIG = {
  healthy:              { label: 'Looks healthy',        badge: 'badge-ok' },
  mild_concerns:        { label: 'Mild concerns noted',  badge: 'badge-warn' },
  notable_concerns:     { label: 'Notable concerns',     badge: 'badge-warn' },
  significant_concerns: { label: 'Significant concerns', badge: 'badge-alert' },
};

const ACTION_CONFIG = {
  none:                { label: 'No action needed',        color: 'var(--ok)' },
  monitor:             { label: 'Monitor over time',       color: 'var(--teal-d)' },
  mention_to_dentist:  { label: 'Mention to your dentist', color: 'var(--warn)' },
  see_dentist_soon:    { label: 'See a dentist soon',      color: 'var(--danger)' },
};

const RISK_COLORS = {
  none: 'var(--teal)', low: 'var(--teal)', medium: 'var(--warn)', high: 'var(--danger)',
};

const RISK_LABELS = {
  none: 'No risk', low: 'Low risk', medium: 'Medium risk', high: 'High risk',
};


function Dot({ color, size = 6, top = 6 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, marginTop: top, flexShrink: 0,
    }} />
  );
}

function SectionLabel({ children, color }) {
  return (
    <div style={{
      fontSize: '10px', fontWeight: 700, color,
      textTransform: 'uppercase', letterSpacing: '.7px', marginBottom: '8px',
    }}>
      {children}
    </div>
  );
}

function BulletList({ items, color, size = 13 }) {
  if (!items?.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start' }}>
          <Dot color={color} size={5} top={7} />
          <div style={{ fontSize: size, color: 'var(--slate)', lineHeight: 1.55 }}>{item}</div>
        </div>
      ))}
    </div>
  );
}

function splitIntoBullets(text) {
  if (!text) return [];
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
  return sentences.length <= 1 ? [text] : sentences;
}


function PhotoAnalysisCard({ analysis }) {
  if (!analysis) return null;
  const impression = IMPRESSION_CONFIG[analysis.overall_visual_impression] || IMPRESSION_CONFIG.healthy;
  const action     = ACTION_CONFIG[analysis.recommended_action] || ACTION_CONFIG.none;

  return (
    <div className="card" style={{ marginBottom: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
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
        <div style={{ fontSize: '13px', color: 'var(--muted)', padding: '12px 14px', background: 'var(--bg)', borderRadius: '8px', marginBottom: '12px' }}>
          {analysis.summary}
        </div>
      ) : (
        <>
          <div style={{ fontSize: '13.5px', color: 'var(--navy)', lineHeight: 1.65, marginBottom: '14px', padding: '12px 14px', background: 'var(--bg)', borderRadius: '8px' }}>
            {analysis.summary}
          </div>

          {analysis.context_matched_findings?.length > 0 && (
            <div style={{ background: 'var(--teal-l)', border: '1.5px solid var(--teal-m)', borderRadius: '8px', padding: '11px 13px', marginBottom: '12px' }}>
              <SectionLabel color="var(--teal-d)">Relevant to your profile</SectionLabel>
              <BulletList items={analysis.context_matched_findings} color="var(--teal-d)" />
            </div>
          )}

          {analysis.areas_of_concern?.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <SectionLabel color="var(--warn)">Areas to watch</SectionLabel>
              <BulletList items={analysis.areas_of_concern} color="var(--warn)" />
            </div>
          )}

          {analysis.positive_signs?.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <SectionLabel color="var(--ok)">Positive signs</SectionLabel>
              <BulletList items={analysis.positive_signs} color="var(--ok)" />
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', background: 'var(--bg)', borderRadius: '8px', marginBottom: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>Recommended:</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: action.color }}>{action.label}</div>
          </div>

          {analysis.photo_quality === 'poor' && analysis.photo_quality_note && (
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px', fontStyle: 'italic' }}>
              Note: {analysis.photo_quality_note}
            </div>
          )}
        </>
      )}

      <div style={{ fontSize: '11px', color: 'var(--muted)', background: 'var(--bg)', borderRadius: '6px', padding: '8px 11px', lineHeight: 1.55, borderLeft: '3px solid var(--border)' }}>
        ⚠️ {analysis.disclaimer}
      </div>
    </div>
  );
}

function RiskCard({ result }) {
  if (!result.risk_severity || !['medium', 'high'].includes(result.risk_severity)) return null;
  const isHigh = result.risk_severity === 'high';

  return (
    <div className="card-warn" style={{ marginBottom: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <WarnIcon size={15} color="#7A4A00" />
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#7A4A00' }}>
          What to do next
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {}
        <div style={{ background: 'rgba(232,155,42,.13)', borderRadius: '8px', padding: '10px 13px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#7A4A00', marginBottom: '4px' }}>
           {isHigh ? 'See a dentist soon' : 'Consider a dental check-up'}
          </div>
          <div style={{ fontSize: '12px', color: '#9A6200', lineHeight: 1.6 }}>
            {isHigh
              ? 'The risk pattern detected today warrants a professional look. A dentist can assess what was flagged and advise on next steps.'
              : 'A routine visit would help confirm whether this pattern needs attention. Catching issues early prevents bigger problems later.'}
          </div>
        </div>

        {}
        <div style={{ background: 'var(--teal-l)', border: '1px solid var(--teal-m)', borderRadius: '8px', padding: '10px 13px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--teal-d)', marginBottom: '4px' }}>
            No dental coverage? You may qualify for the CDCP
          </div>
          <div style={{ fontSize: '12px', color: 'var(--slate)', lineHeight: 1.6 }}>
            The <strong>Canadian Dental Care Plan</strong> is a federal program for eligible Canadians without insurance — administered by Sun Life.{' '}
            <a
              href="https://www.canada.ca/en/services/benefits/dental/dental-care-plan.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--teal-d)', fontWeight: 600 }}
            >
              Check your eligibility at canada.ca →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskAgentSummary({ severity, explanation, flags, riskColor }) {
  const photoFlags   = flags.filter(f => /^photo:/i.test(f)).map(f => f.replace(/^photo:\s*/i, ''));
  const contextFlags = flags.filter(f => /^context:/i.test(f)).map(f => f.replace(/^context:\s*/i, ''));
  const otherFlags   = flags.filter(f => !/^(photo:|context:)/i.test(f));

  const hasDetail = photoFlags.length > 0 || contextFlags.length > 0 || otherFlags.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {}
      {severity !== 'high' && (
        <div style={{ fontSize: '13px', color: 'var(--slate)', lineHeight: 1.55 }}>
          {explanation}
        </div>
      )}

      {}
      {hasDetail && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

          {otherFlags.length > 0 && (
            <div>
              <SectionLabel color={riskColor}>Indicators</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {otherFlags.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <Dot color={riskColor} size={5} top={7} />
                    <div style={{ fontSize: '12.5px', color: 'var(--slate)', lineHeight: 1.5 }}>{f}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {photoFlags.length > 0 && (
            <div>
              <SectionLabel color="var(--warn)">Photo findings</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {photoFlags.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <Dot color="var(--warn)" size={5} top={7} />
                    <div style={{ fontSize: '12.5px', color: 'var(--slate)', lineHeight: 1.5 }}>{f}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {contextFlags.length > 0 && (
            <div>
              <SectionLabel color="var(--teal-d)">In context of your profile</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {contextFlags.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <Dot color="var(--teal-d)" size={5} top={7} />
                    <div style={{ fontSize: '12.5px', color: 'var(--slate)', lineHeight: 1.5 }}>{f}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


function AgentRow({ dotColor, name, children, noBorder }) {
  return (
    <div style={{ padding: '13px 0', borderBottom: noBorder ? 'none' : '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
        <div className="agent-name">{name}</div>
      </div>
      <div style={{ paddingLeft: '16px' }}>
        {children}
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

  const riskColor    = RISK_COLORS[result.risk_severity] || 'var(--teal)';
  const today        = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const coachBullets = splitIntoBullets(result.coach_tip);

  return (
    <div>
      {}
      <div className="result-hero">
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.4)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Check-in complete
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--teal)' }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,.5)', marginTop: '6px' }}>{today}</div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '14px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', color: 'rgba(255,255,255,.7)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            Risk: <span style={{ fontWeight: 700, color: riskColor, textTransform: 'capitalize', marginLeft: '2px' }}>{result.risk_severity || 'none'}</span>
          </div>
          {result.streak > 0 && (
            <div style={{ background: 'rgba(42,191,191,.15)', border: '1px solid rgba(42,191,191,.3)', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', color: 'var(--teal-m)', fontWeight: 600 }}>
              {result.streak}-day streak 
            </div>
          )}
        </div>
      </div>

      <div className="container-md">

        {}
        <div className="card" style={{ marginBottom: '18px' }}>
          <div className="sec-label">Agent results</div>

          <AgentRow dotColor="var(--teal)" name="Habit Agent">
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: 'var(--slate)' }}>
                Score: <strong style={{ color: 'var(--navy)' }}>{result.habit_score}/10</strong>
              </span>
              {result.streak > 0 && (
                <span style={{ fontSize: '13px', color: 'var(--slate)' }}>
                  Streak: <strong style={{ color: 'var(--navy)' }}>{result.streak} days</strong>
                </span>
              )}
            </div>
          </AgentRow>

          <AgentRow dotColor={riskColor} name="Risk Agent">
            <RiskAgentSummary
              severity={result.risk_severity}
              explanation={result.risk_explanation}
              flags={result.risk_flags || []}
              riskColor={riskColor}
            />
          </AgentRow>

          <AgentRow dotColor="var(--teal-d)" name="Coach Agent" noBorder>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {coachBullets.map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start' }}>
                  <Dot color="var(--teal-d)" size={5} top={7} />
                  <div style={{ fontSize: '13px', color: 'var(--slate)', lineHeight: 1.55 }}>{line}</div>
                </div>
              ))}
            </div>
          </AgentRow>
        </div>

        {}
        <PhotoAnalysisCard analysis={result.photo_analysis} />

        {}
        <RiskCard result={result} />

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', paddingBottom: '32px' }}>
          <button className="btn btn-teal btn-lg" onClick={() => navigate('/dashboard')}>Go to dashboard →</button>
          <button className="btn btn-outline" onClick={() => navigate('/trends')}>View trends</button>
        </div>
      </div>
    </div>
  );
}