import { useNavigate } from 'react-router-dom';
import { WarnIcon } from './Icons';

export default function RiskAlert({ title, description, showDentistLink = true }) {
  const navigate = useNavigate();
  return (
    <div className="card-warn" style={{ display: 'flex', gap: '13px', alignItems: 'flex-start', marginBottom: '16px' }}>
      <WarnIcon size={20} color="#E89B2A" />
      <div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#7A4A00', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '13px', color: '#9A6200', lineHeight: 1.5 }}>{description}</div>
        {showDentistLink && (
          <button
            className="btn btn-sm"
            style={{ marginTop: '10px', background: 'var(--warn)', color: '#fff' }}
            onClick={() => navigate('/dentist')}
          >
            Find a dentist →
          </button>
        )}
      </div>
    </div>
  );
}
