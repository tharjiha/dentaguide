import { useState } from 'react';

export default function HabitRow({ icon, name, sub, defaultOn = false, type = 'toggle', children }) {
  const [on, setOn] = useState(defaultOn);

  return (
    <div className="habit-row">
      <div className="habit-left">
        <span className="h-icon">{icon}</span>
        <div>
          <div className="h-name">{name}</div>
          <div className="h-sub">{sub}</div>
        </div>
      </div>
      {type === 'toggle' ? (
        <button
          className={`toggle ${on ? 'on' : ''}`}
          onClick={() => setOn(v => !v)}
          aria-label={on ? 'On' : 'Off'}
        />
      ) : children}
    </div>
  );
}
