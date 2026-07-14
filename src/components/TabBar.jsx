import React from "react";
import { Home, ClipboardList, BarChart3, User } from "lucide-react";

function TabButton({ icon: Icon, label, active, onClick }) {
  return (
    <button className={`tab-btn ${active ? "active" : ""}`} onClick={onClick}>
      <Icon size={23} strokeWidth={active ? 2.4 : 2} />
      <span>{label}</span>
    </button>
  );
}

export default function TabBar({ tab, setTab }) {
  return (
    <div className="tabbar-wrap">
      <nav className="tabbar">
        <TabButton icon={Home} label="Hoy" active={tab === "today"} onClick={() => setTab("today")} />
        <TabButton icon={ClipboardList} label="Registro" active={tab === "log"} onClick={() => setTab("log")} />
        <TabButton icon={BarChart3} label="Progreso" active={tab === "stats"} onClick={() => setTab("stats")} />
        <TabButton icon={User} label="Perfil" active={tab === "profile"} onClick={() => setTab("profile")} />
      </nav>
    </div>
  );
}
