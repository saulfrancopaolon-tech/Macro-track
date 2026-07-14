import React, { useMemo, useRef, useState } from "react";
import { Check, Plus } from "lucide-react";

import TabBar from "./components/TabBar.jsx";
import AddFoodSheet from "./components/AddFoodSheet.jsx";
import TodayScreen from "./screens/TodayScreen.jsx";
import LogScreen from "./screens/LogScreen.jsx";
import StatsScreen from "./screens/StatsScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";

import { useLocalStorage } from "./utils/storage";
import { todayKey, addDays, weekdayLabel } from "./utils/format";
import { DEFAULT_NUTRIENTS, DEFAULT_WATER_GOAL } from "./data/defaults";
import { seedEntries, seedWater } from "./data/seed";

export default function App() {
  const [tab, setTab] = useState("today");
  const [nutrients, setNutrients] = useLocalStorage("mt_nutrients_v1", DEFAULT_NUTRIENTS);
  const [entries, setEntries] = useLocalStorage("mt_entries_v1", seedEntries);
  const [water, setWater] = useLocalStorage("mt_water_v1", seedWater);
  const [waterGoal, setWaterGoal] = useLocalStorage("mt_water_goal_v1", DEFAULT_WATER_GOAL);

  const [removingId, setRemovingId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const activeNutrients = useMemo(() => nutrients.filter((n) => n.active), [nutrients]);
  const calNutrient = activeNutrients.find((n) => n.core);
  const today = todayKey();
  const todayEntries = useMemo(() => entries.filter((e) => e.date === today), [entries, today]);

  const totals = useMemo(() => {
    const t = {};
    activeNutrients.forEach((n) => (t[n.id] = 0));
    todayEntries.forEach((e) => {
      activeNutrients.forEach((n) => {
        t[n.id] = (t[n.id] || 0) + (e.values[n.id] || 0);
      });
    });
    return t;
  }, [todayEntries, activeNutrients]);

  const remaining = calNutrient ? calNutrient.goal - (totals[calNutrient.id] || 0) : 0;
  const over = remaining < 0;
  const progress = calNutrient && calNutrient.goal > 0 ? (totals[calNutrient.id] || 0) / calNutrient.goal : 0;

  const last7 = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = addDays(today, -i);
      const dayEntries = entries.filter((e) => e.date === date);
      const cal = calNutrient ? dayEntries.reduce((s, e) => s + (e.values[calNutrient.id] || 0), 0) : 0;
      const met = calNutrient ? cal >= calNutrient.goal * 0.85 && cal <= calNutrient.goal * 1.1 : false;
      days.push({ label: weekdayLabel(date), date, calories: Math.round(cal), met, isToday: i === 0 });
    }
    return days;
  }, [entries, today, calNutrient]);

  const streak = useMemo(() => {
    let count = 0;
    for (let i = last7.length - 1; i >= 0; i--) {
      if (last7[i].met) count++;
      else break;
    }
    return count;
  }, [last7]);

  const waterTotal = useMemo(
    () => water.filter((w) => w.date === today).reduce((s, w) => s + w.ml, 0),
    [water, today]
  );
  const hasWaterToday = water.some((w) => w.date === today);

  const weeklyWaterAvg = useMemo(() => {
    const byDay = {};
    last7.forEach((d) => (byDay[d.date] = 0));
    water.forEach((w) => {
      if (byDay[w.date] !== undefined) byDay[w.date] += w.ml;
    });
    const values = Object.values(byDay);
    return values.reduce((a, b) => a + b, 0) / values.length;
  }, [water, last7]);

  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }

  function openAddSheet() {
    setEditingEntry(null);
    setSheetOpen(true);
  }
  function openEditSheet(entry) {
    setEditingEntry(entry);
    setSheetOpen(true);
  }
  function closeSheet() {
    setSheetOpen(false);
    setEditingEntry(null);
  }

  function handleSaveEntry(data) {
    if (data.id) {
      setEntries((prev) => prev.map((e) => (e.id === data.id ? { ...e, meal: data.meal, name: data.name, values: data.values } : e)));
      showToast(`Actualizado · ${data.name}`);
    } else {
      const entry = {
        id: Date.now(),
        date: today,
        time: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
        meal: data.meal,
        name: data.name,
        values: data.values,
      };
      setEntries((prev) => [...prev, entry]);
      showToast(`Agregado · ${data.name}`);
    }
    closeSheet();
  }

  function handleDeleteEntry(id) {
    setRemovingId(id);
    setTimeout(() => {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      setRemovingId(null);
    }, 240);
  }

  function handleAddWater(ml) {
    setWater((prev) => [...prev, { id: Date.now(), date: today, ml }]);
    showToast(`+${ml}ml de agua`);
  }
  function handleUndoWater() {
    setWater((prev) => {
      const idxs = prev.map((w, i) => (w.date === today ? i : -1)).filter((i) => i !== -1);
      if (idxs.length === 0) return prev;
      const lastIdx = idxs[idxs.length - 1];
      return prev.filter((_, i) => i !== lastIdx);
    });
  }

  function handleStepGoal(id, delta) {
    setNutrients((prev) => prev.map((n) => (n.id === id ? { ...n, goal: Math.max(0, n.goal + delta) } : n)));
  }
  function handleToggleNutrient(id) {
    setNutrients((prev) => prev.map((n) => (n.id === id ? { ...n, active: !n.active } : n)));
  }
  function handleDeleteNutrient(id) {
    setNutrients((prev) => prev.filter((n) => n.id !== id));
  }
  function handleAddNutrient(newNutrient) {
    setNutrients((prev) => [...prev, newNutrient]);
    showToast(`Nutriente "${newNutrient.label}" agregado`);
  }
  function handleStepWaterGoal(delta) {
    setWaterGoal((g) => Math.max(0, g + delta));
  }

  function handleReset() {
    setNutrients(DEFAULT_NUTRIENTS);
    setEntries(seedEntries());
    setWater(seedWater());
    setWaterGoal(DEFAULT_WATER_GOAL);
    showToast("Datos de ejemplo restaurados");
  }
  function handleClearAll() {
    setEntries([]);
    setWater([]);
    showToast("Todos los registros fueron borrados");
  }

  return (
    <div className="app-root">
      <div className="app-shell">
        {tab === "today" && (
          <TodayScreen
            activeNutrients={activeNutrients}
            totals={totals}
            remaining={remaining}
            over={over}
            progress={progress}
            streak={streak}
            last7={last7}
            todayEntries={todayEntries}
            removingId={removingId}
            onDelete={handleDeleteEntry}
            onSaveEntry={handleSaveEntry}
            onEdit={openEditSheet}
            waterTotal={waterTotal}
            waterGoal={waterGoal}
            hasWaterToday={hasWaterToday}
            onAddWater={handleAddWater}
            onUndoWater={handleUndoWater}
          />
        )}
        {tab === "log" && (
          <LogScreen
            todayEntries={todayEntries}
            activeNutrients={activeNutrients}
            removingId={removingId}
            onDelete={handleDeleteEntry}
            onEdit={openEditSheet}
          />
        )}
        {tab === "stats" && (
          <StatsScreen
            last7={last7}
            activeNutrients={activeNutrients}
            totals={totals}
            weeklyWaterAvg={weeklyWaterAvg}
            waterGoal={waterGoal}
          />
        )}
        {tab === "profile" && (
          <ProfileScreen
            nutrients={nutrients}
            onStepGoal={handleStepGoal}
            onToggleNutrient={handleToggleNutrient}
            onDeleteNutrient={handleDeleteNutrient}
            onAddNutrient={handleAddNutrient}
            waterGoal={waterGoal}
            onStepWaterGoal={handleStepWaterGoal}
            entries={entries}
            last7={last7}
            streak={streak}
            onReset={handleReset}
            onClearAll={handleClearAll}
          />
        )}

        <div className={`toast-wrap ${toast ? "show" : ""}`}>
          <div className="toast">
            <Check size={16} strokeWidth={3} />
            <span>{toast}</span>
          </div>
        </div>

        {(tab === "today" || tab === "log") && (
          <div className="fab-wrap">
            <button className="fab" onClick={openAddSheet} aria-label="Agregar comida">
              <Plus size={26} strokeWidth={2.5} />
            </button>
          </div>
        )}

        <TabBar tab={tab} setTab={setTab} />

        <AddFoodSheet
          open={sheetOpen}
          editingEntry={editingEntry}
          activeNutrients={activeNutrients}
          onClose={closeSheet}
          onSave={handleSaveEntry}
          onDelete={handleDeleteEntry}
        />
      </div>
    </div>
  );
}
