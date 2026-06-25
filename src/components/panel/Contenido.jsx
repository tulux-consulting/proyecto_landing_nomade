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
import { useI18n } from '../../lib/i18n/i18nContext.jsx';

const LeadForm = dynamic(() => import('../landing/LeadForm.jsx').then((m) => m.LeadForm), {
  ssr: false,
  loading: () => <Spinner message="Cargando..." size="sm" inline={true} />
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
      { k: "target", label: "ID Destino", hint: "Ej: propietarios, destinos", type: "text" },
      { k: "imagen", label: "Imagen de fondo", type: "image" }
    ] } },
  { key: "destinations", label: "Destinos", icon: "map-pin", desc: "Tipos de paisajes y regiones en exploración.",
    fields: [
      { k: "eyebrow", label: "Eyebrow", type: "text" },
      { k: "h2", label: "Título", type: "text" },
      { k: "lead", label: "Descripción", type: "textarea" },
      { k: "note", label: "Aclaración de Destinos", type: "text" },
      { k: "mapEyebrow", label: "Eyebrow del Carousel", type: "text" },
      { k: "mapH", label: "Título del Carousel", type: "text" },
      { k: "mapLead", label: "Descripción del Carousel", type: "textarea" },
      { k: "disclaimer", label: "Leyenda del Carousel", type: "text" }
    ],
    repeat: { k: "types", label: "Paisaje", plural: "paisajes", item: [{ k: "cap", label: "Nombre del Paisaje", type: "text" }, { k: "img", label: "Imagen", type: "image" }] } },
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
  const { t } = useI18n();
  const labelText = t('cms.fields.' + field.k);
  const resolvedLabel = labelText.startsWith('cms.fields.') ? field.label : labelText;
  
  const hintText = field.hint ? (t('cms.hints.' + field.k).startsWith('cms.hints.') ? field.hint : t('cms.hints.' + field.k)) : undefined;

  if (field.type === "image") {
    return (
      <FField label={resolvedLabel} full hint={hintText}>
        <div className="cms-img-single">
          <ImageManager fotos={value ? [value] : []} max={1} hideCover onChange={(arr) => onChange(arr[0] || "")} />
        </div>
      </FField>
    );
  }
  return (
    <FField label={resolvedLabel} full={field.type === "textarea"} hint={hintText}>
      {field.type === "textarea"
        ? <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows="3" />
        : <input value={value || ""} onChange={(e) => onChange(e.target.value)} />}
    </FField>
  );
}

function CMSSection({ section, data, open, onToggle, onChange }) {
  const { t } = useI18n();
  const titleText = t('cms.sections.' + section.key);
  const resolvedTitle = titleText.startsWith('cms.sections.') ? section.label : titleText;

  const setField = (k, v) => onChange({ ...data, [k]: v });
  const setItem = (rk, i, k, v) => { const arr = (data[rk] || []).slice(); arr[i] = { ...arr[i], [k]: v }; onChange({ ...data, [rk]: arr }); };
  const addItem = (rk, blank) => onChange({ ...data, [rk]: (data[rk] || []).concat([blank]) });
  const removeItem = (rk, i) => onChange({ ...data, [rk]: (data[rk] || []).filter((_, x) => x !== i) });

  const summary = () => {
    if (section.repeat) {
      const n = (data[section.repeat.k] || []).length;
      
      let lbl = section.repeat.label;
      if (section.repeat.k === "points") {
        lbl = n === 1 ? t('cms.repeat.point') : t('cms.repeat.points');
      } else if (section.repeat.k === "pillars") {
        lbl = n === 1 ? t('cms.repeat.pillar') : t('cms.repeat.pillars');
      } else if (section.repeat.k === "options") {
        lbl = n === 1 ? t('cms.repeat.option') : t('cms.repeat.options');
      } else if (section.repeat.k === "types") {
        lbl = n === 1 ? t('cms.repeat.landscape') : t('cms.repeat.landscapes');
      } else if (section.repeat.k === "steps") {
        lbl = n === 1 ? t('cms.repeat.step') : t('cms.repeat.steps');
      } else if (section.repeat.k === "value") {
        lbl = n === 1 ? t('cms.repeat.value') : t('cms.repeat.values');
      }
      return n + " " + lbl;
    }
    
    const descText = t('cms.sectionDescs.' + section.key);
    const resolvedDesc = descText.startsWith('cms.sectionDescs.') ? section.desc : descText;

    const first = section.fields[0];
    if (!data[first.k]) return resolvedDesc;
    const str = String(data[first.k]);
    const dotIndex = str.indexOf('.');
    if (dotIndex !== -1) {
      return str.slice(0, dotIndex + 1);
    }
    return str.slice(0, 44);
  };

  const isSecondSubSec = (k) => ["mapEyebrow", "mapH", "mapLead", "disclaimer"].includes(k);

  const getAddBtnLabel = () => {
    let lbl = section.repeat.label;
    if (section.repeat.k === "points") {
      lbl = t('cms.repeat.point');
    } else if (section.repeat.k === "pillars") {
      lbl = t('cms.repeat.pillar');
    } else if (section.repeat.k === "options") {
      lbl = t('cms.repeat.option');
    } else if (section.repeat.k === "types") {
      lbl = t('cms.repeat.landscape');
    } else if (section.repeat.k === "steps") {
      lbl = t('cms.repeat.step');
    } else if (section.repeat.k === "value") {
      lbl = t('cms.repeat.value');
    }
    return t('cms.editor.add') + " " + lbl.toLowerCase();
  };

  return (
    <div className={"cms-section" + (open ? " open" : "")}>
      <div className="cms-section-head" onClick={onToggle}>
        <span className="cms-ic"><Icon name={section.icon} /></span>
        <div><h3>{resolvedTitle}</h3><p className="cms-meta">{summary()}</p></div>
        <span className="cms-chevron"><Icon name="chevron-down" /></span>
      </div>
      {open && (
        <div className="cms-body">
          {section.images && section.images.map((im) => {
            const imLabelText = t('cms.fields.' + im.k);
            const resolvedImLabel = imLabelText.startsWith('cms.fields.') ? im.label : imLabelText;
            const imHintText = im.hint ? (t('cms.hints.' + im.k).startsWith('cms.hints.') ? im.hint : t('cms.hints.' + im.k)) : undefined;
            // The schema declares k: "imagen" but the data uses 'img' for experience and landowners. Let's resolve the exact data key.
            const dataKey = (im.k === "imagen" && (data.img !== undefined || section.key === "experience" || section.key === "landowners")) ? "img" : im.k;
            const imgValue = data[dataKey] || data[im.k] || "";
            return (
              <FField key={im.k} label={resolvedImLabel} full hint={imHintText}>
                <div className="cms-img-single">
                  <ImageManager fotos={imgValue ? [imgValue] : []} max={1} hideCover onChange={(arr) => setField(dataKey, arr[0] || "")} />
                </div>
              </FField>
            );
          })}
          {section.fields.length > 0 && (
            <div className="f-grid">
              {section.fields.filter(f => !isSecondSubSec(f.k)).map((f) => 
                <CMSField key={f.k} field={f} value={data[f.k]} onChange={(v) => setField(f.k, v)} />
              )}
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
                {getAddBtnLabel()}
              </Btn>
            </div>
          )}
          {section.fields.length > 0 && section.fields.some(f => isSecondSubSec(f.k)) && (
            <div className="cms-second-section-divider" style={{ borderTop: "1px solid var(--line)", margin: "24px 0 16px" }} />
          )}
          {section.fields.length > 0 && section.fields.some(f => isSecondSubSec(f.k)) && (
            <div className="f-grid">
              {section.fields.filter(f => isSecondSubSec(f.k)).map((f) => 
                <CMSField key={f.k} field={f} value={data[f.k]} onChange={(v) => setField(f.k, v)} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Contenido({ onToast }) {
  const { t, locale } = useI18n();
  useStore();
  useLucide();
  const [savedContent, setSavedContent] = useState(null);
  const [draft, setDraft] = useState(null);
  const [openKey, setOpenKey] = useState("hero");
  const [editingLocale, setEditingLocale] = useState('es');
  const [actionBusy, setActionBusy] = useState(false);
  const previewRef = useRef(null);

  // Sync editingLocale to user's selected UI locale on mount
  useEffect(() => {
    if (locale === 'es' || locale === 'en') {
      setEditingLocale(locale);
    }
  }, [locale]);

  useEffect(() => {
    ContenidoRepository.getDraft(editingLocale).then((data) => {
      setSavedContent(data);
      setDraft(data);
    });
  }, [editingLocale]);

  if (!draft) {
    return <Spinner message={t('common.actions.loading')} />;
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(savedContent);
  const setSection = (key, data) => setDraft((d) => ({ ...d, [key]: data }));

  const toggle = (key) => {
    if (actionBusy) return;
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
    if (actionBusy) return;
    setActionBusy(true);
    try {
      const updated = await ContenidoRepository.updateDraft(draft, editingLocale);
      setSavedContent(updated);
      onToast(t('cms.toasts.draftSaved'));
    } catch (e) {
      onToast(t('cms.toasts.draftError'));
    } finally {
      setActionBusy(false);
    }
  };

  const publish = async () => {
    if (actionBusy) return;
    setActionBusy(true);
    try {
      const updated = await ContenidoRepository.publish(draft, editingLocale);
      setSavedContent(updated);
      onToast(t('cms.toasts.published'));
    } catch (e) {
      onToast(t('cms.toasts.publishError'));
    } finally {
      setActionBusy(false);
    }
  };

  const discard = () => {
    if (actionBusy) return;
    setActionBusy(true);
    try {
      setDraft(savedContent);
      onToast(t('cms.toasts.discarded'));
    } finally {
      setActionBusy(false);
    }
  };

  return (
    <div className="main-inner">
      <ModuleHead eyebrow={locale === 'en' ? "Module" : "Módulo"} title={t('cms.title')}
        desc={t('cms.desc')} />

      <div className="cms-split">
        <div className="cms-editor" style={{ position: 'relative' }}>
          {actionBusy && (
            <div className="cms-overlay-spinner" style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(var(--bg-rgb, 255, 255, 255), 0.6)',
              backdropFilter: 'blur(1px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-lg)'
            }}>
              <Spinner message={t('common.actions.loading')} size="lg" />
            </div>
          )}
          <div className="cms-actionbar" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px', pointerEvents: actionBusy ? 'none' : 'auto', opacity: actionBusy ? 0.7 : 1 }}>
            <div className="cms-lang-select" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '16px' }}>
              <span style={{ fontSize: '13px', color: 'var(--fg3)', fontWeight: '500' }}>{t('cms.editor.editingLanguage')}:</span>
              <select 
                value={editingLocale} 
                onChange={(e) => setEditingLocale(e.target.value)}
                disabled={actionBusy}
                style={{ background: 'var(--bg2)', border: '1px solid var(--line)', color: 'var(--fg1)', borderRadius: '4px', padding: '4px 8px', fontSize: '13px', cursor: actionBusy ? 'not-allowed' : 'pointer' }}
              >
                <option value="es">Español (ES)</option>
                <option value="en">English (EN)</option>
              </select>
            </div>
            {dirty
              ? <span className="cms-dirty"><Icon name="dot" />{t('cms.editor.unsaved')}</span>
              : <span className="cms-saved"><Icon name="check-circle-2" />{t('cms.editor.saved')}</span>}
            <div className="toolbar-spacer" style={{ flex: 1 }}></div>
            <div className="cms-actionbar-buttons" style={{ display: 'flex', gap: '8px' }}>
              <Btn variant="ghost" sm onClick={discard} disabled={actionBusy} title={t('cms.toasts.discarded')}>{t('cms.editor.discard')}</Btn>
              <Btn variant="ghost" sm onClick={saveDraft} disabled={actionBusy} title={t('cms.editor.saveDraft')}>{t('cms.editor.saveDraft')}</Btn>
              <Btn variant="primary" sm onClick={publish} disabled={actionBusy} title={t('cms.toasts.published')}>{t('cms.editor.publish')}</Btn>
            </div>
          </div>
          <div style={{ pointerEvents: actionBusy ? 'none' : 'auto', opacity: actionBusy ? 0.6 : 1 }}>
            {CMS_SCHEMA.map((s) => (
              <CMSSection key={s.key} section={s} data={draft[s.key] || {}} open={openKey === s.key}
                onToggle={() => toggle(s.key)} onChange={(data) => setSection(s.key, data)} />
            ))}
          </div>
        </div>

        <div className="cms-preview-wrap">
          <div className="cms-preview-head">
            <span className="dot"><i></i><i></i><i></i></span>
            <span>{t('cms.preview.title')} · {t('cms.preview.url')}</span>
          </div>
          <div className="cms-preview" ref={previewRef} style={{ background: 'var(--bg)' }}>
            <Hero d={draft.hero} />
            <WhatIs d={draft.whatis} />
            <Experience d={draft.experience} />
            <Split d={draft.split} />
            <Destinations d={draft.destinations} isPreview={true} />
            <Model d={draft.model} />
            <Landowners d={draft.landowners} />
            <Process d={draft.process} />
            <LeadForm d={NOMADE[editingLocale].form} isPreview={true} />
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
