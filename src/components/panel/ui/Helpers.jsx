export function fmtDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
  } catch (e) { return ""; }
}

export function relDays(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (diff <= 0) return "hoy";
  if (diff === 1) return "ayer";
  if (diff < 30) return "hace " + diff + " días";
  const m = Math.floor(diff / 30);
  return "hace " + m + (m === 1 ? " mes" : " meses");
}

export function resolveImg(v) {
  if (!v) return "";
  if (/^https?:|^assets\/|^data:|^blob:/.test(v)) return v;
  return "https://images.unsplash.com/photo-" + v + "?w=1100&q=80&auto=format&fit=crop";
}
