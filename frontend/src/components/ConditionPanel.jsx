import { useNavigate } from 'react-router-dom';

const SEVERITY_MAP = {
  ok: 'badge-ok',
  warn: 'badge-warn',
  alert: 'badge-alert',
};

const MiniBars = ({ data }) => (
  <div className="mini-bars">
    {data.map((bar, i) => (
      <div key={i} className={`mbar mb-${bar.color}`} style={{ height: `${bar.h}%` }} />
    ))}
  </div>
);

export default function ConditionPanel({ icon, name, severity, severityLabel, sub, bars }) {
  const navigate = useNavigate();
  return (
    <div className="panel" onClick={() => navigate('/condition')} style={{ cursor: 'pointer' }}>
      <div className="panel-top">
        <div className="panel-name">{icon}{name}</div>
        <span className={`badge ${SEVERITY_MAP[severity]}`}>{severityLabel}</span>
      </div>
      <div className="panel-sub">{sub}</div>
      <MiniBars data={bars} />
    </div>
  );
}
