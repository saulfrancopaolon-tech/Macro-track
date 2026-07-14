import React, { useEffect, useState } from "react";
import { fmt } from "../utils/format";

export default function MacroBar({ label, color, value, goal, unit = "g" }) {
  const [w, setW] = useState(0);
  const pct = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;

  useEffect(() => {
    const t = setTimeout(() => setW(pct), 150);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="macro-row">
      <div className="macro-row-top">
        <div className="macro-row-label">
          <span className="dot" style={{ background: color }} />
          {label}
        </div>
        <div className="macro-row-value">
          <b>{fmt(value)}</b>
          <span className="secondary">/{fmt(goal)}{unit}</span>
        </div>
      </div>
      <div className="track">
        <div className="fill" style={{ width: `${w}%`, background: color, boxShadow: `0 0 10px ${color}66` }} />
      </div>
    </div>
  );
}
