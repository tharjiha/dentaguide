import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LogoSVG = () => (
  <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
    <rect width="32" height="32" rx="7" fill="#E6F7F7"/>
    <path d="M16 5C11.8 5 9 8.2 9 12c0 2.2.9 4 1.4 5.8.5 1.8.4 5.6 1.8 7.4.9 1.4 1.8 1.9 2.7.5.5-.9.9-3.8 1.1-3.8.2 0 .6 2.9 1.1 3.8.9 1.4 1.8.9 2.7-.5 1.4-1.8 1.3-5.6 1.8-7.4.5-1.8 1.4-3.6 1.4-5.8 0-3.8-2.8-7-7-7z" fill="#2ABFBF" fillOpacity=".2" stroke="#2ABFBF" strokeWidth="1.2"/>
    <circle cx="23" cy="9" r="3.5" fill="#E6F7F7" stroke="#2ABFBF" strokeWidth="1.2"/>
    <circle cx="23" cy="9" r="1.5" fill="none" stroke="#2ABFBF" strokeWidth=".8"/>
    <line x1="25.5" y1="11.5" x2="27.5" y2="13.5" stroke="#2ABFBF" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const appNavLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/checkin',   label: 'Check-in' },
  { to: '/trends',    label: 'Trends' },
  { to: '/photos',    label: 'Photos' },
  { to: '/settings',  label: 'Account' },
];

export default function Navbar() {
  const { isLoggedIn, user, logOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  // Get initials for avatar
  const initial = user?.first_name?.[0]?.toUpperCase()
    || user?.name?.[0]?.toUpperCase()
    || user?.email?.[0]?.toUpperCase()
    || 'U';

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.email || '';

  return (
    <nav style={{
      background: 'var(--white)',
      borderBottom: '1px solid var(--border)',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '56px',
      position: 'sticky',
      top: 0,
      zIndex: 200,
    }}>
      <Link to={isLoggedIn ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}>
        <LogoSVG />
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1 }}>
            <span style={{ color: 'var(--navy)' }}>Denta</span>
            <span style={{ color: 'var(--teal)' }}>Guide</span>
          </div>
          <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--muted)', letterSpacing: '1.2px', textTransform: 'uppercase', marginTop: '2px' }}>
            Smart care for your smile
          </div>
        </div>
      </Link>

      {isLoggedIn ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {appNavLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              fontSize: '13px',
              fontWeight: location.pathname.startsWith(link.to) ? 600 : 500,
              color: location.pathname.startsWith(link.to) ? 'var(--teal-d)' : 'var(--slate)',
              padding: '6px 14px',
              borderRadius: '6px',
              background: location.pathname.startsWith(link.to) ? 'var(--teal-l)' : 'transparent',
              textDecoration: 'none',
              transition: 'all .15s',
            }}>
              {link.label}
            </Link>
          ))}

          {/* Avatar with dropdown on click */}
          <div style={{ position: 'relative', marginLeft: '4px' }}>
            <div
              title={displayName}
              onClick={() => navigate('/settings')}
              style={{
                width: '32px', height: '32px',
                background: 'var(--teal)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 600, color: '#fff',
                cursor: 'pointer',
              }}
            >
              {initial}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Link to="/login" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--slate)', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none' }}>
            Sign in
          </Link>
          <Link to="/signup" className="btn btn-teal">Get started free</Link>
        </div>
      )}
    </nav>
  );
}