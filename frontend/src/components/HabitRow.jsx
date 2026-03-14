import { useState } from 'react';

export default function HabitRow({ icon, name, sub, defaultOn = false, type = 'toggle', onChange, children }) {
  const [on, setOn] = useState(defaultOn);

  const handleToggle = () => {
    const next = !on;
    setOn(next);
    if (onChange) onChange(next);
  };

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
          onClick={handleToggle}
          aria-label={on ? 'On' : 'Off'}
        />
      ) : children}
    </div>
  );
}