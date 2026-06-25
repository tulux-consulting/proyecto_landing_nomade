import React, { useState, useEffect, useRef } from 'react';
import { NOMADE } from '../../data/content.js';
import { PartnersRepository } from '../../repositories/index';
import { useI18n } from '../../lib/i18n/i18nContext.jsx';

// NÓMADE — Modal "Quiero ser Partner".
// Formulario funcional: validaciones, errores, estado de carga y
// confirmación. Al enviar, guarda el partner en el store del
// backoffice (BO → módulo Partners).

const PARTNER_MESSAGES = {
  es: {
    title: "Quiero ser Partner",
    eyebrow: "NÓMADE Partners",
    subtitle: "Contanos sobre tu establecimiento. Si compartimos la misma visión de hospitalidad, damos el siguiente paso juntos.",
    close: "Cerrar",
    optional: "Opcional",
    types: {
      "Camping": "Camping",
      "Glamping": "Glamping",
      "Operador turístico": "Operador turístico",
      "Viñedo / Bodega": "Viñedo / Bodega",
      "Hospitalidad rural": "Hospitalidad rural",
      "Propiedad recreativa": "Propiedad recreativa",
      "Estación de servicio": "Estación de servicio",
      "Otro": "Otro"
    },
    fields: {
      nombre: "Nombre del establecimiento",
      nombrePlaceholder: "Ej.: Refugio del Lago",
      razonSocial: "Razón social",
      razonSocialPlaceholder: "Nombre legal de la empresa o titular",
      tipo: "Tipo de establecimiento",
      tipoPlaceholder: "Elegí una opción",
      fiscal: "Número fiscal (CUIT)",
      provincia: "Provincia",
      provinciaPlaceholder: "Elegí una provincia",
      localidad: "Localidad",
      localidadPlaceholder: "Ciudad o pueblo",
      telefono: "Teléfono",
      email: "Email"
    },
    validation: {
      nombre: "Ingresá el nombre del establecimiento.",
      tipo: "Elegí un tipo.",
      fiscal: "Ingresá el número fiscal (CUIT).",
      fiscalInvalid: "Revisá el número fiscal.",
      provincia: "Elegí una provincia.",
      localidad: "Ingresá la localidad.",
      telefono: "Ingresá un teléfono.",
      telefonoInvalid: "Revisá el número.",
      email: "Ingresá un email.",
      emailInvalid: "Revisá el formato del email.",
      submitError: "Ocurrió un error al enviar. Intentá de nuevo."
    },
    success: {
      thanks: "Gracias, recibimos tu interés.",
      desc: "Vamos a revisar la información de <strong>{nombre}</strong> y, si hay una buena sintonía, nuestro equipo te va a contactar para conversar sobre cómo sumar tu establecimiento a la red."
    },
    foot: {
      legal: "Sin compromiso. Es el primer contacto para explorar una alianza.",
      submit: "Enviar postulación",
      submitting: "Enviando…"
    }
  },
  en: {
    title: "Join as a Partner",
    eyebrow: "NÓMADE Partners",
    subtitle: "Tell us about your establishment. If we share the same vision of hospitality, we take the next step together.",
    close: "Close",
    optional: "Optional",
    types: {
      "Camping": "Camping",
      "Glamping": "Glamping",
      "Operador turístico": "Tour Operator",
      "Viñedo / Bodega": "Vineyard / Winery",
      "Hospitalidad rural": "Rural Hospitality",
      "Propiedad recreativa": "Recreational Property",
      "Estación de servicio": "Service Station",
      "Otro": "Other"
    },
    fields: {
      nombre: "Establishment name",
      nombrePlaceholder: "E.g.: Refugio del Lago",
      razonSocial: "Corporate name",
      razonSocialPlaceholder: "Legal name of the company or owner",
      tipo: "Type of establishment",
      tipoPlaceholder: "Choose an option",
      fiscal: "Tax ID (CUIT/EIN)",
      provincia: "Province / State",
      provinciaPlaceholder: "Choose a province",
      localidad: "City / Locality",
      localidadPlaceholder: "City or town",
      telefono: "Phone number",
      email: "Email"
    },
    validation: {
      nombre: "Please enter the establishment name.",
      tipo: "Please choose a type.",
      fiscal: "Please enter the tax ID.",
      fiscalInvalid: "Please check the tax ID.",
      provincia: "Please choose a province.",
      localidad: "Please enter the locality.",
      telefono: "Please enter a phone number.",
      telefonoInvalid: "Please check the phone number.",
      email: "Please enter an email.",
      emailInvalid: "Please check the email format.",
      submitError: "An error occurred while sending. Please try again."
    },
    success: {
      thanks: "Thank you, we received your interest.",
      desc: "We will review <strong>{nombre}</strong>'s information and, if there is a good fit, our team will contact you to discuss how to add your establishment to the network."
    },
    foot: {
      legal: "No obligation. It is the first contact to explore a partnership.",
      submit: "Submit application",
      submitting: "Sending…"
    }
  }
};

const PARTNER_TIPOS = [
  "Camping", "Glamping", "Operador turístico", "Viñedo / Bodega",
  "Hospitalidad rural", "Propiedad recreativa", "Estación de servicio", "Otro"
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
  const { locale } = useI18n();
  const m = PARTNER_MESSAGES[locale];
  const blank = { nombre: "", razon_social: "", tipo: "", fiscal: "", provincia: "", localidad: "", telefono: "", email: "" };
  const [v, setV] = useState(blank);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const firstRef = useRef(null);
  const provincias = (NOMADE && NOMADE[locale] && NOMADE[locale].form && NOMADE[locale].form.provincias) || [];

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
    if (!v.nombre.trim()) e.nombre = m.validation.nombre;
    if (!v.tipo) e.tipo = m.validation.tipo;
    if (!v.fiscal.trim()) e.fiscal = m.validation.fiscal;
    else if (v.fiscal.replace(/[^\d]/g, "").length < 8) e.fiscal = m.validation.fiscalInvalid;
    if (!v.provincia) e.provincia = m.validation.provincia;
    if (!v.localidad.trim()) e.localidad = m.validation.localidad;
    if (!v.telefono.trim()) e.telefono = m.validation.telefono;
    else if (v.telefono.replace(/[^\d]/g, "").length < 6) e.telefono = m.validation.telefonoInvalid;
    if (!v.email.trim()) e.email = m.validation.email;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = m.validation.emailInvalid;
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
        razon_social: v.razon_social ? v.razon_social.trim() : "",
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
      setErrors({ submit: m.validation.submitError });
    } finally {
      setLoading(false);
    }
  };

  const F = PMField;

  return (
    <div className="pm-scrim" onClick={onClose} role="dialog" aria-modal="true" aria-label={m.title}>
      <div className="pm-modal" onClick={(e) => e.stopPropagation()}>
        {done ? (
          <div className="pm-done">
            <span className="pm-done-mark"><SvCheck /></span>
            <h2>{m.success.thanks}</h2>
            <p dangerouslySetInnerHTML={{ __html: m.success.desc.replace("{nombre}", v.nombre) }}></p>
            <button className="btn btn-primary" onClick={onClose} style={{ marginTop: 6 }}>{m.close}</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <div className="pm-head">
              <p className="pm-eyebrow">{m.eyebrow}</p>
              <h2>{m.title}</h2>
              <p>{m.subtitle}</p>
              <button type="button" className="pm-close" onClick={onClose} aria-label={m.close}><SvX /></button>
            </div>

            <div className="pm-body">
              <div className="pm-grid">
                <F id="nombre" label={m.fields.nombre} error={errors.nombre} full>
                  <input ref={firstRef} id="pm-nombre" value={v.nombre} onChange={set("nombre")} placeholder={m.fields.nombrePlaceholder} />
                </F>
                <F id="razon_social" label={`${m.fields.razonSocial} (${m.optional})`} error={errors.razon_social} full>
                  <input id="pm-razon_social" value={v.razon_social} onChange={set("razon_social")} placeholder={m.fields.razonSocialPlaceholder} />
                </F>
                <F id="tipo" label={m.fields.tipo} error={errors.tipo}>
                  <div className="select-wrap">
                    <select id="pm-tipo" value={v.tipo} onChange={set("tipo")}>
                      <option value="" disabled>{m.fields.tipoPlaceholder}</option>
                      {PARTNER_TIPOS.map((t) => <option key={t} value={t}>{m.types[t]}</option>)}
                    </select>
                    <SvChevron />
                  </div>
                </F>
                <F id="fiscal" label={m.fields.fiscal} error={errors.fiscal}>
                  <input id="pm-fiscal" value={v.fiscal} onChange={set("fiscal")} placeholder="30-12345678-9" inputMode="numeric" />
                </F>
                <F id="provincia" label={m.fields.provincia} error={errors.provincia}>
                  <div className="select-wrap">
                    <select id="pm-provincia" value={v.provincia} onChange={set("provincia")}>
                      <option value="" disabled>{m.fields.provinciaPlaceholder}</option>
                      {provincias.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <SvChevron />
                  </div>
                </F>
                <F id="localidad" label={m.fields.localidad} error={errors.localidad}>
                  <input id="pm-localidad" value={v.localidad} onChange={set("localidad")} placeholder={m.fields.localidadPlaceholder} />
                </F>
                <F id="telefono" label={m.fields.telefono} error={errors.telefono}>
                  <input id="pm-telefono" type="tel" value={v.telefono} onChange={set("telefono")} placeholder="+54 9 ..." inputMode="tel" />
                </F>
                <F id="email" label={m.fields.email} error={errors.email} full>
                  <input id="pm-email" type="email" value={v.email} onChange={set("email")} placeholder="contacto@tuestablecimiento.com" inputMode="email" />
                </F>
              </div>
            </div>

            <div className="pm-foot">
              <p className="pm-legal">{m.foot.legal}</p>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <React.Fragment><span className="pm-spin" aria-hidden="true"></span>{m.foot.submitting}</React.Fragment>
                  : <React.Fragment>{m.foot.submit}<SvArrow /></React.Fragment>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export { PartnerModal };
