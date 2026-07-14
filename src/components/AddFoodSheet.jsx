import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { MEAL_TYPES, PRESETS } from "../data/defaults";

function blankForm(activeNutrients) {
  const values = {};
  activeNutrients.forEach((n) => (values[n.id] = ""));
  return { meal: "desayuno", name: "", values };
}

export default function AddFoodSheet({ open, editingEntry, activeNutrients, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(() => blankForm(activeNutrients));

  useEffect(() => {
    if (!open) return;
    if (editingEntry) {
      const values = {};
      activeNutrients.forEach((n) => (values[n.id] = String(editingEntry.values[n.id] ?? "")));
      setForm({ meal: editingEntry.meal, name: editingEntry.name, values });
    } else {
      setForm(blankForm(activeNutrients));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editingEntry]);

  function applyPreset(p) {
    const values = {};
    activeNutrients.forEach((n) => {
      values[n.id] = p.values[n.id] !== undefined ? String(p.values[n.id]) : form.values[n.id] || "";
    });
    setForm((f) => ({ ...f, name: p.name, values }));
  }

  function setFieldValue(id, val) {
    setForm((f) => ({ ...f, values: { ...f.values, [id]: val } }));
  }

  const calNutrient = activeNutrients.find((n) => n.core);
  const otherNutrients = activeNutrients.filter((n) => !n.core);
  const valid = form.name.trim().length > 0 && Number(form.values[calNutrient?.id]) > 0;

  function submit() {
    if (!valid) return;
    const values = {};
    activeNutrients.forEach((n) => (values[n.id] = Number(form.values[n.id]) || 0));
    onSave({ id: editingEntry?.id, meal: form.meal, name: form.name.trim(), values });
  }

  return (
    <>
      <div className={`backdrop ${open ? "show" : ""}`} onClick={onClose} />
      <div className="sheet-wrap">
        <div className={`sheet ${open ? "open" : ""}`}>
          <div className="sheet-grabber" />
          <div className="sheet-header">
            <button className="text-btn" onClick={onClose}>Cancelar</button>
            <span className="sheet-title">{editingEntry ? "Editar comida" : "Nueva comida"}</span>
            <button className={`text-btn strong ${!valid ? "disabled" : ""}`} onClick={submit}>
              {editingEntry ? "Guardar" : "Agregar"}
            </button>
          </div>

          <div className="sheet-body">
            <div className="segmented">
              {MEAL_TYPES.map((mt) => (
                <button
                  key={mt.id}
                  className={`segment ${form.meal === mt.id ? "active" : ""}`}
                  onClick={() => setForm((f) => ({ ...f, meal: mt.id }))}
                >
                  {mt.label}
                </button>
              ))}
            </div>

            {!editingEntry && (
              <div className="presets-row">
                {PRESETS.map((p) => (
                  <button key={p.name} className="preset-chip" onClick={() => applyPreset(p)}>
                    <span className="preset-emoji">{p.emoji}</span>
                    {p.name}
                  </button>
                ))}
              </div>
            )}

            <label className="field-label">Nombre</label>
            <input
              className="input"
              placeholder="Ej. Pechuga a la plancha"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />

            {calNutrient && (
              <>
                <label className="field-label">{calNutrient.label} ({calNutrient.unit})</label>
                <input
                  className="input"
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={form.values[calNutrient.id]}
                  onChange={(e) => setFieldValue(calNutrient.id, e.target.value)}
                />
              </>
            )}

            {otherNutrients.length > 0 && (
              <div className="input-grid">
                {otherNutrients.map((n) => (
                  <div key={n.id}>
                    <label className="field-label">{n.label} ({n.unit})</label>
                    <input
                      className="input"
                      type="number"
                      inputMode="numeric"
                      placeholder="0"
                      value={form.values[n.id]}
                      onChange={(e) => setFieldValue(n.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}

            <button className={`primary-btn ${!valid ? "disabled" : ""}`} onClick={submit}>
              {editingEntry ? "Guardar cambios" : "Agregar comida"}
            </button>

            {editingEntry && (
              <button
                className="danger-btn"
                onClick={() => {
                  onDelete(editingEntry.id);
                  onClose();
                }}
              >
                <Trash2 size={16} strokeWidth={2.2} />
                Eliminar comida
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
