import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhotoCompare from '../components/PhotoCompare';
import { InfoIcon, CameraIcon } from '../components/Icons';

const API_URL = import.meta.env.VITE_API_URL;

export default function Photos() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try{
        const token = localStorage.getItem('dg_token');
        const res = await fetch(`${API_URL}/api/checkin/history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load photos');
        const data = await res.json();
        const withPhotos = data.filter(c => c.photo_url);
        setHistory(withPhotos);
      } catch (e) {
        setError('Could not load photo history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const pairs = [];
  for (let i = 0; i < history.length - 1; i++) {
    pairs.push({ newer: history[i], older: history[i + 1] });
  }

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
  };

  return (
    <div>
      <div className="hero-dark" style={{ padding: '28px 32px' }}>
        <div className="hero-inner">
          <div className="page-title">Photo history</div>
          <div className="page-sub">Week-over-week visual tracking · Powered by Gemini AI</div>
        </div>
      </div>

      <div className="container">
        <div className="card-ok" style={{ marginBottom: '22px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <InfoIcon size={18} color="#0F5A3A" />
          <div style={{ fontSize: '13px', color: '#0F5A3A', lineHeight: 1.5 }}>
            <b>About photo analysis:</b> Gemini AI compares photos week-over-week and flags visible changes. This is a visual screening tool — not a medical diagnosis.
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>Loading photo history...</div>
        )}

        {error && (
          <div style={{ fontSize: '13px', color: 'var(--danger)', background: 'var(--danger-bg)', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {pairs.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--muted)', fontSize: '14px' }}>
                No photo comparisons yet — you need at least 2 check-ins with photos.
              </div>
            )}

            {pairs.map((pair, i) => (
              <div key={i} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy)' }}>
                    {formatDate(pair.older.created_at)} vs {formatDate(pair.newer.created_at)}
                  </div>
                  <div className={`badge badge-${pair.newer.risk_severity === 'none' ? 'ok' : 'warn'}`}>
                    {pair.newer.risk_severity === 'none' ? 'No change' : 'Change detected'}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ background: 'var(--bg)', borderRadius: '9px', overflow: 'hidden', aspectRatio: '1' }}>
                    {pair.older.photo_url ? (
                      <img src={pair.older.photo_url} alt="Previous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'var(--muted)' }}>
                        {formatDate(pair.older.created_at)}
                      </div>
                    )}
                  </div>
                  <div style={{ background: 'var(--bg)', borderRadius: '9px', overflow: 'hidden', aspectRatio: '1' }}>
                    {pair.newer.photo_url ? (
                      <img src={pair.newer.photo_url} alt="Latest" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'var(--muted)' }}>
                        {formatDate(pair.newer.created_at)}
                      </div>
                    )}
                  </div>
                </div>

                {pair.newer.risk_explanation && (
                  <div style={{ fontSize: '12px', color: 'var(--slate)', background: 'var(--teal-l)', borderRadius: '8px', padding: '9px 11px', lineHeight: 1.5 }}>
                    <b>Gemini AI Vision:</b> {pair.newer.risk_explanation} <em style={{ color: 'var(--muted)' }}>(Not a diagnosis)</em>
                  </div>
                )}
              </div>
            ))}

            {}
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
        )}
      </div>
    </div>
  );
}