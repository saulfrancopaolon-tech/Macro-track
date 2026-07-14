import React from "react";
import { Trash2, ChevronRight } from "lucide-react";
import { fmt } from "../utils/format";
import { MEAL_TYPES } from "../data/defaults";

export function EmptyRow({ small }) {
  return <div className={`empty-row ${small ? "small" : ""}`}>Sin registros todavía</div>;
}

export default function MealRow({ entry, removing, activeNutrients, onDelete, onEdit }) {
  const mt = MEAL_TYPES.find((m) => m.id === entry.meal) || MEAL_TYPES[0];
  const secondaryNutrients = activeNutrients.filter((n) => !n.core).slice(0, 3);
  const summary = secondaryNutrients
    .map((n) => `${n.label.slice(0, 1)}${fmt(entry.values[n.id] || 0)}`)
    .join(" · ");
  const calNutrient = activeNutrients.find((n) => n.core);

  return (
    <div className={`meal-row ${removing ? "removing" : ""}`} onClick={() => onEdit(entry)}>
      <div className="meal-icon" style={{ background: `${mt.color}26`, color: mt.color }}>
        <mt.icon size={16} strokeWidth={2.3} />
      </div>
      <div className="meal-row-mid">
        <div className="meal-row-name">{entry.name}</div>
        <div className="secondary">{entry.time}{summary ? ` · ${summary}` : ""}</div>
      </div>
      <div className="meal-row-cal">{fmt(entry.values[calNutrient?.id ?? "calories"] || 0)}</div>
      <ChevronRight size={16} className="chevron" />
      <button
        className="delete-btn"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(entry.id);
        }}
        aria-label="Eliminar"
      >
        <Trash2 size={15} strokeWidth={2.2} />
      </button>
    </div>
  );
}
