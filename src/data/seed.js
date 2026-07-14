import { todayKey, addDays } from "../utils/format";

// Tu dieta de hipertrofia como plantilla base (cantidades y macros exactos)
const TEMPLATE = [
  { meal: "desayuno", name: "3 Huevos + 4 Tortillas", time: "08:00", values: { calories: 429, protein: 24, carbs: 45, fat: 17, sodium: 1500 } },
  { meal: "comida", name: "200g Res + Papa, Zanahoria, Pepino", time: "13:30", values: { calories: 596, protein: 46, carbs: 58, fat: 20, sodium: 3000 } },
  { meal: "snack", name: "Galletas Quinoa + Plátano", time: "14:45", values: { calories: 257, protein: 5, carbs: 57, fat: 1, sodium: 0 } },
  { meal: "intra", name: "500ml Gatorade", time: "15:30", values: { calories: 120, protein: 0, carbs: 30, fat: 0, sodium: 500 } },
  { meal: "cena", name: "Cereal Post-Gym + Whey", time: "18:00", values: { calories: 501, protein: 34, carbs: 81, fat: 4.5, sodium: 1000 } },
  { meal: "cena", name: "Licuado Nocturno", time: "21:00", values: { calories: 560, protein: 25, carbs: 80, fat: 15.5, sodium: 0 } },
];

// Ligeras variaciones para que la gráfica de los últimos 7 días luzca natural
const MULTIPLIERS = { 0: 1.0, "-1": 0.95, "-2": 1.02, "-3": 0.98, "-4": 1.0, "-5": 0.9, "-6": 1.0 };

export function seedEntries() {
  const entries = [];
  let id = 1;
  
  [0, -1, -2, -3, -4, -5, -6].forEach((offset) => {
    const date = addDays(todayKey(), offset);
    const mult = MULTIPLIERS[offset] ?? 1;
    
    // Si es "hoy", cargamos solo hasta tu snack pre-entreno para que tú registres el resto.
    // Si son días anteriores, cargamos el menú completo.
    const items = offset === 0 ? TEMPLATE.slice(0, 3) : TEMPLATE;
    
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
  
  [0, -1, -2, -3, -4, -5, -6].forEach((offset) => {
    const date = addDays(todayKey(), offset);
    // Simulando que cumples tu meta de 3 Litros en los días pasados (aprox 12 vasos de 250ml)
    const cups = offset === 0 ? 4 : 10 + (Math.abs(offset) % 3); 
    
    for (let i = 0; i < cups; i++) {
      water.push({ id: id++, date, ml: 250 });
    }
  });
  
  return water;
}
