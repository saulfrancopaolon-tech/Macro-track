import React from "react";
import { Flame, Check, CheckCircle2, Circle } from "lucide-react";
import CalorieRing from "../components/CalorieRing.jsx";
import MacroBar from "../components/MacroBar.jsx";
import WaterCard from "../components/WaterCard.jsx";
import { fmt, prettyDate } from "../utils/format";

// Tu dieta de hipertrofia estructurada como checklist diario
const HYPERTROPHY_PLAN = [
  { meal: "desayuno", name: "3 Huevos + 4 Tortillas", time: "8:00 AM - 9:00 AM", values: { calories: 429, protein: 24, carbs: 45, fat: 17, sodium: 1500 } },
  { meal: "comida", name: "200g Res + Papa, Zanahoria, Pepino", time: "1:30 PM", values: { calories: 596, protein: 46, carbs: 58, fat: 20, sodium: 3000 } },
  { meal: "snack", name: "Galletas Quinoa + Plátano", time: "2:45 PM", values: { calories: 257, protein: 5, carbs: 57, fat: 1, sodium: 0 } },
  { meal: "intra", name: "Agua + Sal (Intra-Entreno)", time: "3:00 PM - 4:00 PM", values: { calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 1500 } },
  { meal: "cena", name: "Cereal Post-Gym + Whey", time: "5:30 PM - 6:30 PM", values: { calories: 501, protein: 34, carbs: 81, fat: 4.5, sodium: 1000 } },
  { meal: "cena", name: "Licuado Nocturno", time: "9:00 PM", values: { calories: 560, protein: 25, carbs: 80, fat: 15.5, sodium: 0 } },
];

export default function TodayScreen({
  activeNutrients, totals, remaining, over, progress, streak, last7,
  todayEntries, removingId, onDelete, onSaveEntry, // <--- Prop nueva necesaria para el checklist
  waterTotal, waterGoal, hasWaterToday, onAddWater, onUndoWater,
}) {
  const calNutrient = activeNutrients.find((n) => n.core);
  const otherNutrients = activeNutrients.filter((n) => !n.core);

  // Revisa si una comida ya fue palomeada hoy comparando su nombre
  const isMealLogged = (mealName) => todayEntries.some((e) => e.name === mealName);

  // Función para marcar o desmarcar comidas con un toque
  const handleToggleMeal = (planMeal) => {
    const existingEntry = todayEntries.find((e) => e.name === planMeal.name);
    if (existingEntry) {
      onDelete(existingEntry.id); // Si ya estaba, la quita
    } else {
      if (onSaveEntry) onSaveEntry(planMeal); // Si no estaba, la agrega
    }
  };

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

      {/* Checklist de Hipertrofia */}
      <div className="section-title list-title" style={{ marginTop: '24px' }}>Checklist Diario</div>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px' }}>
        {HYPERTROPHY_PLAN.map((planMeal, idx) => {
          const logged = isMealLogged(planMeal.name);
          const isRemoving = todayEntries.find((e) => e.name === planMeal.name)?.id === removingId;
          
          return (
            <div
              key={idx}
              onClick={() => handleToggleMeal(planMeal)}
              style={{
                display: 'flex', alignItems: 'center', padding: '14px',
                borderRadius: '12px', backgroundColor: logged ? 'rgba(48, 209, 88, 0.1)' : '#1C1C1E',
                border: `1.5px solid ${logged ? '#30D158' : '#2C2C2E'}`,
                opacity: isRemoving ? 0.5 : 1, transition: 'all 0.2s ease', cursor: 'pointer'
              }}
            >
              <div style={{ marginRight: '16px', color: logged ? '#30D158' : '#8E8E93', display: 'flex' }}>
                {logged ? <CheckCircle2 size={26} strokeWidth={2.5} /> : <Circle size={26} strokeWidth={2} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: logged ? '#FFF' : '#EBEBF5', textDecoration: logged ? 'line-through' : 'none' }}>
                  {planMeal.name}
                </div>
                <div style={{ fontSize: '13px', color: logged ? '#30D158' : '#8E8E93', marginTop: '4px', fontWeight: '500' }}>
                  {planMeal.time} · {planMeal.values.protein}g P | {planMeal.values.carbs}g C | {planMeal.values.fat}g G
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
