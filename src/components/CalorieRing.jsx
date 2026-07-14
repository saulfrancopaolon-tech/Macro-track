import React, { useEffect, useState } from "react";

export default function CalorieRing({ progress, over, size = 216, stroke = 16 }) {
  const [animated, setAnimated] = useState(0);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(Math.min(progress, 1)), 120);
    return () => clearTimeout(t);
  }, [progress]);

  const offset = c * (1 - animated);
  const color = over ? "#FF453A" : "#0A84FF";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="ring-svg">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-elevated-2)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="ring-progress"
      />
    </svg>
  );
}
