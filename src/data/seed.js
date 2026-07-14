import { todayKey, addDays } from "../utils/format";

const TEMPLATE = [
  { meal: "desayuno", name: "Huevos revueltos", time: "08:15", values: { calories: 220, protein: 14, carbs: 2, fat: 16, sodium: 190 } },
  { meal: "comida", name: "Pollo con arroz", time: "13:40", values: { calories: 520, protein: 42, carbs: 55, fat: 12, sodium: 410 } },
  { meal: "cena", name: "Salmón con verduras", time: "20:10", values: { calories: 480, protein: 38, carbs: 20, fat: 24, sodium: 320 } },
  { meal: "snack", name: "Yogur griego", time: "17:00", values: { calories: 150, protein: 15, carbs: 9, fat: 5, sodium: 65 } },
];

// Slight variation per day so the weekly chart / streak look realistic.
const MULTIPLIERS = { 0: 0.62, "-1": 0.95, "-2": 1.08, "-3": 0.8, "-4": 1.02, "-5": 0.9, "-6": 1.0 };

export function seedEntries() {
  const entries = [];
  let id = 1;
  [0, -1, -2, -3, -4, -5, -6].forEach((offset) => {
    const date = addDays(todayKey(), offset);
    const mult = MULTIPLIERS[offset] ?? 1;
    // "today" only has breakfast + lunch logged so far, like a real partial day.
    const items = offset === 0 ? TEMPLATE.slice(0, 2) : TEMPLATE;
    items.forEach((t) => {
      const values = {};
      Object.entries(t.values).forEach(([k, v]) => {
        values[k] = Math.max(0, Math.round(v * mult));
      });
      entries.push({ id: id++, date, meal: t.meal, name: t.name, time: t.time, values });
    });
  });
  return entries;
}

export function seedWater() {
  const water = [];
  let id = 1;
  [0, -1, -2, -3].forEach((offset) => {
    const date = addDays(todayKey(), offset);
    const cups = offset === 0 ? 3 : 5 + (Math.abs(offset) % 2);
    for (let i = 0; i < cups; i++) water.push({ id: id++, date, ml: 250 });
  });
  return water;
}
