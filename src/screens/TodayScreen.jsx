import React from "react";
import { Flame, Check } from "lucide-react";
import CalorieRing from "../components/CalorieRing.jsx";
import MacroBar from "../components/MacroBar.jsx";
import WaterCard from "../components/WaterCard.jsx";
import MealRow, { EmptyRow } from "../components/MealRow.jsx";
import { fmt, prettyDate } from "../utils/format";

export default function TodayScreen({
  activeNutrients, totals, remaining, over, progress, streak, last7,
  todayEntries, removingId, onDelete, onEdit,
  waterTotal, waterGoal, hasWaterToday, onAddWater, onUndoWater,
}) {
  const calNutrient = activeNutrients.find((n) => n.core);
  const otherNutrients = activeNutrients.filter((n) => !n.core);
  const recent = [...todayEntries].slice(-3).reverse();

  return (
    <div className="screen screen-enter">
      <div className="screen-header">
        <div className="eyebrow">{prettyDate()}</div>
        <h1 className="big-title">Hoy</h1>
      </div>

      {/* Streak */}
      <div className="card streak-card">
        <div className={`flame-badge ${streak > 0 ? "lit" : ""}`}>
          <Flame size={26} strokeWidth={2.2} />
        </div>
        <div className="streak-info">
          <div className="streak-number">{streak} {streak === 1 ? "día" : "días"}</div>
          <div className="secondary">racha cumpliendo tu meta</div>
        </div>
        <div className="streak-dots">
          {last7.map((d, i) => (
            <div key={i} className={`streak-dot ${d.met ? "filled" : ""} ${d.isToday ? "today" : ""}`}>
              {d.met && <Check size={10} strokeWidth={3.5} />}
            </div>
          ))}
        </div>
      </div>

      {/* Calorie ring */}
      {calNutrient && (
        <div className="card ring-card">
          <div className="ring-container">
            <CalorieRing progress={progress} over={over} />
            <div className="ring-center">
              <div className="ring-number">{fmt(Math.abs(remaining))}</div>
              <div className="ring-label">{over ? `${calNutrient.unit} de más` : `${calNutrient.unit} restantes`}</div>
            </div>
          </div>
          <div className="ring-footer">
            <div className="ring-stat">
              <div className="secondary">Consumido</div>
              <b>{fmt(totals[calNutrient.id])} {calNutrient.unit}</b>
            </div>
            <div className="ring-divider" />
            <div className="ring-stat">
              <div className="secondary">Meta</div>
              <b>{fmt(calNutrient.goal)} {calNutrient.unit}</b>
            </div>
          </div>
        </div>
      )}

      {/* Water */}
      <WaterCard
        totalMl={waterTotal}
        goalMl={waterGoal}
        hasEntriesToday={hasWaterToday}
        onAdd={onAddWater}
        onUndo={onUndoWater}
      />

      {/* Macros */}
      {otherNutrients.length > 0 && (
        <div className="card">
          <div className="section-title">Macronutrientes</div>
          {otherNutrients.map((n) => (
            <MacroBar key={n.id} label={n.label} color={n.color} value={totals[n.id] || 0} goal={n.goal} unit={n.unit} />
          ))}
        </div>
      )}

      {/* Recent */}
      <div className="section-title list-title">Últimas comidas</div>
      <div className="card list-card">
        {recent.length === 0 && <EmptyRow />}
        {recent.map((e) => (
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
}
