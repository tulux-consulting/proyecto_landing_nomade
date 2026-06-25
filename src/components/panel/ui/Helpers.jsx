function getActiveLocale() {
  if (typeof window === 'undefined') return 'es';
  try {
    const stored = localStorage.getItem('nomade_locale');
    if (stored === 'es' || stored === 'en') return stored;
  } catch (e) {}
  return 'es';
}

export function fmtDate(iso) {
  try {
    const d = new Date(iso);
    const locale = getActiveLocale();
    return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-AR', { day: "2-digit", month: "short", year: "numeric" });
  } catch (e) { return ""; }
}

export function relDays(iso, locale) {
  const activeLocale = locale || getActiveLocale();
  const diff = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (activeLocale === 'en') {
    if (diff <= 0) return "today";
    if (diff === 1) return "yesterday";
    if (diff < 30) return diff + " days ago";
    const m = Math.floor(diff / 30);
    return m + (m === 1 ? " month ago" : " months ago");
  } else {
    if (diff <= 0) return "hoy";
    if (diff === 1) return "ayer";
    if (diff < 30) return "hace " + diff + " días";
    const m = Math.floor(diff / 30);
    return "hace " + m + (m === 1 ? " mes" : " meses");
  }
}

export function resolveImg(v) {
  if (!v) return "";
  if (/^https?:|^\/?assets\/|^data:|^blob:/.test(v)) return v;
  return "https://images.unsplash.com/photo-" + v + "?w=1100&q=80&auto=format&fit=crop";
}
