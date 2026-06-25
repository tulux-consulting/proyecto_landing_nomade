import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon.jsx';
import { resolveImg } from './Helpers.jsx';
import { showToast } from './Feedback.jsx';
import { useI18n } from '../../../lib/i18n/i18nContext.jsx';

export function PhotoGallery({ fotos, empty }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(-1);
  const list = (fotos || []).filter(Boolean);
  useEffect(() => {
    if (open < 0) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(-1);
      if (e.key === "ArrowRight") setOpen((i) => (i + 1) % list.length);
      if (e.key === "ArrowLeft") setOpen((i) => (i - 1 + list.length) % list.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, list.length]);

  if (list.length === 0) {
    return <div className="empty" style={{ padding: "40px 20px" }}><span className="empty-ic"><Icon name="image-off" /></span><h3>{t('common.postulaciones.modal.gallery.noPhotos')}</h3><p>{empty || t('common.postulaciones.modal.gallery.noPhotosDesc')}</p></div>;
  }
  return (
    <React.Fragment>
      <div className={"photo-grid" + (list.length === 1 ? " solo" : "")}>
        {list.map((f, i) => (
          <button key={i} className="photo-thumb" style={{ backgroundImage: "url(" + resolveImg(f) + ")" }} onClick={() => setOpen(i)} aria-label={"Ver foto " + (i + 1)}></button>
        ))}
      </div>
      {open >= 0 && (
        <div className="lightbox" onClick={() => setOpen(-1)}>
          <button className="lightbox-close" onClick={(e) => { e.stopPropagation(); setOpen(-1); }} aria-label="Cerrar"><Icon name="x" /></button>
          {list.length > 1 && <button className="lightbox-nav prev" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + list.length) % list.length); }} aria-label="Anterior"><Icon name="chevron-left" /></button>}
          <img src={resolveImg(list[open])} alt="" onClick={(e) => e.stopPropagation()} />
          {list.length > 1 && <button className="lightbox-nav next" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % list.length); }} aria-label="Siguiente"><Icon name="chevron-right" /></button>}
          <span className="lightbox-count">{open + 1} / {list.length}</span>
        </div>
      )}
    </React.Fragment>
  );
}

const CURATED_IMG = ["1501785888041-af3ef285b470", "1470071459604-3b5ec3a7fe05", "1500382017468-9049fed747ef", "1426604966848-d7adac402bff", "1454496522488-7a8e488e8606", "1469474968028-56623f02e42e", "1472396961693-142e6e269027", "1433086966358-54859d0ed716", "1518495973542-4542c06a5843", "1441974231531-c6227db76b6e"];

export function ImageManager({ fotos, onChange, max, hideCover }) {
  const { t } = useI18n();
  const list = (fotos || []).filter(Boolean);
  const [url, setUrl] = useState("");
  const [over, setOver] = useState(false);
  const fileRef = useRef(null);
  const limit = max || 12;
  const add = (v) => { if (v && list.length < limit && list.indexOf(v) < 0) onChange(list.concat([v])); };
  const removeAt = (i) => onChange(list.filter((_, x) => x !== i));
  const handleFiles = (files) => {
    const arr = Array.from(files || []);
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

    if (hasInvalidType) {
      showToast("Error: Formato de archivo no admitido (debe ser imagen).");
    }
    if (hasInvalidSize) {
      showToast("Error: La imagen excede el límite de 50MB.");
    }

    let next = list.slice();
    let pending = validFiles.length;
    if (!pending) return;
    validFiles.forEach((f) => {
      const r = new FileReader();
      r.onload = () => { next = next.concat([r.result]).slice(0, limit); pending--; if (pending === 0) onChange(next); };
      r.readAsDataURL(f);
    });
  };
  return (
    <div className="imgmgr">
      <div className="imgmgr-grid">
        {list.map((f, i) => (
          <div key={i} className="imgmgr-item" style={{ backgroundImage: "url(" + resolveImg(f) + ")" }}>
            {i === 0 && !hideCover && <span className="imgmgr-cover">{t('common.imageManager.cover')}</span>}
            <button className="imgmgr-x" onClick={() => removeAt(i)} aria-label="Quitar foto"><Icon name="trash-2" /></button>
          </div>
        ))}
        {list.length < limit && (
          <div className={"imgmgr-drop" + (over ? " over" : "")} onClick={() => fileRef.current && fileRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
            onDrop={(e) => { e.preventDefault(); setOver(false); handleFiles(e.dataTransfer.files); }}>
            <Icon name="image-plus" />
            <span>{t('common.imageManager.dropTextLine1')}<br />{t('common.imageManager.dropTextLine2')}</span>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => handleFiles(e.target.files)} />
          </div>
        )}
      </div>
      <div className="imgmgr-url">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t('common.imageManager.urlPlaceholder')} style={{ flex: 1, fontFamily: "var(--sans)", fontSize: 13.5, color: "var(--fg1)", background: "var(--bg-raised)", border: "1px solid var(--line-strong)", borderRadius: "var(--radius-md)", padding: "10px 13px", outline: "none" }}
          onKeyDown={(e) => { if (e.key === "Enter") { add(url.trim()); setUrl(""); } }} />
        <button type="button" className="btn-bo btn-ghost-bo btn-sm" onClick={() => { add(url.trim()); setUrl(""); }}>
          <Icon name="plus" />{t('common.imageManager.addBtn')}
        </button>
      </div>
      <div>
        <p className="muted" style={{ fontSize: 12, margin: "0 0 7px" }}>{t('common.imageManager.exampleGallery')}</p>
        <div className="imgmgr-gallery">
          {CURATED_IMG.filter((g) => list.indexOf(g) < 0).slice(0, 8).map((g) => (
            <button key={g} style={{ backgroundImage: "url(" + resolveImg(g) + ")" }} onClick={() => add(g)} aria-label={t('common.imageManager.addFromGallery')}></button>
          ))}
        </div>
      </div>
    </div>
  );
}
