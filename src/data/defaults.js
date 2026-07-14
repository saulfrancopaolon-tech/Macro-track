import { Coffee, Sun, Moon, Utensils } from "lucide-react";

export const MEAL_TYPES = [
  { id: "desayuno", label: "Desayuno", icon: Coffee, color: "#FF9F0A" },
  { id: "comida", label: "Comida", icon: Sun, color: "#30D158" },
  { id: "cena", label: "Cena", icon: Moon, color: "#0A84FF" },
  { id: "snack", label: "Snack", icon: Utensils, color: "#FF375F" },
];

// `core` = the primary nutrient shown as the big ring (cannot be deleted/hidden).
// `step` = amount the +/- goal steppers move.
export const DEFAULT_NUTRIENTS = [
  { id: "calories", label: "Calorías", unit: "kcal", color: "#0A84FF", goal: 2200, core: true, active: true, step: 50 },
  { id: "protein", label: "Proteína", unit: "g", color: "#30D158", goal: 150, core: false, active: true, step: 5 },
  { id: "carbs", label: "Carbohidratos", unit: "g", color: "#FF9F0A", goal: 220, core: false, active: true, step: 5 },
  { id: "fat", label: "Grasa", unit: "g", color: "#FF375F", goal: 70, core: false, active: true, step: 5 },
  { id: "sodium", label: "Sodio (sal)", unit: "mg", color: "#64D2FF", goal: 2300, core: false, active: true, step: 50 },
];

export const PRESETS = [
  { name: "Huevos revueltos", emoji: "🍳", values: { calories: 220, protein: 14, carbs: 2, fat: 16, sodium: 190 } },
  { name: "Pollo con arroz", emoji: "🍗", values: { calories: 520, protein: 42, carbs: 55, fat: 12, sodium: 410 } },
  { name: "Ensalada César", emoji: "🥗", values: { calories: 310, protein: 18, carbs: 12, fat: 20, sodium: 560 } },
  { name: "Plátano", emoji: "🍌", values: { calories: 105, protein: 1, carbs: 27, fat: 0, sodium: 1 } },
  { name: "Yogur griego", emoji: "🥣", values: { calories: 150, protein: 15, carbs: 9, fat: 5, sodium: 65 } },
  { name: "Batido de proteína", emoji: "🥤", values: { calories: 180, protein: 30, carbs: 8, fat: 3, sodium: 120 } },
];

export const COLOR_SWATCHES = [
  "#0A84FF", "#30D158", "#FF9F0A", "#FF375F",
  "#64D2FF", "#BF5AF2", "#FFD60A", "#FF6961",
];

export const WATER_CUPS = [
  { label: "Vaso", ml: 250 },
  { label: "Botella", ml: 500 },
  { label: "Grande", ml: 750 },
];

export const DEFAULT_WATER_GOAL = 2000; // ml
