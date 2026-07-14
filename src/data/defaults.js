import { Coffee, Sun, Moon, Utensils, Zap } from "lucide-react";

export const MEAL_TYPES = [
  { id: "desayuno", label: "Desayuno", icon: Coffee, color: "#FF9F0A" },
  { id: "comida", label: "Comida", icon: Sun, color: "#30D158" },
  { id: "snack", label: "Snack/Pre", icon: Utensils, color: "#FF375F" },
  { id: "intra", label: "Intra-Entreno", icon: Zap, color: "#64D2FF" },
  { id: "cena", label: "Cena/Post", icon: Moon, color: "#0A84FF" },
];

// `core` = the primary nutrient shown as the big ring (cannot be deleted/hidden).
// `step` = amount the +/- goal steppers move.
export const DEFAULT_NUTRIENTS = [
  { id: "calories", label: "Calorías", unit: "kcal", color: "#0A84FF", goal: 2460, core: true, active: true, step: 50 },
  { id: "protein", label: "Proteína", unit: "g", color: "#30D158", goal: 134, core: false, active: true, step: 5 },
  { id: "carbs", label: "Carbohidratos", unit: "g", color: "#FF9F0A", goal: 351, core: false, active: true, step: 5 },
  { id: "fat", label: "Grasa", unit: "g", color: "#FF375F", goal: 58, core: false, active: true, step: 5 },
  { id: "sodium", label: "Sodio (sal)", unit: "mg", color: "#64D2FF", goal: 5000, core: false, active: true, step: 100 },
];

export const PRESETS = [
  { name: "3 Huevos + 4 Tortillas", emoji: "🍳", values: { calories: 429, protein: 24, carbs: 45, fat: 17, sodium: 1500 } },
  { name: "200g Res + Papa, Zanahoria, Pepino", emoji: "🥩", values: { calories: 596, protein: 46, carbs: 58, fat: 20, sodium: 3000 } },
  { name: "Galletas Quinoa + Plátano", emoji: "🍌", values: { calories: 257, protein: 5, carbs: 57, fat: 1, sodium: 0 } },
  { name: "500ml Gatorade", emoji: "⚡", values: { calories: 120, protein: 0, carbs: 30, fat: 0, sodium: 500 } },
  { name: "Cereal Post-Gym + Whey", emoji: "🥣", values: { calories: 501, protein: 34, carbs: 81, fat: 4.5, sodium: 1000 } },
  { name: "Licuado Nocturno Avena", emoji: "🥤", values: { calories: 560, protein: 25, carbs: 80, fat: 15.5, sodium: 0 } },
];

export const COLOR_SWATCHES = [
  "#0A84FF", "#30D158", "#FF9F0A", "#FF375F",
  "#64D2FF", "#BF5AF2", "#FFD60A", "#FF6961",
];

export const WATER_CUPS = [
  { label: "Vaso", ml: 250 },
  { label: "Bote Gym", ml: 500 },
  { label: "Grande", ml: 750 },
];

export const DEFAULT_WATER_GOAL = 3000; // ml diarios
