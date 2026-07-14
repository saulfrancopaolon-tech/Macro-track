import React from "react";
import MealRow, { EmptyRow } from "../components/MealRow.jsx";
import { MEAL_TYPES } from "../data/defaults";
import { fmt } from "../utils/format";

export default function LogScreen({ todayEntries, activeNutrients, removingId, onDelete, onEdit }) {
  const calId = (activeNutrients.find((n) => n.core) || {}).id || "calories";

  return (
    <div className="screen screen-enter">
      <div className="screen-header">
        <h1 className="big-title">Registro</h1>
        <div className="secondary">Toca una comida para editarla</div>
      </div>
      {MEAL_TYPES.map((mt) => {
        const items = todayEntries.filter((e) => e.meal === mt.id);
        const subtotal = items.reduce((s, e) => s + (e.values[calId] || 0), 0);
        return (
          <div key={mt.id} className="meal-group">
            <div className="meal-group-header">
              <div className="meal-icon" style={{ background: `${mt.color}26`, color: mt.color }}>
                <mt.icon size={16} strokeWidth={2.3} />
              </div>
              <span>{mt.label}</span>
              <span className="secondary meal-group-total">{items.length ? `${fmt(subtotal)} kcal` : ""}</span>
            </div>
            <div className="card list-card">
              {items.length === 0 && <EmptyRow small />}
              {items.map((e) => (
                <MealRow
                  key={e.id}
                  entry={e}
                  removing={removingId === e.id}
                  activeNutrients={activeNutrients}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
