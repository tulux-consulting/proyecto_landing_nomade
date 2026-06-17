import React, { useState, useEffect, useRef } from 'react';
import { BO } from '../../lib/store.js';
import { ContenidoRepository } from '../../repositories/index.ts';
import { Hero, WhatIs, Experience, Split } from '../landing/Sections1.jsx';
import { Destinations, Model } from '../landing/Sections2.jsx';
import { Landowners, Process } from '../landing/Sections3.jsx';
import { Partners, FutureGuests, Footer } from '../landing/Sections4.jsx';
import { Icon, useLucide, useStore, Btn, ModuleHead, FField, ImageManager, Spinner } from './ui.jsx';
import dynamic from 'next/dynamic';
import { NOMADE } from '../../data/content.js';

const LeadForm = dynamic(() => import('../landing/LeadForm.jsx').then((m) => m.LeadForm), {
  ssr: false,
  loading: () => <Spinner message="Cargando formulario..." size="sm" inline={true} />
});

// ============================================================
// NÓMADE — Módulo Contenido del sitio (CMS).
// Administra TEXTOS e IMÁGENES reales de la landing.
// ============================================================

const CMS_SCHEMA = [
  { key: "hero", label: "Hero", icon: "panels-top-left", desc: "El encabezado principal de la portada.",
    images: [{ k: "imagen", label: "Imagen de fondo", hint: "Foto a pantalla completa detrás del título." }],
    fields: [
      { k: "eyebrow", label: "Eyebrow", type: "text" },
      { k: "titulo", label: "Título", type: "text" },
      { k: "subtitulo", label: "Subtítulo", type: "text" },
      { k: "lead", label: "Texto de apoyo", type: "textarea" },
      { k: "cta", label: "Texto del botón", type: "text" }
    ] },
  { key: "whatis", label: "Qué es NÓMADE", icon: "compass", desc: "Introducción y pilares clave.",
    fields: [
      { k: "eyebrow", label: "Eyebrow", type: "text" },
      { k: "h2", label: "Título", type: "text" },
      { k: "lead", label: "Descripción corta", type: "textarea" }
    ],
    repeat: { k: "points", label: "Punto de Valor", item: [{ k: "icon", label: "Icono (ej. compass, map, waypoints)", type: "text" }, { k: "h", label: "Título", type: "text" }, { k: "p", label: "Descripción", type: "textarea" }] } },
  { key: "experience", label: "La Experiencia", icon: "sparkles", desc: "Pilares del diseño y bienestar.",
    images: [{ k: "imagen", label: "Imagen de la derecha", hint: "Foto que acompaña los pilares." }],
    fields: [
      { k: "eyebrow", label: "Eyebrow", type: "text" },
      { k: "h2", label: "Título", type: "text" },
      { k: "lead", label: "Descripción", type: "textarea" }
    ],
    repeat: { k: "pillars", label: "Experiencia", plural: "experiencias", item: [{ k: "icon", label: "Icono", type: "text" }, { k: "h", label: "Título", type: "text" }, { k: "p", label: "Descripción", type: "textarea" }] } },
  { key: "split", label: "Sección de Bifurcación (Split)", icon: "route", desc: "Decisión del visitante (Propietarios vs Huéspedes).",
    fields: [
      { k: "eyebrow", label: "Eyebrow", type: "text" },
      { k: "h2", label: "Título", type: "text" },
      { k: "lead", label: "Descripción", type: "textarea" }
    ],
    repeat: { k: "options", label: "Opción", plural: "opciones", item: [
      { k: "kicker", label: "Etiqueta superior (Kicker)", type: "text" },
      { k: "h", label: "Título", type: "text" },
      { k: "p", label: "Descripción", type: "textarea" },
      { k: "cta", label: "Texto del botón", type: "text" },
      { k: "target", label: "ID Destino (ej: propietarios, destinos)", type: "text" },
      { k: "imagen", label: "Imagen de fondo (ID o URL)", type: "text" }
    ] } },
  { key: "destinations", label: "Destinos", icon: "map-pin", desc: "Tipos de paisajes y regiones en exploración.",
    images: [{ k: "terrain", label: "Imagen del mapa", hint: "Mapa de fondo." }],
    fields: [
      { k: "eyebrow", label: "Eyebrow", type: "text" },
      { k: "h2", label: "Título", type: "text" },
      { k: "lead", label: "Descripción", type: "textarea" },
      { k: "mapEyebrow", label: "Eyebrow del Mapa", type: "text" },
      { k: "mapH", label: "Título del Mapa", type: "text" },
      { k: "mapLead", label: "Descripción del Mapa", type: "textarea" },
      { k: "disclaimer", label: "Leyenda del Mapa", type: "text" },
      { k: "note", label: "Aclaración de Destinos", type: "text" }
    ] },
  { key: "model", label: "El Modelo", icon: "share-2", desc: "Ecuación de valor.",
    fields: [
      { k: "eyebrow", label: "Eyebrow", type: "text" },
      { k: "h2", label: "Título", type: "text" },
      { k: "lead", label: "Descripción", type: "textarea" }
    ] },
  { key: "landowners", label: "Propietarios", icon: "home", desc: "Opciones de postulación de tierras.",
    images: [{ k: "imagen", label: "Imagen representativa", hint: "Foto de la cabaña." }],
    fields: [
      { k: "eyebrow", label: "Eyebrow", type: "text" },
      { k: "h2", label: "Título", type: "text" },
      { k: "lead", label: "Descripción", type: "textarea" },
      { k: "cta", label: "Texto del botón", type: "text" }
    ] },
  { key: "process", label: "El Proceso", icon: "route", desc: "Pasos de selección del terreno.",
    fields: [
      { k: "eyebrow", label: "Eyebrow", type: "text" },
      { k: "h2", label: "Título", type: "text" },
      { k: "lead", label: "Descripción", type: "textarea" }
    ],
    repeat: { k: "steps", label: "Paso", item: [{ k: "n", label: "Número (ej. 01)", type: "text" }, { k: "icon", label: "Icono", type: "text" }, { k: "h", label: "Título", type: "text" }, { k: "p", label: "Descripción", type: "textarea" }] } },
  { key: "partners", label: "Partners", icon: "handshake", desc: "Sección para operadores del rubro.",
    fields: [
      { k: "eyebrow", label: "Eyebrow", type: "text" },
      { k: "h2", label: "Título", type: "text" },
      { k: "lead", label: "Descripción", type: "textarea" },
      { k: "cta", label: "Texto del botón", type: "text" }
    ],
    repeat: { k: "value", label: "Valor de Alianza", item: [{ k: "h", label: "Título", type: "text" }, { k: "p", label: "Descripción", type: "textarea" }] } },
  { key: "guests", label: "Lista de Espera", icon: "users", desc: "Sección de suscripción para huéspedes.",
    fields: [
      { k: "eyebrow", label: "Eyebrow", type: "text" },
      { k: "h2", label: "Título", type: "text" },
      { k: "lead", label: "Descripción", type: "textarea" },
      { k: "placeholder", label: "Placeholder del Email", type: "text" },
      { k: "cta", label: "Texto del botón", type: "text" },
      { k: "success", label: "Mensaje de éxito", type: "text" },
      { k: "note", label: "Aclaración final", type: "text" }
    ] },
  { key: "footer", label: "Footer", icon: "panel-bottom", desc: "Pie de página de la landing.",
    fields: [
      { k: "tagline", label: "Tagline", type: "textarea" },
      { k: "copyright", label: "Copyright", type: "text" }
    ] }
];

function CMSField({ field, value, onChange }) {
  return (
    <FField label={field.label} full={field.type === "textarea"}>
      {field.type === "textarea"
        ? <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows="3" />
        : <input value={value || ""} onChange={(e) => onChange(e.target.value)} />}
    </FField>
  );
}

function CMSSection({ section, data, open, onToggle, onChange }) {
  const setField = (k, v) => onChange({ ...data, [k]: v });
  const setItem = (rk, i, k, v) => { const arr = (data[rk] || []).slice(); arr[i] = { ...arr[i], [k]: v }; onChange({ ...data, [rk]: arr }); };
  const addItem = (rk, blank) => onChange({ ...data, [rk]: (data[rk] || []).concat([blank]) });
  const removeItem = (rk, i) => onChange({ ...data, [rk]: (data[rk] || []).filter((_, x) => x !== i) });

  const summary = () => {
    if (section.repeat) {
      const n = (data[section.repeat.k] || []).length;
      const lbl = section.repeat.plural || section.repeat.label || section.label;
      return n + " " + lbl.toLowerCase();
    }
    const first = section.fields[0];
    if (!data[first.k]) return section.desc;
    const str = String(data[first.k]);
    const dotIndex = str.indexOf('.');
    if (dotIndex !== -1) {
      return str.slice(0, dotIndex + 1);
    }
    return str.slice(0, 44);
  };

  return (
    <div className={"cms-section" + (open ? " open" : "")}>
      <div className="cms-section-head" onClick={onToggle}>
        <span className="cms-ic"><Icon name={section.icon} /></span>
        <div><h3>{section.label}</h3><p className="cms-meta">{summary()}</p></div>
        <span className="cms-chevron"><Icon name="chevron-down" /></span>
      </div>
      {open && (
        <div className="cms-body">
          {section.images && section.images.map((im) => (
            <FField key={im.k} label={im.label} full hint={im.hint}>
              <div className="cms-img-single">
                <ImageManager fotos={data[im.k] ? [data[im.k]] : []} max={1} hideCover onChange={(arr) => setField(im.k, arr[0] || "")} />
              </div>
            </FField>
          ))}
          {section.fields.length > 0 && (
            <div className="f-grid">
              {section.fields.map((f) => <CMSField key={f.k} field={f} value={data[f.k]} onChange={(v) => setField(f.k, v)} />)}
            </div>
          )}
          {section.repeat && (
            <div className="cms-repeat">
              {(data[section.repeat.k] || []).map((it, i) => (
                <div className="cms-item" key={i}>
                  <button className="cms-item-x" onClick={() => removeItem(section.repeat.k, i)} aria-label="Quitar"><Icon name="x" /></button>
                  <div className="f-grid">
                    {section.repeat.item.map((f) => <CMSField key={f.k} field={f} value={it[f.k]} onChange={(v) => setItem(section.repeat.k, i, f.k, v)} />)}
                  </div>
                </div>
              ))}
              <Btn variant="ghost" icon="plus" sm onClick={() => addItem(section.repeat.k, Object.fromEntries(section.repeat.item.map((f) => [f.k, ""])))}>
                Añadir {section.repeat.label.toLowerCase()}
              </Btn>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Contenido({ onToast }) {
  useStore();
  useLucide();
  const [savedContent, setSavedContent] = useState(null);
  const [draft, setDraft] = useState(null);
  const [openKey, setOpenKey] = useState("hero");
  const previewRef = useRef(null);

  useEffect(() => {
    ContenidoRepository.getDraft().then((data) => {
      setSavedContent(data);
      setDraft(data);
    });
  }, []);

  if (!draft) {
    return <Spinner message="Cargando contenido..." />;
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(savedContent);
  const setSection = (key, data) => setDraft((d) => ({ ...d, [key]: data }));

  const toggle = (key) => {
    const next = openKey === key ? null : key;
    setOpenKey(next);
    if (next) scrollPreview(next);
  };

  const scrollPreview = (key) => {
    const cont = previewRef.current;
    if (!cont) return;
    const targetId = key === "hero" ? "top" :
                     key === "split" ? "explorar" :
                     key === "experience" ? "experiencia" :
                     key === "process" ? "proceso" :
                     key === "partners" ? "socios" :
                     key === "guests" ? "huespedes" :
                     key === "footer" ? "footer" :
                     key === "whatis" ? "que-es" :
                     key === "destinations" ? "destinos" :
                     key === "model" ? "modelo" :
                     key === "landowners" ? "propietarios" :
                     key;
    const el = cont.querySelector("#" + targetId);
    if (el) cont.scrollTo({ top: Math.max(0, el.offsetTop - 8), behavior: "smooth" });
  };

  const saveDraft = async () => {
    try {
      const updated = await ContenidoRepository.updateDraft(draft);
      setSavedContent(updated);
      onToast("Borrador guardado correctamente.");
    } catch (e) {
      onToast("Error al guardar borrador.");
    }
  };

  const publish = async () => {
    try {
      const updated = await ContenidoRepository.publish(draft);
      setSavedContent(updated);
      onToast("Contenido publicado en la landing.");
    } catch (e) {
      onToast("Error al publicar contenido.");
    }
  };

  const discard = () => {
    setDraft(savedContent);
    onToast("Cambios descartados.");
  };

  return (
    <div className="main-inner">
      <ModuleHead eyebrow="Módulo" title="Contenido del sitio"
        desc="Editá los textos y las imágenes de la landing. La vista previa de la derecha refleja tus cambios al instante; «Publicar» los deja en línea." />

      <div className="cms-split">
        <div className="cms-editor">
          <div className="cms-actionbar">
            {dirty
              ? <span className="cms-dirty"><Icon name="dot" />Cambios sin guardar</span>
              : <span className="cms-saved"><Icon name="check-circle-2" />Todo guardado/publicado</span>}
            <div style={{ display: "flex", gap: 9 }}>
              <Btn variant="ghost" sm onClick={discard} title="Descartar cambios">Descartar</Btn>
              <Btn variant="ghost" sm onClick={saveDraft} title="Guardar borrador sin publicar">Guardar Borrador</Btn>
              <Btn variant="primary" icon="upload-cloud" sm onClick={publish}>Publicar</Btn>
            </div>
          </div>
          {CMS_SCHEMA.map((s) => (
            <CMSSection key={s.key} section={s} data={draft[s.key] || {}} open={openKey === s.key}
              onToggle={() => toggle(s.key)} onChange={(data) => setSection(s.key, data)} />
          ))}
        </div>

        <div className="cms-preview-wrap">
          <div className="cms-preview-head">
            <span className="dot"><i></i><i></i><i></i></span>
            <span>Vista previa · nomade.com</span>
          </div>
          <div className="cms-preview" ref={previewRef} style={{ background: 'var(--bg)' }}>
            <Hero d={draft.hero} />
            <WhatIs d={draft.whatis} />
            <Experience d={draft.experience} />
            <Split d={draft.split} />
            <Destinations d={draft.destinations} />
            <Model d={draft.model} />
            <Landowners d={draft.landowners} />
            <Process d={draft.process} />
            <LeadForm d={NOMADE.form} isPreview={true} />
            <Partners d={draft.partners} onCta={() => {}} onPartner={() => {}} />
            <FutureGuests d={draft.guests} />
            <Footer d={draft.footer} />
          </div>
        </div>
      </div>
    </div>
  );
}

export { Contenido };
