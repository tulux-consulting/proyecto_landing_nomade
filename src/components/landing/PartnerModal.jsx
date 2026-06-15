import React, { useState, useEffect, useRef } from 'react';
import { NOMADE } from '../../data/content.js';
import { PartnersRepository } from '../../repositories/index';
// NÓMADE — Modal "Quiero ser Partner".
// Formulario funcional: validaciones, errores, estado de carga y
// confirmación. Al enviar, guarda el partner en el store del
// backoffice (BO → módulo Partners).

const PARTNER_TIPOS = [
  "Camping", "Glamping", "Operador turístico", "Viñedo / Bodega",
  "Hospitalidad rural", "Propiedad recreativa", "Otro"
];

// Inline SVGs (no lucide DOM-mutation inside this conditionally-rendered modal).
function Sv({ children, w }) {
  return <svg viewBox="0 0 24 24" width={w || 18} height={w || 18} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}
const SvX = () => <Sv><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Sv>;
const SvChevron = () => <Sv w={17}><path d="m6 9 6 6 6-6" /></Sv>;
const SvArrow = () => <Sv w={16}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></Sv>;
const SvCheck = () => <Sv w={30}><path d="M20 6 9 17l-5-5" /></Sv>;

function PMField({ id, label, error, full, children }) {
  return (
    <div className={"field" + (full ? " full" : "") + (error ? " has-error" : "")}>
      <label className="field-label" htmlFor={"pm-" + id}>{label}</label>
      {children}
      {error && <span className="field-error" role="alert">{error}</span>}
    </div>
  );
}

function PartnerModal({ open, onClose }) {
  const blank = { nombre: "", tipo: "", fiscal: "", provincia: "", localidad: "", telefono: "", email: "" };
  const [v, setV] = useState(blank);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const firstRef = useRef(null);
  const provincias = (NOMADE && NOMADE.form && NOMADE.form.provincias) || [];

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => { if (firstRef.current) firstRef.current.focus(); });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [open]);

  // reset shortly after closing so the success state isn't seen on reopen
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => { setV(blank); setErrors({}); setLoading(false); setDone(false); }, 300);
    return () => clearTimeout(t);
  }, [open]);

  if (!open) return null;

  const set = (k) => (e) => { setV((s) => ({ ...s, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: undefined })); };

  const validate = () => {
    const e = {};
    if (!v.nombre.trim()) e.nombre = "Ingresá el nombre del establecimiento.";
    if (!v.tipo) e.tipo = "Elegí un tipo.";
    if (!v.fiscal.trim()) e.fiscal = "Ingresá el número fiscal (CUIT).";
    else if (v.fiscal.replace(/[^\d]/g, "").length < 8) e.fiscal = "Revisá el número fiscal.";
    if (!v.provincia) e.provincia = "Elegí una provincia.";
    if (!v.localidad.trim()) e.localidad = "Ingresá la localidad.";
    if (!v.telefono.trim()) e.telefono = "Ingresá un teléfono.";
    else if (v.telefono.replace(/[^\d]/g, "").length < 6) e.telefono = "Revisá el número.";
    if (!v.email.trim()) e.email = "Ingresá un email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Revisá el formato del email.";
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      const first = Object.keys(e)[0];
      const el = document.getElementById("pm-" + first);
      if (el) el.focus();
      return;
    }
    setLoading(true);
    try {
      await PartnersRepository.create({
        nombre: v.nombre.trim(),
        tipo: v.tipo,
        fiscal: v.fiscal.trim(),
        provincia: v.provincia,
        localidad: v.localidad.trim(),
        telefono: v.telefono.trim(),
        email: v.email.trim(),
        estado: "Nuevo",
        archivado: false,
        descripcion: "",
        notas: [],
        origen: "Formulario web"
      });
      setDone(true);
    } catch (err) {
      console.error("Error submitting partner form:", err);
      setErrors({ submit: "Ocurrió un error al enviar. Intentá de nuevo." });
    } finally {
      setLoading(false);
    }
  };

  const F = PMField;

  return (
    <div className="pm-scrim" onClick={onClose} role="dialog" aria-modal="true" aria-label="Quiero ser Partner">
      <div className="pm-modal" onClick={(e) => e.stopPropagation()}>
        {done ? (
          <div className="pm-done">
            <span className="pm-done-mark"><SvCheck /></span>
            <h2>Gracias, recibimos tu interés.</h2>
            <p>Vamos a revisar la información de <strong>{v.nombre}</strong> y, si hay una buena sintonía, nuestro equipo te va a contactar para conversar sobre cómo sumar tu establecimiento a la red.</p>
            <button className="btn btn-primary" onClick={onClose} style={{ marginTop: 6 }}>Cerrar</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <div className="pm-head">
              <p className="pm-eyebrow">NÓMADE Partners</p>
              <h2>Quiero ser Partner</h2>
              <p>Contanos sobre tu establecimiento. Si compartimos la misma visión de hospitalidad, damos el siguiente paso juntos.</p>
              <button type="button" className="pm-close" onClick={onClose} aria-label="Cerrar"><SvX /></button>
            </div>

            <div className="pm-body">
              <div className="pm-grid">
                <F id="nombre" label="Nombre del establecimiento" error={errors.nombre} full>
                  <input ref={firstRef} id="pm-nombre" value={v.nombre} onChange={set("nombre")} placeholder="Ej.: Refugio del Lago" />
                </F>
                <F id="tipo" label="Tipo de establecimiento" error={errors.tipo}>
                  <div className="select-wrap">
                    <select id="pm-tipo" value={v.tipo} onChange={set("tipo")}>
                      <option value="" disabled>Elegí una opción</option>
                      {PARTNER_TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <SvChevron />
                  </div>
                </F>
                <F id="fiscal" label="Número fiscal (CUIT)" error={errors.fiscal}>
                  <input id="pm-fiscal" value={v.fiscal} onChange={set("fiscal")} placeholder="30-12345678-9" inputMode="numeric" />
                </F>
                <F id="provincia" label="Provincia" error={errors.provincia}>
                  <div className="select-wrap">
                    <select id="pm-provincia" value={v.provincia} onChange={set("provincia")}>
                      <option value="" disabled>Elegí una provincia</option>
                      {provincias.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <SvChevron />
                  </div>
                </F>
                <F id="localidad" label="Localidad" error={errors.localidad}>
                  <input id="pm-localidad" value={v.localidad} onChange={set("localidad")} placeholder="Ciudad o pueblo" />
                </F>
                <F id="telefono" label="Teléfono" error={errors.telefono}>
                  <input id="pm-telefono" type="tel" value={v.telefono} onChange={set("telefono")} placeholder="+54 9 ..." inputMode="tel" />
                </F>
                <F id="email" label="Email" error={errors.email} full>
                  <input id="pm-email" type="email" value={v.email} onChange={set("email")} placeholder="contacto@tuestablecimiento.com" inputMode="email" />
                </F>
              </div>
            </div>

            <div className="pm-foot">
              <p className="pm-legal">Sin compromiso. Es el primer contacto para explorar una alianza.</p>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <React.Fragment><span className="pm-spin" aria-hidden="true"></span>Enviando…</React.Fragment>
                  : <React.Fragment>Enviar postulación<SvArrow /></React.Fragment>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export { PartnerModal };
