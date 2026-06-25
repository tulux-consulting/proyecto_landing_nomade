import React, { useState, useEffect, useRef } from 'react';
import { Icon, Button, Eyebrow, useLucide } from './primitives.jsx';
import { PostulacionesRepository } from '../../repositories/index';
import { useI18n } from '../../lib/i18n/i18nContext.jsx';
import { NOMADE } from '../../data/content.js';

const STORAGE_KEY = "nomade-application-v1";

const FORM_MESSAGES = {
  es: {
    optional: "Opcional",
    validation: {
      nombre: "Ingresá tu nombre.",
      apellido: "Ingresá tu apellido.",
      email: "Ingresá tu email.",
      telefono: "Ingresá un teléfono.",
      provincia: "Elegí una provincia.",
      localidad: "Ingresá la localidad.",
      tamano: "Indicá el tamaño aproximado.",
      modelo: "Elegí un modelo de participación.",
      invalidEmail: "Revisá el formato del email.",
      invalidPhone: "Revisá el número.",
      invalidFileType: "Algunos archivos no tienen un formato de imagen válido.",
      invalidFileSize: "Algunas imágenes superan el límite de 50MB.",
      formErrors: "Revisá los campos obligatorios."
    },
    uploader: {
      title: "Fotos y documentación",
      action: "Arrastrá o seleccioná fotos del terreno",
      specs: "Hasta 8 imágenes · JPG o PNG",
      hint: "Las fotos no se guardan en el borrador; volvé a adjuntarlas si recargás la página."
    },
    success: {
      thanks: "Gracias, {nombre}.",
      received: "recibimos tu postulación",
      desc: "Recibimos la información de tu terreno en {localidad}{provincia}. Nuestro equipo la revisará y, si avanza, te contactará para conversar sobre su potencial.",
      button: "Cargar otra postulación"
    },
    nav: {
      step: "Paso {step} de {total}",
      back: "Atrás",
      draftSaved: "Borrador guardado",
      continue: "Continuar",
      submitting: "Enviando...",
      submit: "Enviar postulación"
    },
    fields: {
      nombre: "Nombre",
      nombrePlaceholder: "Tu nombre",
      apellido: "Apellido",
      apellidoPlaceholder: "Tu apellido",
      email: "Email",
      emailPlaceholder: "nombre@correo.com",
      telefono: "Teléfono",
      telefonoPlaceholder: "+54 9 ...",
      relacion: "Tu relación con el terreno",
      provincia: "Provincia",
      provinciaPlaceholder: "Elegí una provincia",
      localidad: "Localidad o paraje",
      localidadPlaceholder: "Ciudad, pueblo o paraje",
      coords: "Link de mapa o coordenadas",
      coordsPlaceholder: "Google Maps o lat, long",
      distancia: "Distancia a la ciudad más cercana",
      distanciaPlaceholder: "Ej.: 40 km · 30 min",
      tamano: "Tamaño del terreno",
      topografia: "Topografía",
      paisaje: "Tipo de paisaje",
      multipleHint: "Podés elegir más de uno",
      multipleHintF: "Podés elegir más de una",
      aguas: "Cuerpos de agua",
      vistas: "Vistas predominantes",
      vistasPlaceholder: "Ej.: cordillera, lago, valle",
      entorno: "Vegetación",
      entornoPlaceholder: "Ej.: bosque nativo, monte, pastizal",
      acceso: "Tipo de acceso",
      estacionalidad: "Disponibilidad de acceso",
      aeropuerto: "Aeropuerto o ciudad de referencia",
      aeropuertoPlaceholder: "Ej.: Aeropuerto de Bariloche, 50 km",
      servicios: "Servicios disponibles",
      construcciones: "Construcciones existentes",
      titulo: "Título de propiedad",
      usoSuelo: "Uso de suelo",
      legalNotas: "Restricciones ambientales u observaciones legales",
      legalNotasPlaceholder: "Áreas protegidas, gravámenes, etc.",
      actividades: "Actividades posibles en la zona",
      atractivos: "Atractivos cercanos",
      atractivosPlaceholder: "Parques, bodegas, pueblos, hitos",
      demanda: "Demanda turística de la zona",
      modelo: "Modelo de participación de interés",
      inversion: "Disponibilidad de inversión",
      horizonte: "Horizonte temporal",
      comentarios: "Comentarios",
      comentariosPlaceholder: "Paisaje, acceso, agua, vistas, historia del lugar… lo que quieras compartir."
    }
  },
  en: {
    optional: "Optional",
    validation: {
      nombre: "Please enter your first name.",
      apellido: "Please enter your last name.",
      email: "Please enter your email.",
      telefono: "Please enter a phone number.",
      provincia: "Please choose a province.",
      localidad: "Please enter the city/locality.",
      tamano: "Please indicate the approximate size.",
      modelo: "Please choose a participation model.",
      invalidEmail: "Please check the email format.",
      invalidPhone: "Please check the phone number.",
      invalidFileType: "Some files do not have a valid image format.",
      invalidFileSize: "Some images exceed the 50MB limit.",
      formErrors: "Please review the required fields."
    },
    uploader: {
      title: "Photos and documentation",
      action: "Drag or select photos of the land",
      specs: "Up to 8 images · JPG or PNG",
      hint: "Photos are not saved in the draft; please re-attach them if you reload the page."
    },
    success: {
      thanks: "Thank you, {nombre}.",
      received: "we received your application",
      desc: "We received the information of your land in {localidad}{provincia}. Our team will review it and, if it proceeds, will contact you to discuss its potential.",
      button: "Submit another application"
    },
    nav: {
      step: "Step {step} of {total}",
      back: "Back",
      draftSaved: "Draft saved",
      continue: "Continue",
      submitting: "Sending...",
      submit: "Submit application"
    },
    fields: {
      nombre: "First name",
      nombrePlaceholder: "Your first name",
      apellido: "Last name",
      apellidoPlaceholder: "Your last name",
      email: "Email",
      emailPlaceholder: "name@example.com",
      telefono: "Phone number",
      telefonoPlaceholder: "+1 ...",
      relacion: "Your relationship with the land",
      provincia: "Province / Region",
      provinciaPlaceholder: "Choose a region",
      localidad: "Locality or city",
      localidadPlaceholder: "City, town, or area",
      coords: "Map link or coordinates",
      coordsPlaceholder: "Google Maps or lat, long",
      distancia: "Distance to nearest city",
      distanciaPlaceholder: "e.g. 40 km · 30 min",
      tamano: "Land size",
      topografia: "Topography",
      paisaje: "Landscape type",
      multipleHint: "You can choose more than one",
      multipleHintF: "You can choose more than one",
      aguas: "Water bodies",
      vistas: "Predominant views",
      vistasPlaceholder: "e.g. mountain range, lake, valley",
      entorno: "Vegetation",
      entornoPlaceholder: "e.g. native forest, hills, pasture",
      acceso: "Access type",
      estacionalidad: "Access availability",
      aeropuerto: "Nearest airport or reference city",
      aeropuertoPlaceholder: "e.g. Bariloche Airport, 50 km",
      servicios: "Available services",
      construcciones: "Existing buildings",
      titulo: "Property title",
      usoSuelo: "Land use",
      legalNotas: "Environmental restrictions or legal remarks",
      legalNotasPlaceholder: "Protected areas, encumbrances, etc.",
      actividades: "Possible activities in the area",
      atractivos: "Nearby attractions",
      atractivosPlaceholder: "Parks, wineries, towns, landmarks",
      demanda: "Tourist demand in the area",
      modelo: "Participation model of interest",
      inversion: "Investment availability",
      horizonte: "Time horizon",
      comentarios: "Comments",
      comentariosPlaceholder: "Landscape, access, water, views, history of the place... whatever you want to share."
    }
  }
};

function Field({ id, label, hint, error, children, full, optional, raw }) {
  const { locale } = useI18n();
  const optLabel = FORM_MESSAGES[locale].optional;
  const hintId = hint ? id + "-hint" : undefined;
  const errId = error ? id + "-err" : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(" ") || undefined;
  // Clone the control to wire id + aria (skip when raw — caller wires it)
  const control = !raw && React.isValidElement(children) ?
    React.cloneElement(children, {
      id,
      "aria-invalid": error ? "true" : undefined,
      "aria-describedby": describedBy
    }) :
    children;
  return (
    <div className={"field" + (full ? " full" : "") + (error ? " has-error" : "")}>
      <label className="field-label" htmlFor={id}>
        {label}
        {optional && <span className="field-opt">{optLabel}</span>}
      </label>
      {hint && <span className="field-hint" id={hintId}>{hint}</span>}
      {control}
      {error && <span className="field-error" id={errId} role="alert">{error}</span>}
    </div>);

}

// Single / multi chip group. Wired as a labelled group of toggle buttons.
function Chips({ options, value, onChange, multi, labelId, invalid, describedBy, hideCheck }) {
  const isOn = (o) => multi ? (value || []).includes(o) : value === o;
  const pick = (o) => {
    if (multi) {
      const cur = value || [];
      onChange(cur.includes(o) ? cur.filter((x) => x !== o) : [...cur, o]);
    } else {
      onChange(o);
    }
  };
  return (
    <div className="chips" role="group" aria-labelledby={labelId} aria-invalid={invalid ? "true" : undefined} aria-describedby={describedBy}>
      {options.map((o) =>
        <button type="button" key={o}
          className={"chip" + (isOn(o) ? " active" : "") + (multi ? " chip-multi" : "")}
          aria-pressed={isOn(o)}
          onClick={() => pick(o)}>
          {multi && !hideCheck && <span className="chip-check" aria-hidden="true"><Icon name="check" /></span>}{o}
        </button>
      )}
    </div>);

}

// A labelled chip field (label + group), with explicit ids for SR + errors.
function ChipField({ id, label, hint, error, optional, full, children }) {
  const { locale } = useI18n();
  const optLabel = FORM_MESSAGES[locale].optional;
  const labelId = id + "-label";
  const hintId = hint ? id + "-hint" : undefined;
  const errId = error ? id + "-err" : undefined;
  return (
    <div className={"field" + (full ? " full" : "") + (error ? " has-error" : "")}>
      <span className="field-label" id={labelId}>
        {label}
        {optional && <span className="field-opt">{optLabel}</span>}
      </span>
      {hint && <span className="field-hint" id={hintId}>{hint}</span>}
      {React.cloneElement(children, { labelId, invalid: !!error, describedBy: [hintId, errId].filter(Boolean).join(" ") || undefined })}
      {error && <span className="field-error" id={errId} role="alert">{error}</span>}
    </div>);

}

function LeadForm({ d, isPreview = false }) {
  const { locale } = useI18n();
  const m = FORM_MESSAGES[locale];
  useLucide();
  const STEPS = d.sections; // 9 titles
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [savedAt, setSavedAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fileRef = useRef(null);
  const formRef = useRef(null);
  const panelRef = useRef(null);
  const liveRef = useRef(null);

  const blank = {
    nombre: "", apellido: "", email: "", telefono: "", relacion: "",
    provincia: "", localidad: "", coords: "", distancia: "",
    tamano: "", topografia: "", paisaje: [],
    aguas: [], vistas: "", entorno: "", acceso: "", estacionalidad: "", aeropuerto: "",
    servicios: [], construcciones: "",
    titulo: "", usoSuelo: "", legalNotas: "",
    actividades: [], atractivos: "", demanda: "",
    modelo: "", inversion: "", horizonte: "",
    comentarios: ""
  };
  const [vals, setVals] = useState(blank);

  // Restore draft on mount
  useEffect(() => {
    if (isPreview) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && saved.vals) {
          setVals({ ...blank, ...saved.vals });
          setStep(saved.step || 0);
          setMaxReached(saved.maxReached || saved.step || 0);
          setSavedAt(saved.t || null);
        }
      }
    } catch (e) {/* ignore */ }
  }, [isPreview]);

  // Autosave (debounced) whenever vals/step change
  useEffect(() => {
    if (isPreview || done) return;
    const t = setTimeout(() => {
      try {
        const now = Date.now();
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ vals, step, maxReached, t: now }));
        setSavedAt(now);
      } catch (e) {/* ignore quota */ }
    }, 600);
    return () => clearTimeout(t);
  }, [vals, step, maxReached, done, isPreview]);

  const set = (k) => (e) => {
    setVals((v) => ({ ...v, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };
  const setVal = (k) => (val) => {
    setVals((v) => ({ ...v, [k]: val }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const onFiles = (e) => {
    const arr = Array.from(e.target.files || []);
    const validFiles = [];
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    let hasInvalidType = false;
    let hasInvalidSize = false;

    for (const f of arr) {
      if (!f.type.startsWith("image/")) {
        hasInvalidType = true;
        continue;
      }
      if (f.size > MAX_SIZE) {
        hasInvalidSize = true;
        continue;
      }
      validFiles.push(f);
    }

    if (hasInvalidType || hasInvalidSize) {
      const msgs = [];
      if (hasInvalidType) msgs.push(m.validation.invalidFileType);
      if (hasInvalidSize) msgs.push(m.validation.invalidFileSize);
      setErrors((er) => ({ ...er, fotos: msgs.join(" ") }));
    } else {
      setErrors((er) => ({ ...er, fotos: undefined }));
    }

    const mapped = validFiles.map((f) => ({ name: f.name, url: URL.createObjectURL(f), file: f }));
    setFiles((prev) => [...prev, ...mapped].slice(0, 8));
  };
  const removeFile = (i) => {
    setFiles((prev) => prev.filter((_, x) => x !== i));
    setErrors((er) => ({ ...er, fotos: undefined }));
  };


  // Required fields per step index
  const required = {
    0: { nombre: m.validation.nombre, apellido: m.validation.apellido, email: m.validation.email, telefono: m.validation.telefono },
    1: { provincia: m.validation.provincia, localidad: m.validation.localidad },
    2: { tamano: m.validation.tamano },
    7: { modelo: m.validation.modelo }
  };

  const validateStep = (s) => {
    const reqs = required[s] || {};
    const e = {};
    Object.keys(reqs).forEach((k) => {
      const v = vals[k];
      if (!v || typeof v === "string" && !v.trim()) e[k] = reqs[k];
    });
    if (s === 0 && vals.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email)) e.email = m.validation.invalidEmail;
    if (s === 0 && vals.telefono && vals.telefono.replace(/[^\d]/g, "").length < 6) e.telefono = m.validation.invalidPhone;
    return e;
  };

  const focusFirstError = (e) => {
    const first = Object.keys(e)[0];
    if (!first) return;
    requestAnimationFrame(() => {
      const el = panelRef.current && (panelRef.current.querySelector("#" + first) || panelRef.current.querySelector("[id='" + first + "-label']"));
      if (el) {
        const focusable = el.tagName === "SPAN" ? el.parentElement.querySelector("button,input,select,textarea") : el;
        (focusable || el).focus({ preventScroll: false });
      }
    });
  };

  const announce = (msg) => { if (liveRef.current) liveRef.current.textContent = msg; };

  const goTo = (s) => {
    setStep(s);
    setMaxReached((m) => Math.max(m, s));
    announce(m.nav.step.replace("{step}", String(s + 1)).replace("{total}", String(STEPS.length)) + ": " + STEPS[s]);
    requestAnimationFrame(() => {
      if (formRef.current) window.scrollTo({ top: formRef.current.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
      if (panelRef.current) { panelRef.current.setAttribute("tabindex", "-1"); panelRef.current.focus({ preventScroll: true }); }
    });
  };

  const next = () => {
    if (isPreview) return;
    const e = validateStep(step);
    if (Object.keys(e).length) { setErrors(e); focusFirstError(e); announce(m.validation.formErrors); return; }
    setErrors({});
    if (step < STEPS.length - 1) goTo(step + 1);
  };
  const back = () => { if (isPreview) return; setErrors({}); if (step > 0) goTo(step - 1); };

  const jump = (s) => {
    if (isPreview) return;
    if (s === step) return;
    if (s < step) { setErrors({}); goTo(s); return; }
    // forward only into already-reached steps
    if (s <= maxReached) { setErrors({}); goTo(s); }
  };

  const submit = async () => {
    if (isPreview) return;
    // validate every required step
    let firstBad = -1; let allErr = {};
    [0, 1, 2, 7].forEach((s) => {
      const e = validateStep(s);
      if (Object.keys(e).length && firstBad === -1) { firstBad = s; allErr = e; }
    });
    if (firstBad >= 0) {
      setMaxReached((m) => Math.max(m, firstBad));
      setStep(firstBad);
      setErrors(allErr);
      focusFirstError(allErr);
      announce("Faltan datos obligatorios en el paso " + (firstBad + 1) + ".");
      requestAnimationFrame(() => { if (formRef.current) window.scrollTo({ top: formRef.current.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" }); });
      return;
    }

    setLoading(true);
    setSubmitError("");

    try {
      const uploadedUrls = [];
      const { createClient } = await import('../../lib/supabase/client.js');
      const supabase = createClient();

      const folderId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      for (let i = 0; i < files.length; i++) {
        const fileItem = files[i];
        if (fileItem.file) {
          const fileExt = fileItem.name.split('.').pop();
          const fileName = `${Date.now()}-${i}.${fileExt}`;
          const filePath = `${folderId}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('postulaciones')
            .upload(filePath, fileItem.file);

          if (uploadError) {
            console.error('Error al subir imagen:', uploadError);
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('postulaciones')
              .getPublicUrl(filePath);
            uploadedUrls.push(publicUrl);
          }
        }
      }

      const translateToSpanish = (val, key) => {
        if (!val) return val;
        const esList = NOMADE.es.form[key];
        const enList = NOMADE.en.form[key];
        if (!esList || !enList) return val;

        const mapSingle = (v) => {
          const idx = enList.indexOf(v);
          if (idx !== -1) return esList[idx];
          return v;
        };

        if (Array.isArray(val)) {
          return val.map(mapSingle);
        }
        return mapSingle(val);
      };

      const translatedVals = {
        ...vals,
        relacion: translateToSpanish(vals.relacion, 'relaciones'),
        tamano: translateToSpanish(vals.tamano, 'sizes'),
        topografia: translateToSpanish(vals.topografia, 'topografias'),
        paisaje: translateToSpanish(vals.paisaje, 'paisajes'),
        aguas: translateToSpanish(vals.aguas, 'aguas'),
        acceso: translateToSpanish(vals.acceso, 'accesos'),
        estacionalidad: translateToSpanish(vals.estacionalidad, 'estacionalidad'),
        servicios: translateToSpanish(vals.servicios, 'servicios'),
        construcciones: translateToSpanish(vals.construcciones, 'construcciones'),
        titulo: translateToSpanish(vals.titulo, 'titulo'),
        usoSuelo: translateToSpanish(vals.usoSuelo, 'usoSuelo'),
        actividades: translateToSpanish(vals.actividades, 'actividades'),
        demanda: translateToSpanish(vals.demanda, 'demanda'),
        modelo: translateToSpanish(vals.modelo, 'modelos'),
        inversion: translateToSpanish(vals.inversion, 'inversion'),
        horizonte: translateToSpanish(vals.horizonte, 'horizontes')
      };

      await PostulacionesRepository.create({
        ...translatedVals,
        fotos: uploadedUrls
      });

      setDone(true);
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) { }
      requestAnimationFrame(() => { if (formRef.current) window.scrollTo({ top: formRef.current.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" }); });
    } catch (err) {
      console.error(err);
      setSubmitError("Ocurrió un error al enviar tu postulación. Por favor, intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };


  const reset = () => {
    if (isPreview) return;
    setVals(blank); setFiles([]); setStep(0); setMaxReached(0); setDone(false); setErrors({}); setSavedAt(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { }
  };

  const pct = Math.round((step + 1) / STEPS.length * 100);

  // ---- Step content ------------------------------------------------------
  const renderStep = () => {
    switch (step) {
      case 0: return (
        <div className="form-grid">
          <Field id="nombre" label={m.fields.nombre} error={errors.nombre}>
            <input value={vals.nombre} onChange={set("nombre")} placeholder={m.fields.nombrePlaceholder} autoComplete="given-name" disabled={isPreview} />
          </Field>
          <Field id="apellido" label={m.fields.apellido} error={errors.apellido}>
            <input value={vals.apellido} onChange={set("apellido")} placeholder={m.fields.apellidoPlaceholder} autoComplete="family-name" disabled={isPreview} />
          </Field>
          <Field id="email" label={m.fields.email} error={errors.email}>
            <input type="email" value={vals.email} onChange={set("email")} placeholder={m.fields.emailPlaceholder} autoComplete="email" inputMode="email" disabled={isPreview} />
          </Field>
          <Field id="telefono" label={m.fields.telefono} error={errors.telefono}>
            <input type="tel" value={vals.telefono} onChange={set("telefono")} placeholder={m.fields.telefonoPlaceholder} autoComplete="tel" inputMode="tel" disabled={isPreview} />
          </Field>
          <ChipField id="relacion" label={m.fields.relacion} full disabled={isPreview}>
            <Chips options={d.relaciones} value={vals.relacion} onChange={setVal("relacion")} />
          </ChipField>
        </div>);

      case 1: return (
        <div className="form-grid">
          <Field id="provincia" label={m.fields.provincia} error={errors.provincia} raw>
            <div className="select-wrap">
              <select id="provincia" value={vals.provincia} onChange={set("provincia")} disabled={isPreview}
                aria-invalid={errors.provincia ? "true" : undefined}
                aria-describedby={errors.provincia ? "provincia-err" : undefined}>
                <option value="" disabled>{m.fields.provinciaPlaceholder}</option>
                {d.provincias.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <Icon name="chevron-down" />
            </div>
          </Field>
          <Field id="localidad" label={m.fields.localidad} error={errors.localidad}>
            <input value={vals.localidad} onChange={set("localidad")} placeholder={m.fields.localidadPlaceholder} disabled={isPreview} />
          </Field>
          <Field id="coords" label={m.fields.coords} optional>
            <input value={vals.coords} onChange={set("coords")} placeholder={m.fields.coordsPlaceholder} disabled={isPreview} />
          </Field>
          <Field id="distancia" label={m.fields.distancia} optional>
            <input value={vals.distancia} onChange={set("distancia")} placeholder={m.fields.distanciaPlaceholder} disabled={isPreview} />
          </Field>
        </div>);

      case 2: return (
        <React.Fragment>
          <ChipField id="tamano" label={m.fields.tamano} error={errors.tamano} full disabled={isPreview}>
            <Chips options={d.sizes} value={vals.tamano} onChange={setVal("tamano")} />
          </ChipField>
          <ChipField id="topografia" label={m.fields.topografia} full disabled={isPreview}>
            <Chips options={d.topografias} value={vals.topografia} onChange={setVal("topografia")} />
          </ChipField>
          <ChipField id="paisaje" label={m.fields.paisaje} hint={m.fields.multipleHint} full disabled={isPreview}>
            <Chips options={d.paisajes} value={vals.paisaje} onChange={setVal("paisaje")} multi hideCheck />
          </ChipField>
        </React.Fragment>);

      case 3: return (
        <React.Fragment>
          <ChipField id="aguas" label={m.fields.aguas} hint={m.fields.multipleHint} full disabled={isPreview}>
            <Chips options={d.aguas} value={vals.aguas} onChange={setVal("aguas")} multi hideCheck />
          </ChipField>
          <div className="form-grid">
            <Field id="vistas" label={m.fields.vistas} optional>
              <input value={vals.vistas} onChange={set("vistas")} placeholder={m.fields.vistasPlaceholder} disabled={isPreview} />
            </Field>
            <Field id="entorno" label={m.fields.entorno} optional>
              <input value={vals.entorno} onChange={set("entorno")} placeholder={m.fields.entornoPlaceholder} disabled={isPreview} />
            </Field>
          </div>
          <ChipField id="acceso" label={m.fields.acceso} full disabled={isPreview}>
            <Chips options={d.accesos} value={vals.acceso} onChange={setVal("acceso")} />
          </ChipField>
          <ChipField id="estacionalidad" label={m.fields.estacionalidad} full disabled={isPreview}>
            <Chips options={d.estacionalidad} value={vals.estacionalidad} onChange={setVal("estacionalidad")} />
          </ChipField>
          <Field id="aeropuerto" label={m.fields.aeropuerto} optional full>
            <input value={vals.aeropuerto} onChange={set("aeropuerto")} placeholder={m.fields.aeropuertoPlaceholder} disabled={isPreview} />
          </Field>
        </React.Fragment>);

      case 4: return (
        <React.Fragment>
          <ChipField id="servicios" label={m.fields.servicios} hint={m.fields.multipleHint} full disabled={isPreview}>
            <Chips options={d.servicios} value={vals.servicios} onChange={setVal("servicios")} multi hideCheck />
          </ChipField>
          <ChipField id="construcciones" label={m.fields.construcciones} full disabled={isPreview}>
            <Chips options={d.construcciones} value={vals.construcciones} onChange={setVal("construcciones")} />
          </ChipField>
        </React.Fragment>);

      case 5: return (
        <React.Fragment>
          <ChipField id="titulo" label={m.fields.titulo} full disabled={isPreview}>
            <Chips options={d.titulo} value={vals.titulo} onChange={setVal("titulo")} />
          </ChipField>
          <ChipField id="usoSuelo" label={m.fields.usoSuelo} full disabled={isPreview}>
            <Chips options={d.usoSuelo} value={vals.usoSuelo} onChange={setVal("usoSuelo")} />
          </ChipField>
          <Field id="legalNotas" label={m.fields.legalNotas} optional full>
            <input value={vals.legalNotas} onChange={set("legalNotas")} placeholder={m.fields.legalNotasPlaceholder} disabled={isPreview} />
          </Field>
        </React.Fragment>);

      case 6: return (
        <React.Fragment>
          <ChipField id="actividades" label={m.fields.actividades} hint={m.fields.multipleHintF} full disabled={isPreview}>
            <Chips options={d.actividades} value={vals.actividades} onChange={setVal("actividades")} multi hideCheck />
          </ChipField>
          <Field id="atractivos" label={m.fields.atractivos} optional full>
            <input value={vals.atractivos} onChange={set("atractivos")} placeholder={m.fields.atractivosPlaceholder} disabled={isPreview} />
          </Field>
          <ChipField id="demanda" label={m.fields.demanda} full disabled={isPreview}>
            <Chips options={d.demanda} value={vals.demanda} onChange={setVal("demanda")} />
          </ChipField>
        </React.Fragment>);

      case 7: return (
        <React.Fragment>
          <ChipField id="modelo" label={m.fields.modelo} error={errors.modelo} full disabled={isPreview}>
            <Chips options={d.modelos} value={vals.modelo} onChange={setVal("modelo")} />
          </ChipField>
          <ChipField id="inversion" label={m.fields.inversion} full disabled={isPreview}>
            <Chips options={d.inversion} value={vals.inversion} onChange={setVal("inversion")} />
          </ChipField>
          <ChipField id="horizonte" label={m.fields.horizonte} full disabled={isPreview}>
            <Chips options={d.horizontes} value={vals.horizonte} onChange={setVal("horizonte")} />
          </ChipField>
        </React.Fragment>);

      case 8: return (
        <React.Fragment>
          <Field id="comentarios" label={m.fields.comentarios} hint={m.fields.comentariosPlaceholder} optional full>
            <textarea value={vals.comentarios} onChange={set("comentarios")} rows="4"
              placeholder={m.fields.comentariosPlaceholder} disabled={isPreview}></textarea>
          </Field>
          <div className={"field full" + (errors.fotos ? " has-error" : "")}>
            <span className="field-label" id="fotos-label">{m.uploader.title} <span className="field-opt">{m.optional}</span></span>
            <button type="button" className="uploader" onClick={() => !isPreview && fileRef.current && fileRef.current.click()} aria-labelledby="fotos-label" disabled={isPreview}>
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onFiles} disabled={isPreview} />
              <Icon name="image-up" />
              <span>{m.uploader.action}</span>
              <small>{m.uploader.specs}</small>
            </button>
            {errors.fotos && <span className="field-error" style={{ display: "block", marginTop: "6px" }} role="alert">{errors.fotos}</span>}
            {files.length > 0 &&
              <div className="thumbs">
                {files.map((f, i) =>
                  <div className="thumb" key={i} style={{ backgroundImage: `url(${f.url})` }}>
                    <button type="button" className="thumb-x" onClick={(e) => { e.stopPropagation(); removeFile(i); }} aria-label={"Remove " + f.name} disabled={isPreview}><Icon name="x" /></button>
                  </div>
                )}
              </div>
            }
            <p className="field-hint">{m.uploader.hint}</p>
          </div>
        </React.Fragment>);

      default: return null;
    }
  };

  return (
    <section className="section sand" id="formulario" ref={formRef} aria-labelledby="form-title" style={isPreview ? { pointerEvents: 'none' } : undefined}>
      <div className="wrap form-app">
        {/* Left — intro + vertical stepper */}
        <aside className="form-aside">
          <Eyebrow>{d.eyebrow}</Eyebrow>
          <h2 id="form-title">{d.h2}</h2>
          <p className="lead">{d.lead}</p>
          <div className="form-disclaimer">
            <Icon name="shield" />
            <p>{d.disclaimer}</p>
          </div>
        </aside>

        {/* Right — wizard */}
        <div className="form-main">
          <span ref={liveRef} className="sr-only" aria-live="polite"></span>
          {done ?
            <div className="form-card nm-card form-done">
              <span className="form-done-mark" aria-hidden="true"><Icon name="check" /></span>
              <h3>{m.success.thanks.replace("{nombre}", vals.nombre || m.success.received)}</h3>
              <p>{m.success.desc.replace("{localidad}", vals.localidad || (locale === 'en' ? "your area" : "tu zona")).replace("{provincia}", vals.provincia ? ", " + vals.provincia : "")}</p>
              <Button variant="secondary" onClick={reset} disabled={isPreview}>{m.success.button}</Button>
            </div> :

            <div className="form-card nm-card">
              {/* progress */}
              <div className="wizard-progress">
                <div className="wizard-progress-meta">
                  <span className="wizard-step-count">{m.nav.step.replace("{step}", String(step + 1)).replace("{total}", String(STEPS.length))}</span>
                  <span className="wizard-step-title">{STEPS[step]}</span>
                </div>
                <div className="wizard-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={"Progress: " + pct + "%"}>
                  <span style={{ width: pct + "%" }}></span>
                </div>
              </div>

              <div className="wizard-panel" ref={panelRef} role="group" aria-label={m.nav.step.replace("{step}", String(step + 1)).replace("{total}", String(STEPS.length)) + ": " + STEPS[step]}>
                {renderStep()}
              </div>

              {submitError && (
                <div style={{ color: "#ef4444", fontSize: "14px", margin: "1rem 0", display: "flex", gap: "0.25rem", alignItems: "center" }}>
                  <Icon name="alert-circle" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="wizard-nav">
                <div className="wizard-nav-left">
                  {step > 0 &&
                    <button type="button" className="btn-text" onClick={back} disabled={isPreview || loading}><Icon name="arrow-left" />{m.nav.back}</button>
                  }
                </div>
                <div className="wizard-nav-right">
                  {savedAt && <span className="wizard-saved" aria-hidden="true"><Icon name="check" />{m.nav.draftSaved}</span>}
                  {step < STEPS.length - 1 ?
                    <Button variant="primary" icon="arrow-right" onClick={next} disabled={isPreview || loading}>{m.nav.continue}</Button> :
                    <Button variant="primary" icon={loading ? undefined : "arrow-right"} onClick={submit} disabled={isPreview || loading}>
                      {loading ? m.nav.submitting : m.nav.submit}
                    </Button>}
                </div>
              </div>

            </div>
          }
        </div>
      </div>
    </section>);

}

export { LeadForm };
