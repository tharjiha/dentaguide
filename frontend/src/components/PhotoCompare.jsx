import { ImageIcon, CameraIcon } from './Icons';

export default function PhotoCompare({ label1, label2, analysis, badge, badgeType = 'warn' }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy)' }}>{label1} vs {label2}</div>
        <span className={`badge badge-${badgeType}`}>{badge}</span>
      </div>
      <div className="photo-row">
        <div className="photo-thumb">
          <ImageIcon size={26} color="var(--muted)" />
          <small>{label1}</small>
        </div>
        <div className="photo-thumb">
          <CameraIcon size={26} color="var(--muted)" />
          <small>{label2}</small>
        </div>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--slate)', background: 'var(--teal-l)', borderRadius: '8px', padding: '9px 11px', lineHeight: 1.5, marginTop: '10px' }}>
        <b>Claude Vision:</b> {analysis}
      </div>
    </div>
  );
}
