// ============================================================
// NÓMADE — Autenticación del panel interno (ESM).
// ------------------------------------------------------------
// ⚠️ IMPORTANTE — SEGURIDAD
// Esto es una validación EN EL NAVEGADOR (sin servidor). La
// contraseña vive en este archivo: NO es seguridad real, solo
// una puerta / ocultamiento del backoffice. Para producción, la
// autenticación DEBE validarse en un servidor.
//
// 👉 Para cambiar el usuario y la contraseña, editá USER y PASS.
// ============================================================
const NOMADE_PANEL = {
  USER: "admin",
  PASS: "nomade2026",
  KEY: "nomade_panel_session"
};

export function panelIsAuthed() {
  try { return sessionStorage.getItem(NOMADE_PANEL.KEY) === "ok"; }
  catch (e) { return false; }
}

export function panelLogin(user, pass) {
  const ok = user.trim() === NOMADE_PANEL.USER && pass === NOMADE_PANEL.PASS;
  if (ok) { try { sessionStorage.setItem(NOMADE_PANEL.KEY, "ok"); } catch (e) {} }
  return ok;
}

export function clearPanelSession() {
  try { sessionStorage.removeItem(NOMADE_PANEL.KEY); } catch (e) {}
}
