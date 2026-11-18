export function todayISO(now = new Date()) {
  return [now.getFullYear(), String(now.getMonth()+1).padStart(2,"0"), String(now.getDate()).padStart(2,"0")].join("-");
}
export function elapsedDays(start, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start || "")) return 0;
  const [year, month, day] = start.split("-").map(Number);
  return Math.max(0, Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(year, month-1, day)) / 86400000));
}

