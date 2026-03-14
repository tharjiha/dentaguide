import { useNavigate } from 'react-router-dom';
import PhotoCompare from '../components/PhotoCompare';
import { InfoIcon, CameraIcon } from '../components/Icons';

export default function Photos() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="hero-dark" style={{ padding: '28px 32px' }}>
        <div className="hero-inner">
          <div className="page-title">Photo history</div>
          <div className="page-sub">Week-over-week visual tracking · Powered by Claude Vision</div>
        </div>
      </div>

      <div className="container">
        {/* Info banner */}
        <div className="card-ok" style={{ marginBottom: '22px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <InfoIcon size={18} color="#0F5A3A" />
          <div style={{ fontSize: '13px', color: '#0F5A3A', lineHeight: 1.5 }}>
            <b>About photo analysis:</b> Claude Vision compares photos week-over-week and flags visible changes. This is a visual screening tool — not a medical diagnosis. Findings supplement your habit and symptom data.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <PhotoCompare
            label1="Mar 7"
            label2="Mar 14"
            badge="Change detected"
            badgeType="warn"
            analysis="Slight gumline redness in latest photo. No new tooth discolouration. Continue monitoring."
          />
          <PhotoCompare
            label1="Feb 28"
            label2="Mar 7"
            badge="No change"
            badgeType="ok"
            analysis="No visible changes between these two photos. Gumline appearance consistent."
          />
          <PhotoCompare
            label1="Feb 21"
            label2="Feb 28"
            badge="No change"
            badgeType="ok"
            analysis="Consistent appearance. Slight plaque visible at lower gumline — consistent with prior weeks."
          />

          {/* Add new photo */}
          <div
            className="card"
            style={{
              border: '2px dashed var(--border)',
              background: 'var(--bg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '180px',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/checkin')}
          >
            <CameraIcon size={28} color="var(--muted)" />
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--slate)', marginTop: '8px' }}>Add this week's photo</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>Upload in today's check-in</div>
          </div>
        </div>
      </div>
    </div>
  );
}
