import React, { useMemo, useState } from "react";
import { Flame, Plus, Minus, X, Droplet, RotateCcw, Trash2 } from "lucide-react";
import { fmt, todayKey, addDays } from "../utils/format";
import { COLOR_SWATCHES } from "../data/defaults";

function GoalRow({ nutrient, onMinus, onPlus, onToggle, onDelete }) {
  return (
    <div className="goal-row">
      <div className="meal-icon" style={{ background: `${nutrient.color}26`, color: nutrient.color }}>
        <span className="dot" style={{ background: nutrient.color }} />
      </div>
      <div className="meal-row-mid">
        <div className="meal-row-name">{nutrient.label}</div>
        <div className="secondary">{nutrient.unit}{nutrient.core ? " · principal" : ""}</div>
      </div>
      <div className="stepper">
        <button onClick={onMinus} aria-label={`Disminuir ${nutrient.label}`}><Minus size={14} strokeWidth={2.6} /></button>
        <span>{fmt(nutrient.goal)}</span>
        <button onClick={onPlus} aria-label={`Aumentar ${nutrient.label}`}><Plus size={14} strokeWidth={2.6} /></button>
      </div>
      {!nutrient.core && (
        <button className="toggle-switch-btn" onClick={onToggle} aria-label="Activar o desactivar">
          <span className={`toggle-track ${nutrient.active ? "on" : ""}`}>
            <span className="toggle-knob" />
          </span>
        </button>
      )}
      {!nutrient.core && (
        <button className="delete-btn" onClick={onDelete} aria-label={`Eliminar ${nutrient.label}`}>
          <X size={15} strokeWidth={2.4} />
        </button>
      )}
    </div>
  );
}

function AddNutrientForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("g");
  const [goal, setGoal] = useState("");
  const [color, setColor] = useState(COLOR_SWATCHES[0]);

  function submit() {
    if (!name.trim()) return;
    onAdd({
      id: `custom_${Date.now()}`,
      label: name.trim(),
      unit: unit.trim() || "g",
      color,
      goal: Number(goal) || 0,
      core: false,
      active: true,
      step: unit === "mg" || unit === "kcal" ? 50 : 5,
    });
    setName(""); setUnit("g"); setGoal(""); setColor(COLOR_SWATCHES[0]); setOpen(false);
  }

  if (!open) {
    return (
      <button className="add-nutrient-btn" onClick={() => setOpen(true)}>
        <Plus size={16} strokeWidth={2.4} /> Agregar nutriente
      </button>
    );
  }

  return (
    <div className="new-nutrient-form">
      <label className="field-label">Nombre</label>
      <input className="input" placeholder="Ej. Fibra" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="input-row-2">
        <div>
          <label className="field-label">Unidad</label>
          <input className="input" placeholder="g" value={unit} onChange={(e) => setUnit(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Meta diaria</label>
          <input className="input" type="number" inputMode="numeric" placeholder="0" value={goal} onChange={(e) => setGoal(e.target.value)} />
        </div>
      </div>
      <label className="field-label">Color</label>
      <div className="swatch-row">
        {COLOR_SWATCHES.map((c) => (
          <button
            key={c}
            className={`swatch ${color === c ? "selected" : ""}`}
            style={{ background: c }}
            onClick={() => setColor(c)}
            aria-label={`Elegir color ${c}`}
          />
        ))}
      </div>
      <div className="new-nutrient-actions">
        <button className="text-btn" onClick={() => setOpen(false)}>Cancelar</button>
        <button className="primary-btn small" onClick={submit}>Guardar nutriente</button>
      </div>
    </div>
  );
}

export default function ProfileScreen({
  nutrients, onStepGoal, onToggleNutrient, onDeleteNutrient, onAddNutrient,
  waterGoal, onStepWaterGoal, entries, last7, streak, onReset, onClearAll,
}) {
  const days = 28;
  const grid = useMemo(() => {
    const arr = [];
    const calNutrient = nutrients.find((n) => n.core);
    for (let i = days - 1; i >= 0; i--) {
      const date = addDays(todayKey(), -i);
      const dayEntries = entries.filter((e) => e.date === date);
      const hasData = dayEntries.length > 0;
      const total = dayEntries.reduce((s, e) => s + (e.values[calNutrient?.id ?? "calories"] || 0), 0);
      const met = hasData && calNutrient && total >= calNutrient.goal * 0.85 && total <= calNutrient.goal * 1.1;
      arr.push({ date, hasData, met });
    }
    return arr;
  }, [entries, nutrients]);

  return (
    <div className="screen screen-enter">
      <div className="screen-header">
        <h1 className="big-title">Perfil</h1>
      </div>

      <div className="card streak-card">
        <div className={`flame-badge ${streak > 0 ? "lit" : ""}`}>
          <Flame size={26} strokeWidth={2.2} />
        </div>
        <div className="streak-info">
          <div className="streak-number">{streak} {streak === 1 ? "día" : "días"}</div>
          <div className="secondary">tu constancia actual</div>
        </div>
      </div>

      <div className="card">
        <div className="section-title">Últimas 4 semanas</div>
        <div className="heatmap">
          {grid.map((d, i) => (
            <div key={i} className={`heat-cell ${!d.hasData ? "" : d.met ? "on" : "miss"}`} title={d.date} />
          ))}
        </div>
        <div className="heatmap-legend">
          <span><i className="legend-dot none" /> sin datos</span>
          <span><i className="legend-dot miss" /> fuera de meta</span>
          <span><i className="legend-dot on" /> en meta</span>
        </div>
      </div>

      <div className="section-title list-title">Agua</div>
      <div className="card list-card">
        <div className="goal-row no-border">
          <div className="meal-icon" style={{ background: "#64D2FF26", color: "#64D2FF" }}>
            <Droplet size={16} strokeWidth={2.3} />
          </div>
          <div className="meal-row-mid">
            <div className="meal-row-name">Meta diaria</div>
            <div className="secondary">ml</div>
          </div>
          <div className="stepper">
            <button onClick={() => onStepWaterGoal(-250)} aria-label="Disminuir meta de agua"><Minus size={14} strokeWidth={2.6} /></button>
            <span>{fmt(waterGoal)}</span>
            <button onClick={() => onStepWaterGoal(250)} aria-label="Aumentar meta de agua"><Plus size={14} strokeWidth={2.6} /></button>
          </div>
        </div>
      </div>

      <div className="section-title list-title">Nutrientes que sigues</div>
      <div className="card list-card">
        {nutrients.map((n) => (
          <GoalRow
            key={n.id}
            nutrient={n}
            onMinus={() => onStepGoal(n.id, -n.step)}
            onPlus={() => onStepGoal(n.id, n.step)}
            onToggle={() => onToggleNutrient(n.id)}
            onDelete={() => onDeleteNutrient(n.id)}
          />
        ))}
      </div>
      <AddNutrientForm onAdd={onAddNutrient} />

      <div className="danger-zone">
        <button className="ghost-btn" onClick={onReset}>
          <RotateCcw size={15} strokeWidth={2.2} /> Restaurar datos de ejemplo
        </button>
        <button className="ghost-btn danger" onClick={onClearAll}>
          <Trash2 size={15} strokeWidth={2.2} /> Borrar todos mis datos
        </button>
      </div>

      <div className="footnote">
        Tus comidas, metas y racha se guardan en este dispositivo (localStorage), no en un servidor.
      </div>
    </div>
  );
}
