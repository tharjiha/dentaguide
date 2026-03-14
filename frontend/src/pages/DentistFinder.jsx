import { ToothIcon, WarnIcon } from '../components/Icons';

const DENTISTS = [
  { name: 'Downtown Dental Group', address: '123 King St W, Toronto · 0.4 km away', hours: 'Mon–Fri 8am–6pm · (416) 555-0192' },
  { name: 'Smile Studio Toronto', address: '55 Wellington St E · 0.8 km away', hours: 'Mon–Sat 9am–7pm · (416) 555-0348' },
  { name: 'Bay Street Family Dentistry', address: '200 Bay St · 1.1 km away', hours: 'Mon–Fri 7:30am–5pm · (416) 555-0571' },
];

export default function DentistFinder() {
  return (
    <div>
      <div className="hero-dark" style={{ padding: '28px 32px' }}>
        <div className="hero-inner">
          <div className="page-title">Find a dentist</div>
          <div className="page-sub">Covered providers near you · Toronto, ON</div>
        </div>
      </div>

      <div className="container-md">
        {/* Risk banner */}
        <div className="card-warn" style={{ marginBottom: '22px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <WarnIcon size={18} color="#9A6200" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#7A4A00', marginBottom: '3px' }}>Risk Agent recommended a check-up</div>
            <div style={{ fontSize: '13px', color: '#9A6200', lineHeight: 1.5 }}>
              Early cavity risk pattern detected. Booking a cleaning and exam is the recommended next step.
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="form-group" style={{ marginBottom: '18px' }}>
          <label className="form-label">Search by postal code or neighbourhood</label>
          <input className="form-input" placeholder="e.g. M5V or King West" defaultValue="M5V" />
        </div>

        {/* Dentist cards */}
        {DENTISTS.map(d => (
          <div className="dentist-card" key={d.name}>
            <div className="dentist-logo">
              <ToothIcon size={20} color="var(--teal-d)" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="dentist-name">{d.name}</div>
              <div className="dentist-meta">{d.address}</div>
              <div className="dentist-meta">{d.hours}</div>
              <div className="dentist-badge">✓ Direct Billing</div>
            </div>
            <button className="btn btn-teal btn-sm">Book →</button>
          </div>
        ))}
      </div>
    </div>
  );
}
