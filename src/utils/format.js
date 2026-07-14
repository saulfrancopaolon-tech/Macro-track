export function fmt(n) {
  const v = Number(n) || 0;
  return Math.round(v).toLocaleString("es-MX");
}

export function nowTime() {
  return new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
}

// Returns a local YYYY-MM-DD key (not UTC) so "today" matches the user's day.
export function todayKey(d = new Date()) {
  const dt = new Date(d);
  const off = dt.getTimezoneOffset();
  const local = new Date(dt.getTime() - off * 60000);
  return local.toISOString().slice(0, 10);
}

export function addDays(dateKey, delta) {
  const d = new Date(dateKey + "T00:00:00");
  d.setDate(d.getDate() + delta);
  return todayKey(d);
}

const WEEKDAY_LABELS = ["D", "L", "M", "X", "J", "V", "S"];

export function weekdayLabel(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  return WEEKDAY_LABELS[d.getDay()];
}

export function prettyDate(d = new Date()) {
  return d.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });
}
