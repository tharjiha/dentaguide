import { useNavigate } from 'react-router-dom';
import { WarnIcon } from '../components/Icons';

const SugarIcon2 = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A6200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const BoltIcon2 = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A6200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const FlossIcon2 = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal-d)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

export default function AlertDetail() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="hero-dark" style={{ padding: '28px 32px' }}>
        <div className="hero-inner">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(233,155,42,.15)', border: '1px solid rgba(233,155,42,.3)',
            borderRadius: '6px', padding: '5px 12px',
            fontSize: '12px', color: 'var(--warn)', fontWeight: 600, marginBottom: '10px',
          }}>
            <WarnIcon size={12} color="var(--warn)" /> Medium severity
          </div>
          <div className="page-title">Early cavity risk</div>
          <div className="page-sub">Flagged by Risk Agent on March 14, 2025</div>
        </div>
      </div>

      <div className="container-md">
        <div className="card" style={{ marginBottom: '18px' }}>
          <div className="sec-label">Why this was flagged</div>
          <div style={{ fontSize: '14px', color: 'var(--navy)', lineHeight: 1.7 }}>
            The Risk Agent detected a <b>known early-cavity pattern</b>: sustained tooth sensitivity combined with elevated sugar intake over a 3-week window.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', background: 'var(--warn-bg)', borderRadius: '8px' }}>
              <SugarIcon2 />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#7A4A00' }}>High sugar on 6 of 14 days</div>
                <div style={{ fontSize: '12px', color: '#9A6200', marginTop: '2px' }}>Sugar accelerates enamel wear and creates conditions for bacterial growth.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', background: 'var(--warn-bg)', borderRadius: '8px' }}>
              <BoltIcon2 />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#7A4A00' }}>Sensitivity reported 5 of last 7 days</div>
                <div style={{ fontSize: '12px', color: '#9A6200', marginTop: '2px' }}>Sustained sensitivity can indicate early enamel erosion or exposed dentine.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', background: 'var(--teal-l)', borderRadius: '8px' }}>
              <FlossIcon2 />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--teal-d)' }}>Flossing only 4 of 7 days</div>
                <div style={{ fontSize: '12px', color: 'var(--slate)', marginTop: '2px' }}>Inconsistent flossing leaves interproximal areas uncleared.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '18px' }}>
          <div className="sec-label">Disclaimer</div>
          <div style={{ fontSize: '13px', color: 'var(--slate)', lineHeight: 1.6 }}>
            This is a <b>screening flag</b>, not a medical diagnosis. DentaGuide identifies patterns associated with risk — only a licensed dentist can diagnose dental conditions. If you're concerned, booking a check-up is always the right move.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-teal btn-lg" onClick={() => navigate('/dentist')}>Find a dentist →</button>
          <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>Back to dashboard</button>
        </div>
      </div>
    </div>
  );
}
