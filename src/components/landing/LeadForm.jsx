import React, { useState, useEffect, useRef } from 'react';
import { Icon, Button, Eyebrow, useLucide } from './primitives.jsx';
// NÓMADE — 9 Initial NÓMADE Evaluation.
// Multi-step application wizard. All original fields preserved — only chunked
// into 9 steps (Progressive Disclosure + Chunking + Goal Gradient).
// Per-step validation, keyboard + SR accessible, localStorage autosave.
// No backend — demo submit with a reassuring success state (Peak-End).

const STORAGE_KEY = "nomade-application-v1";

function Field({ id, label, hint, error, children, full, optional, raw }) {
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
        {optional && <span className="field-opt">Opcional</span>}
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
  const labelId = id + "-label";
  const hintId = hint ? id + "-hint" : undefined;
  const errId = error ? id + "-err" : undefined;
  return (
    <div className={"field" + (full ? " full" : "") + (error ? " has-error" : "")}>
      <span className="field-label" id={labelId}>
        {label}
        {optional && <span className="field-opt">Opcional</span>}
      </span>
      {hint && <span className="field-hint" id={hintId}>{hint}</span>}
      {React.cloneElement(children, { labelId, invalid: !!error, describedBy: [hintId, errId].filter(Boolean).join(" ") || undefined })}
      {error && <span className="field-error" id={errId} role="alert">{error}</span>}
    </div>);

}

function LeadForm({ d, isPreview = false }) {
  useLucide();
  const STEPS = d.sections; // 9 titles
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [savedAt, setSavedAt] = useState(null);
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
    const list = Array.from(e.target.files || []).slice(0, 8);
    const mapped = list.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));
    setFiles((prev) => [...prev, ...mapped].slice(0, 8));
  };
  const removeFile = (i) => setFiles((prev) => prev.filter((_, x) => x !== i));

  // Required fields per step index
  const required = {
    0: { nombre: "Ingresá tu nombre.", apellido: "Ingresá tu apellido.", email: "Ingresá tu email.", telefono: "Ingresá un teléfono." },
    1: { provincia: "Elegí una provincia.", localidad: "Ingresá la localidad." },
    2: { tamano: "Indicá el tamaño aproximado." },
    7: { modelo: "Elegí un modelo de participación." }
  };

  const validateStep = (s) => {
    const reqs = required[s] || {};
    const e = {};
    Object.keys(reqs).forEach((k) => {
      const v = vals[k];
      if (!v || typeof v === "string" && !v.trim()) e[k] = reqs[k];
    });
    if (s === 0 && vals.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email)) e.email = "Revisá el formato del email.";
    if (s === 0 && vals.telefono && vals.telefono.replace(/[^\d]/g, "").length < 6) e.telefono = "Revisá el número.";
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
    announce("Paso " + (s + 1) + " de " + STEPS.length + ": " + STEPS[s]);
    requestAnimationFrame(() => {
      if (formRef.current) window.scrollTo({ top: formRef.current.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
      if (panelRef.current) { panelRef.current.setAttribute("tabindex", "-1"); panelRef.current.focus({ preventScroll: true }); }
    });
  };

  const next = () => {
    if (isPreview) return;
    const e = validateStep(step);
    if (Object.keys(e).length) { setErrors(e); focusFirstError(e); announce("Revisá los campos obligatorios."); return; }
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

  const submit = () => {
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
    setDone(true);
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { }
    requestAnimationFrame(() => { if (formRef.current) window.scrollTo({ top: formRef.current.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" }); });
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
          <Field id="nombre" label="Nombre" error={errors.nombre}>
            <input value={vals.nombre} onChange={set("nombre")} placeholder="Tu nombre" autoComplete="given-name" disabled={isPreview} />
          </Field>
          <Field id="apellido" label="Apellido" error={errors.apellido}>
            <input value={vals.apellido} onChange={set("apellido")} placeholder="Tu apellido" autoComplete="family-name" disabled={isPreview} />
          </Field>
          <Field id="email" label="Email" error={errors.email}>
            <input type="email" value={vals.email} onChange={set("email")} placeholder="nombre@correo.com" autoComplete="email" inputMode="email" disabled={isPreview} />
          </Field>
          <Field id="telefono" label="Teléfono" error={errors.telefono}>
            <input type="tel" value={vals.telefono} onChange={set("telefono")} placeholder="+54 9 ..." autoComplete="tel" inputMode="tel" disabled={isPreview} />
          </Field>
          <ChipField id="relacion" label="Tu relación con el terreno" full disabled={isPreview}>
            <Chips options={d.relaciones} value={vals.relacion} onChange={setVal("relacion")} />
          </ChipField>
        </div>);

      case 1: return (
        <div className="form-grid">
          <Field id="provincia" label="Provincia" error={errors.provincia} raw>
            <div className="select-wrap">
              <select id="provincia" value={vals.provincia} onChange={set("provincia")} disabled={isPreview}
                aria-invalid={errors.provincia ? "true" : undefined}
                aria-describedby={errors.provincia ? "provincia-err" : undefined}>
                <option value="" disabled>Elegí una provincia</option>
                {d.provincias.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <Icon name="chevron-down" />
            </div>
          </Field>
          <Field id="localidad" label="Localidad o paraje" error={errors.localidad}>
            <input value={vals.localidad} onChange={set("localidad")} placeholder="Ciudad, pueblo o paraje" disabled={isPreview} />
          </Field>
          <Field id="coords" label="Link de mapa o coordenadas" optional>
            <input value={vals.coords} onChange={set("coords")} placeholder="Google Maps o lat, long" disabled={isPreview} />
          </Field>
          <Field id="distancia" label="Distancia a la ciudad más cercana" optional>
            <input value={vals.distancia} onChange={set("distancia")} placeholder="Ej.: 40 km · 30 min" disabled={isPreview} />
          </Field>
        </div>);

      case 2: return (
        <React.Fragment>
          <ChipField id="tamano" label="Tamaño del terreno" error={errors.tamano} full disabled={isPreview}>
            <Chips options={d.sizes} value={vals.tamano} onChange={setVal("tamano")} />
          </ChipField>
          <ChipField id="topografia" label="Topografía" full disabled={isPreview}>
            <Chips options={d.topografias} value={vals.topografia} onChange={setVal("topografia")} />
          </ChipField>
          <ChipField id="paisaje" label="Tipo de paisaje" hint="Podés elegir más de uno" full disabled={isPreview}>
            <Chips options={d.paisajes} value={vals.paisaje} onChange={setVal("paisaje")} multi hideCheck />
          </ChipField>
        </React.Fragment>);

      case 3: return (
        <React.Fragment>
          <ChipField id="aguas" label="Cuerpos de agua" hint="Podés elegir más de uno" full disabled={isPreview}>
            <Chips options={d.aguas} value={vals.aguas} onChange={setVal("aguas")} multi hideCheck />
          </ChipField>
          <div className="form-grid">
            <Field id="vistas" label="Vistas predominantes" optional>
              <input value={vals.vistas} onChange={set("vistas")} placeholder="Ej.: cordillera, lago, valle" disabled={isPreview} />
            </Field>
            <Field id="entorno" label="Vegetación" optional>
              <input value={vals.entorno} onChange={set("entorno")} placeholder="Ej.: bosque nativo, monte, pastizal" disabled={isPreview} />
            </Field>
          </div>
          <ChipField id="acceso" label="Tipo de acceso" full disabled={isPreview}>
            <Chips options={d.accesos} value={vals.acceso} onChange={setVal("acceso")} />
          </ChipField>
          <ChipField id="estacionalidad" label="Disponibilidad de acceso" full disabled={isPreview}>
            <Chips options={d.estacionalidad} value={vals.estacionalidad} onChange={setVal("estacionalidad")} />
          </ChipField>
          <Field id="aeropuerto" label="Aeropuerto o ciudad de referencia" optional full>
            <input value={vals.aeropuerto} onChange={set("aeropuerto")} placeholder="Ej.: Aeropuerto de Bariloche, 50 km" disabled={isPreview} />
          </Field>
        </React.Fragment>);

      case 4: return (
        <React.Fragment>
          <ChipField id="servicios" label="Servicios disponibles" hint="Podés elegir más de uno" full disabled={isPreview}>
            <Chips options={d.servicios} value={vals.servicios} onChange={setVal("servicios")} multi hideCheck />
          </ChipField>
          <ChipField id="construcciones" label="Construcciones existentes" full disabled={isPreview}>
            <Chips options={d.construcciones} value={vals.construcciones} onChange={setVal("construcciones")} />
          </ChipField>
        </React.Fragment>);

      case 5: return (
        <React.Fragment>
          <ChipField id="titulo" label="Título de propiedad" full disabled={isPreview}>
            <Chips options={d.titulo} value={vals.titulo} onChange={setVal("titulo")} />
          </ChipField>
          <ChipField id="usoSuelo" label="Uso de suelo" full disabled={isPreview}>
            <Chips options={d.usoSuelo} value={vals.usoSuelo} onChange={setVal("usoSuelo")} />
          </ChipField>
          <Field id="legalNotas" label="Restricciones ambientales u observaciones legales" optional full>
            <input value={vals.legalNotas} onChange={set("legalNotas")} placeholder="Áreas protegidas, gravámenes, etc." disabled={isPreview} />
          </Field>
        </React.Fragment>);

      case 6: return (
        <React.Fragment>
          <ChipField id="actividades" label="Actividades posibles en la zona" hint="Podés elegir más de una" full disabled={isPreview}>
            <Chips options={d.actividades} value={vals.actividades} onChange={setVal("actividades")} multi hideCheck />
          </ChipField>
          <Field id="atractivos" label="Atractivos cercanos" optional full>
            <input value={vals.atractivos} onChange={set("atractivos")} placeholder="Parques, bodegas, pueblos, hitos" disabled={isPreview} />
          </Field>
          <ChipField id="demanda" label="Demanda turística de la zona" full disabled={isPreview}>
            <Chips options={d.demanda} value={vals.demanda} onChange={setVal("demanda")} />
          </ChipField>
        </React.Fragment>);

      case 7: return (
        <React.Fragment>
          <ChipField id="modelo" label="Modelo de participación de interés" error={errors.modelo} full disabled={isPreview}>
            <Chips options={d.modelos} value={vals.modelo} onChange={setVal("modelo")} />
          </ChipField>
          <ChipField id="inversion" label="Disponibilidad de inversión" full disabled={isPreview}>
            <Chips options={d.inversion} value={vals.inversion} onChange={setVal("inversion")} />
          </ChipField>
          <ChipField id="horizonte" label="Horizonte temporal" full disabled={isPreview}>
            <Chips options={d.horizontes} value={vals.horizonte} onChange={setVal("horizonte")} />
          </ChipField>
        </React.Fragment>);

      case 8: return (
        <React.Fragment>
          <Field id="comentarios" label="Comentarios" hint="Contanos qué hace único a tu lugar" optional full>
            <textarea value={vals.comentarios} onChange={set("comentarios")} rows="4"
              placeholder="Paisaje, acceso, agua, vistas, historia del lugar… lo que quieras compartir." disabled={isPreview}></textarea>
          </Field>
          <div className="field full">
            <span className="field-label" id="fotos-label">Fotos y documentación <span className="field-opt">Opcional</span></span>
            <button type="button" className="uploader" onClick={() => !isPreview && fileRef.current && fileRef.current.click()} aria-labelledby="fotos-label" disabled={isPreview}>
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onFiles} disabled={isPreview} />
              <Icon name="image-up" />
              <span>Arrastrá o seleccioná fotos del terreno</span>
              <small>Hasta 8 imágenes · JPG o PNG</small>
            </button>
            {files.length > 0 &&
              <div className="thumbs">
                {files.map((f, i) =>
                  <div className="thumb" key={i} style={{ backgroundImage: `url(${f.url})` }}>
                    <button type="button" className="thumb-x" onClick={(e) => { e.stopPropagation(); removeFile(i); }} aria-label={"Quitar " + f.name} disabled={isPreview}><Icon name="x" /></button>
                  </div>
                )}
              </div>
            }
            <p className="field-hint">Las fotos no se guardan en el borrador; volvé a adjuntarlas si recargás la página.</p>
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
              <h3>Gracias, {vals.nombre || "recibimos tu postulación"}.</h3>
              <p>Recibimos la información de tu terreno en {vals.localidad || "tu zona"}{vals.provincia ? ", " + vals.provincia : ""}. Nuestro equipo la revisará y, si avanza, te contactará para conversar sobre su potencial.</p>
              <Button variant="secondary" onClick={reset} disabled={isPreview}>Cargar otra postulación</Button>
            </div> :

            <div className="form-card nm-card">
              {/* progress */}
              <div className="wizard-progress">
                <div className="wizard-progress-meta">
                  <span className="wizard-step-count">Paso {step + 1} de {STEPS.length}</span>
                  <span className="wizard-step-title">{STEPS[step]}</span>
                </div>
                <div className="wizard-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={"Progreso: " + pct + "%"}>
                  <span style={{ width: pct + "%" }}></span>
                </div>
              </div>

              <div className="wizard-panel" ref={panelRef} role="group" aria-label={"Paso " + (step + 1) + ": " + STEPS[step]}>
                {renderStep()}
              </div>

              <div className="wizard-nav">
                <div className="wizard-nav-left">
                  {step > 0 &&
                    <button type="button" className="btn-text" onClick={back} disabled={isPreview}><Icon name="arrow-left" />Atrás</button>
                  }
                </div>
                <div className="wizard-nav-right">
                  {savedAt && <span className="wizard-saved" aria-hidden="true"><Icon name="check" />Borrador guardado</span>}
                  {step < STEPS.length - 1 ?
                    <Button variant="primary" icon="arrow-right" onClick={next} disabled={isPreview}>Continuar</Button> :
                    <Button variant="primary" icon="arrow-right" onClick={submit} disabled={isPreview}>Enviar postulación</Button>}
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>);

}

export { LeadForm };
