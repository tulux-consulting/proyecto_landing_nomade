import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BO } from '../../lib/store.js';
import { Icon, useLucide, useStore, fmtDate, relDays, resolveImg, Badge, Tag, TagRow, ModuleHead, Search, Select, Btn, DataTable, Pagination, Empty, Drawer, DRow, DGroup, StatusChanger, Notes, Modal, FField, BarChart, showToast, ToastHost, DetailModal, DxCell, DxGrid, DxSection, PhotoGallery, ImageManager, Confirm, SearchableSelect, Toggle, useListController, STATUS_CLASS, STATUS_HUE } from './ui.jsx';

// ============================================================
// NÓMADE — Módulo Contenido del sitio (CMS real).
// Administra TEXTOS e IMÁGENES de la landing, con vista previa
// en vivo al costado. Editás a la izquierda, ves el cambio a la
// derecha al instante; «Publicar» guarda todo en el store.
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
  { key: "beneficios", label: "Beneficios", icon: "sparkles", desc: "Los pilares de la experiencia NÓMADE.",
    images: [{ k: "imagen", label: "Imagen de la sección", hint: "Foto ambiental que acompaña los pilares." }],
    fields: [{ k: "eyebrow", label: "Eyebrow", type: "text" }, { k: "titulo", label: "Título", type: "text" }],
    repeat: { k: "items", label: "Beneficio", item: [{ k: "h", label: "Título", type: "text" }, { k: "p", label: "Descripción", type: "textarea" }] } },
  { key: "comoFunciona", label: "Cómo funciona", icon: "route", desc: "El proceso de selección, paso a paso.",
    fields: [{ k: "eyebrow", label: "Eyebrow", type: "text" }, { k: "titulo", label: "Título", type: "text" }],
    repeat: { k: "pasos", label: "Paso", item: [{ k: "h", label: "Título", type: "text" }, { k: "p", label: "Descripción", type: "textarea" }] } },
  { key: "estadisticas", label: "Estadísticas", icon: "bar-chart-3", desc: "Cifras que cuentan la red en formación.",
    fields: [{ k: "eyebrow", label: "Eyebrow", type: "text" }],
    repeat: { k: "items", label: "Dato", item: [{ k: "valor", label: "Valor", type: "text" }, { k: "label", label: "Etiqueta", type: "text" }] } },
  { key: "faqs", label: "FAQs", icon: "messages-square", desc: "Preguntas frecuentes.",
    fields: [{ k: "eyebrow", label: "Eyebrow", type: "text" }, { k: "titulo", label: "Título", type: "text" }],
    repeat: { k: "items", label: "Pregunta", item: [{ k: "q", label: "Pregunta", type: "text" }, { k: "a", label: "Respuesta", type: "textarea" }] } },
  { key: "contacto", label: "Información de contacto", icon: "mail", desc: "Cómo te encuentran.",
    fields: [{ k: "email", label: "Email", type: "text" }, { k: "telefono", label: "Teléfono", type: "text" }, { k: "direccion", label: "Ubicación", type: "text" }] },
  { key: "redes", label: "Redes sociales", icon: "share-2", desc: "Enlaces a tus perfiles.",
    fields: [{ k: "instagram", label: "Instagram", type: "text" }, { k: "linkedin", label: "LinkedIn", type: "text" }, { k: "whatsapp", label: "WhatsApp", type: "text" }] },
  { key: "footer", label: "Footer", icon: "panel-bottom", desc: "Pie de página de la landing.",
    fields: [{ k: "tagline", label: "Bajada de marca", type: "textarea" }, { k: "copyright", label: "Copyright", type: "text" }] }
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
    if (section.repeat) { const n = (data[section.repeat.k] || []).length; return n + " " + section.label.toLowerCase() + (n === 1 ? "" : "s"); }
    const first = section.fields[0];
    return data[first.k] ? String(data[first.k]).slice(0, 44) : section.desc;
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

// ---------- live preview de la landing ----------
function LandingPreview({ c, flash }) {
  const hero = c.hero || {}, ben = c.beneficios || {}, cf = c.comoFunciona || {}, st = c.estadisticas || {}, faq = c.faqs || {}, ft = c.footer || {}, ct = c.contacto || {};
  const heroBg = hero.imagen ? resolveImg(hero.imagen) : "";
  const benImg = ben.imagen ? resolveImg(ben.imagen) : "";
  const sec = (key, cls, children) => <section id={"lp-" + key} className={"lp-sec " + (cls || "") + (flash === key ? " flash" : "")}>{children}</section>;
  return (
    <div className="lp">
      <section id="lp-hero" className={"lp-hero" + (flash === "hero" ? " flash" : "")} style={heroBg ? { backgroundImage: "url(" + heroBg + ")" } : null}>
        {hero.eyebrow && <p className="lp-eyebrow">{hero.eyebrow}</p>}
        <h2 className="lp-h">{hero.titulo || "Título del hero"}</h2>
        {hero.subtitulo && <p className="lp-sub">{hero.subtitulo}</p>}
        {hero.lead && <p className="lp-lead">{hero.lead}</p>}
        {hero.cta && <span className="lp-btn">{hero.cta}<Icon name="arrow-right" style={{ width: 14, height: 14 }} /></span>}
      </section>

      {sec("beneficios", "lp-forest", <React.Fragment>
        {ben.eyebrow && <p className="lp-eyebrow">{ben.eyebrow}</p>}
        <h3 className="lp-h lp-h-lg">{ben.titulo || "Beneficios"}</h3>
        {benImg && <div className="lp-img" style={{ backgroundImage: "url(" + benImg + ")" }}></div>}
        <div className="lp-grid">
          {(ben.items || []).map((it, i) => <div key={i}><p className="lp-item-h">{it.h}</p><p className="lp-item-p">{it.p}</p></div>)}
        </div>
      </React.Fragment>)}

      {sec("comoFunciona", "", <React.Fragment>
        {cf.eyebrow && <p className="lp-eyebrow">{cf.eyebrow}</p>}
        <h3 className="lp-h lp-h-lg">{cf.titulo || "Cómo funciona"}</h3>
        <div className="lp-steps">
          {(cf.pasos || []).map((p, i) => <div className="lp-step" key={i}><b>{p.h}</b><p>{p.p}</p></div>)}
        </div>
      </React.Fragment>)}

      {sec("estadisticas", "lp-sand", <React.Fragment>
        {st.eyebrow && <p className="lp-eyebrow">{st.eyebrow}</p>}
        <div className="lp-stats">
          {(st.items || []).map((it, i) => <div className="lp-stat" key={i}><b>{it.valor}</b><span>{it.label}</span></div>)}
        </div>
      </React.Fragment>)}

      {sec("faqs", "", <React.Fragment>
        {faq.eyebrow && <p className="lp-eyebrow">{faq.eyebrow}</p>}
        <h3 className="lp-h lp-h-lg" style={{ marginBottom: 8 }}>{faq.titulo || "Preguntas frecuentes"}</h3>
        {(faq.items || []).map((it, i) => <div className="lp-faq" key={i}><b>{it.q}</b><p>{it.a}</p></div>)}
      </React.Fragment>)}

      <footer id="lp-contacto" className={"lp-foot" + (flash === "contacto" || flash === "redes" || flash === "footer" ? " flash" : "")}>
        <p className="lp-tag">{ft.tagline}</p>
        <div className="lp-meta">
          {ct.email && <span>{ct.email}</span>}
          {ct.telefono && <span>{ct.telefono}</span>}
          {ct.direccion && <span>{ct.direccion}</span>}
        </div>
        <p className="lp-meta" style={{ marginTop: 12, fontSize: 11 }}>{ft.copyright}</p>
      </footer>
    </div>
  );
}

function Contenido({ onToast }) {
  useStore();
  useLucide();
  const saved = BO.getDoc("contenido", {});
  const [draft, setDraft] = useState(saved);
  const [openKey, setOpenKey] = useState("hero");
  const [flash, setFlash] = useState(null);
  const previewRef = useRef(null);

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const setSection = (key, data) => setDraft((d) => ({ ...d, [key]: data }));

  const toggle = (key) => {
    const next = openKey === key ? null : key;
    setOpenKey(next);
    if (next) scrollPreview(next);
  };
  const scrollPreview = (key) => {
    const cont = previewRef.current;
    if (!cont) return;
    const el = cont.querySelector("#lp-" + (key === "redes" || key === "footer" ? "contacto" : key));
    if (el) cont.scrollTo({ top: Math.max(0, el.offsetTop - 8), behavior: "smooth" });
    setFlash(key === "redes" || key === "footer" ? "contacto" : key);
    setTimeout(() => setFlash((f) => (f === key ? null : f)), 1200);
  };

  const publish = () => { BO.setDoc("contenido", draft); onToast("Contenido publicado en la landing."); };
  const discard = () => { setDraft(saved); onToast("Cambios descartados."); };

  return (
    <div className="main-inner">
      <ModuleHead eyebrow="Módulo" title="Contenido del sitio"
        desc="Editá los textos y las imágenes de la landing. La vista previa de la derecha refleja tus cambios al instante; «Publicar» los deja en línea." />

      <div className="cms-split">
        <div className="cms-editor">
          <div className="cms-actionbar">
            {dirty
              ? <span className="cms-dirty"><Icon name="dot" />Cambios sin publicar</span>
              : <span className="cms-saved"><Icon name="check-circle-2" />Todo publicado</span>}
            <div style={{ display: "flex", gap: 9 }}>
              <Btn variant="ghost" sm onClick={discard} title="Descartar cambios">Descartar</Btn>
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
          <div className="cms-preview" ref={previewRef}>
            <LandingPreview c={draft} flash={flash} />
          </div>
        </div>
      </div>
    </div>
  );
}

export { Contenido };
