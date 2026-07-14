import React, { useEffect, useState } from "react";
import { Droplet, Undo2 } from "lucide-react";
import { fmt } from "../utils/format";
import { WATER_CUPS } from "../data/defaults";

export default function WaterCard({ totalMl, goalMl, hasEntriesToday, onAdd, onUndo }) {
  const [w, setW] = useState(0);
  const pct = goalMl > 0 ? Math.min((totalMl / goalMl) * 100, 100) : 0;

  useEffect(() => {
    const t = setTimeout(() => setW(pct), 150);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="card water-card">
      <div className="water-top">
        <div className="water-icon">
          <Droplet size={20} strokeWidth={2.2} />
        </div>
        <div className="water-info">
          <div className="water-value">
            {fmt(totalMl)} <span className="secondary">/ {fmt(goalMl)} ml</span>
          </div>
          <div className="secondary">agua de hoy</div>
        </div>
        {hasEntriesToday && (
          <button className="undo-btn" onClick={onUndo} aria-label="Deshacer último vaso">
            <Undo2 size={15} strokeWidth={2.2} />
          </button>
        )}
      </div>
      <div className="track water-track">
        <div className="fill" style={{ width: `${w}%`, background: "#64D2FF", boxShadow: "0 0 10px #64D2FF66" }} />
      </div>
      <div className="cup-row">
        {WATER_CUPS.map((c) => (
          <button key={c.label} className="cup-chip" onClick={() => onAdd(c.ml)}>
            + {c.label} · {c.ml}ml
          </button>
        ))}
      </div>
    </div>
  );
}
