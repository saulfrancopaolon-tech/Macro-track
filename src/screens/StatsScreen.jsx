import React from "react";
import { Award, BarChart3, Droplet } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  CartesianGrid, ReferenceLine, Cell,
} from "recharts";
import MacroBar from "../components/MacroBar.jsx";
import { fmt } from "../utils/format";

export default function StatsScreen({ last7, activeNutrients, totals, weeklyWaterAvg, waterGoal }) {
  const calNutrient = activeNutrients.find((n) => n.core);
  const otherNutrients = activeNutrients.filter((n) => !n.core);
  const data = last7.map((d) => ({ name: d.label, kcal: d.calories, met: d.met }));

  return (
    <div className="screen screen-enter">
      <div className="screen-header">
        <h1 className="big-title">Progreso</h1>
      </div>

      {calNutrient && (
        <div className="card">
          <div className="section-title">Calorías · últimos 7 días</div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={data} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fill: "rgba(235,235,245,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(235,235,245,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                <ReferenceLine y={calNutrient.goal} stroke="#0A84FF" strokeDasharray="4 4" strokeOpacity={0.6} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{ background: "#1C1C1E", border: "none", borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="kcal" radius={[6, 6, 6, 6]}>
                  {data.map((d, i) => (
                    <Cell key={i} fill={d.met ? "#30D158" : "#3A3A3C"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="stat-grid">
        <div className="card stat-card">
          <Award size={18} color="#FFD60A" />
          <div className="stat-value">{last7.filter((d) => d.met).length}/7</div>
          <div className="secondary">días en meta</div>
        </div>
        <div className="card stat-card">
          <Droplet size={18} color="#64D2FF" />
          <div className="stat-value">{fmt(weeklyWaterAvg)}</div>
          <div className="secondary">ml agua/día prom.</div>
        </div>
      </div>

      {otherNutrients.length > 0 && (
        <div className="card">
          <div className="section-title">Macros de hoy</div>
          {otherNutrients.map((n) => (
            <MacroBar key={n.id} label={n.label} color={n.color} value={totals[n.id] || 0} goal={n.goal} unit={n.unit} />
          ))}
        </div>
      )}
    </div>
  );
}
