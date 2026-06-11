import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { lucideIcon } from '../../lib/lucide.js';
import { BO } from '../../lib/store.js';

// ============================================================
// NÓMADE — Backoffice shared UI primitives.
// Every módulo se arma con estos componentes para garantizar
// consistencia absoluta. Sin lenguaje visual nuevo.
// ============================================================

// --- icons (lucide) ---
// React-safe: lucide replaces the inner <i> with <svg>, but React only owns
// the wrapper <span>, so removing/swapping icon subtrees never desyncs the DOM
// (avoids "removeChild" crashes when drawers/modals toggle).
function Icon({ name, className, style }) {
  const Glyph = lucideIcon(name);
  return (
    <span className={"ic" + (className ? " " + className : "")} style={style} aria-hidden="true">
      <Glyph strokeWidth={1.5} />
    </span>
  );
}
function useLucide(dep) { /* no-op: Icon self-renders its glyph */ }

// --- store hook: re-render on any BO change ---
function useStore() {
  const [, force] = useState(0);
  useEffect(() => BO.subscribe(() => force((n) => n + 1)), []);
}

// --- date helpers ---
function fmtDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
  } catch (e) { return ""; }
}
function relDays(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (diff <= 0) return "hoy";
  if (diff === 1) return "ayer";
  if (diff < 30) return "hace " + diff + " días";
  const m = Math.floor(diff / 30);
  return "hace " + m + (m === 1 ? " mes" : " meses");
}

// --- status → badge class + label ---
const STATUS_CLASS = {
  "Nuevo": "badge-nuevo", "Pendiente de revisión": "badge-pendiente", "Contactado": "badge-contactado",
  "En negociación": "badge-negociacion", "Aprobado": "badge-aprobado", "Rechazado": "badge-rechazado",
  "Disponible": "badge-disponible", "No disponible": "badge-nodisponible"
};
// hue per status (deep enough for white text when used as a fill)
const STATUS_HUE = {
  "Nuevo": "#4f8aa6", "Pendiente de revisión": "#9a7b1c", "Contactado": "#3a64a0",
  "En negociación": "#97653a", "Aprobado": "#37794f", "Rechazado": "#a84b41",
  "Disponible": "#37794f", "No disponible": "#9c958a"
};
function Badge({ status }) {
  return <span className={"badge " + (STATUS_CLASS[status] || "badge-pendiente")}>{status}</span>;
}

// resolve an image value: full URL / asset path / data-blob, else an Unsplash photo id
function resolveImg(v) {
  if (!v) return "";
  if (/^https?:|^assets\/|^data:|^blob:/.test(v)) return v;
  return "https://images.unsplash.com/photo-" + v + "?w=1100&q=80&auto=format&fit=crop";
}

function Tag({ children }) { return <span className="tag">{children}</span>; }
function TagRow({ items, max }) {
  const list = items || [];
  const shown = max ? list.slice(0, max) : list;
  const extra = list.length - shown.length;
  return (
    <span className="tag-row">
      {shown.map((t, i) => <Tag key={i}>{t}</Tag>)}
      {extra > 0 && <Tag>+{extra}</Tag>}
    </span>
  );
}

// --- module header ---
function ModuleHead({ eyebrow, title, desc, actions }) {
  return (
    <div className="mod-head">
      <div className="mod-head-text">
        {eyebrow && <p className="mod-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {desc && <p>{desc}</p>}
      </div>
      {actions && <div className="toolbar" style={{ margin: 0 }}>{actions}</div>}
    </div>
  );
}

// --- search input ---
function Search({ value, onChange, placeholder }) {
  return (
    <div className="search">
      <Icon name="search" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || "Buscar…"} aria-label="Buscar" />
    </div>
  );
}

// --- select (filter / sort) ---
function Select({ value, onChange, options, ariaLabel }) {
  return (
    <div className="selectwrap">
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={ariaLabel}>
        {options.map((o) => {
          const val = typeof o === "string" ? o : o.value;
          const lab = typeof o === "string" ? o : o.label;
          return <option key={val} value={val}>{lab}</option>;
        })}
      </select>
      <Icon name="chevron-down" />
    </div>
  );
}

// --- button ---
function Btn({ variant, icon, iconRight, children, onClick, type, sm, title }) {
  const cls = "btn-bo " + (variant === "primary" ? "btn-primary-bo" : "btn-ghost-bo") + (sm ? " btn-sm" : "");
  return (
    <button className={cls} onClick={onClick} type={type || "button"} title={title}>
      {icon && <Icon name={icon} />}{children}{iconRight && <Icon name={iconRight} />}
    </button>
  );
}

// --- sortable data table ---
function DataTable({ columns, rows, onRow, sort, onSort, rowClass }) {
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={c.sortable ? "sortable" : ""} style={c.width ? { width: c.width } : null}
                onClick={c.sortable ? () => onSort(c.key) : undefined}>
                <span className="th-in">
                  {c.label}
                  {c.sortable && sort && sort.key === c.key && <Icon name={sort.dir === "asc" ? "chevron-up" : "chevron-down"} />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} onClick={() => onRow && onRow(r)} className={rowClass ? rowClass(r) : ""}>
              {columns.map((c) => <td key={c.key} className={c.align === "right" ? "right" : ""}>{c.render(r)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- pagination ---
function Pagination({ page, pages, total, perPage, onPage }) {
  if (total === 0) return null;
  const from = page * perPage + 1;
  const to = Math.min(total, (page + 1) * perPage);
  const nums = [];
  for (let i = 0; i < pages; i++) {
    if (i === 0 || i === pages - 1 || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums[nums.length - 1] !== "…") nums.push("…");
  }
  return (
    <div className="pager">
      <span className="pager-info">{from}–{to} de {total}</span>
      <div className="pager-btns">
        <button className="pager-btn" disabled={page === 0} onClick={() => onPage(page - 1)} aria-label="Anterior"><Icon name="chevron-left" /></button>
        {nums.map((n, i) => n === "…"
          ? <span key={"e" + i} className="pager-info" style={{ padding: "0 4px" }}>…</span>
          : <button key={n} className={"pager-btn" + (n === page ? " active" : "")} onClick={() => onPage(n)}>{n + 1}</button>)}
        <button className="pager-btn" disabled={page >= pages - 1} onClick={() => onPage(page + 1)} aria-label="Siguiente"><Icon name="chevron-right" /></button>
      </div>
    </div>
  );
}

// --- empty state ---
function Empty({ icon, title, children }) {
  return (
    <div className="empty">
      <span className="empty-ic"><Icon name={icon || "inbox"} /></span>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

// --- drawer (right detail panel) ---
function Drawer({ kicker, title, meta, onClose, children, footer }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, []);
  useLucide();
  return (
    <React.Fragment>
      <div className="drawer-scrim" onClick={onClose}></div>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={title}>
        <div className="drawer-head">
          <div className="drawer-head-text">
            {kicker && <p className="drawer-kicker">{kicker}</p>}
            <h2>{title}</h2>
            {meta && <div className="drawer-meta">{meta}</div>}
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Cerrar"><Icon name="x" /></button>
        </div>
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-foot">{footer}</div>}
      </aside>
    </React.Fragment>
  );
}

// definition rows inside a drawer
function DRow({ label, children }) {
  return <div className="drow"><dt>{label}</dt><dd>{children}</dd></div>;
}
function DGroup({ title, children }) {
  return <div className="dgroup">{title && <p className="dgroup-title">{title}</p>}{children}</div>;
}

// --- status changer (color-coded segmented) ---
function StatusChanger({ options, value, onChange }) {
  return (
    <div className="status-set">
      {options.map((o) => {
        const hue = STATUS_HUE[o] || "var(--stone)";
        const on = o === value;
        return (
          <button key={o} className={"status-opt" + (on ? " on" : "")} onClick={() => onChange(o)}
            style={on ? { background: hue, borderColor: hue } : null}>
            <span className="status-dot" style={{ background: on ? "rgba(246,243,238,.92)" : hue }}></span>{o}
          </button>
        );
      })}
    </div>
  );
}

// --- notes panel ---
function Notes({ notas, onAdd }) {
  const [txt, setTxt] = useState("");
  const add = () => { if (txt.trim()) { onAdd(txt.trim()); setTxt(""); } };
  return (
    <div className="notes">
      {(notas || []).length === 0 && <p className="muted" style={{ fontSize: 13 }}>Sin observaciones todavía.</p>}
      {(notas || []).map((n) => (
        <div className="note" key={n.id}>
          <p>{n.texto}</p>
          <div className="note-meta"><Icon name="user" style={{ width: 12, height: 12 }} />{n.autor} · {relDays(n.fecha)}</div>
        </div>
      ))}
      <div className="note-add">
        <textarea value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="Agregar una observación interna…"
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) add(); }} />
        <Btn variant="primary" sm onClick={add}>Añadir observación</Btn>
      </div>
    </div>
  );
}

// --- modal ---
function Modal({ kicker, title, subtitle, onClose, children, footer, wide }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, []);
  useLucide();
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" style={wide ? { width: "min(760px,100%)" } : null} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            {kicker && <p className="drawer-kicker">{kicker}</p>}
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Cerrar"><Icon name="x" /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

// --- form field ---
function FField({ label, required, error, full, hint, children }) {
  return (
    <div className={"f-field" + (full ? " full" : "") + (error ? " err" : "")}>
      {label && <label>{label}{required && <span className="req">*</span>}</label>}
      {children}
      {hint && !error && <span className="muted" style={{ fontSize: 12.5 }}>{hint}</span>}
      {error && <span className="f-err"><Icon name="alert-circle" />{error}</span>}
    </div>
  );
}

// --- horizontal bar chart (analytics) ---
function BarChart({ data, color }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="bar-scroll">
      {data.map((d, i) => (
        <div className="bar-row" key={i}>
          <span className="bar-label" title={d.label}>{d.label}</span>
          <div className="bar-track"><div className={"bar-fill" + (color ? " " + color : "")} style={{ width: Math.round(d.value / max * 100) + "%" }}></div></div>
          <span className="bar-val">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

// --- toast (global, via window event) ---
function showToast(msg) { window.dispatchEvent(new CustomEvent("bo-toast", { detail: msg })); }
function ToastHost() {
  const [msg, setMsg] = useState(null);
  const t = useRef(null);
  useEffect(() => {
    const on = (e) => { setMsg(e.detail); clearTimeout(t.current); t.current = setTimeout(() => setMsg(null), 3200); };
    window.addEventListener("bo-toast", on);
    return () => window.removeEventListener("bo-toast", on);
  }, []);
  useLucide();
  if (!msg) return null;
  return <div className="bo-toast" role="status" aria-live="polite"><Icon name="check" />{msg}</div>;
}

// --- big detail modal (reemplaza el drawer): cover + tabs ---
function DetailModal({ kicker, title, cover, sub, tabs, active, onTab, onClose, footer, children }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, []);
  useLucide();
  const img = cover ? resolveImg(cover) : "";
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal modal-xl" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <button className="dx-close" onClick={onClose} aria-label="Cerrar"><Icon name="x" /></button>
        <div className="modal-body">
          <div className={"dx-cover" + (img ? "" : " no-img")} style={img ? { backgroundImage: "url(" + img + ")" } : null}>
            <div className="dx-cover-meta">
              <div style={{ minWidth: 0 }}>
                {kicker && <p className="dx-kicker">{kicker}</p>}
                <h2>{title}</h2>
                {sub && <div className="dx-sub">{sub}</div>}
              </div>
            </div>
          </div>
          {tabs && tabs.length > 1 && (
            <div className="tabs" role="tablist">
              {tabs.map((t) => (
                <button key={t.key} className={"tab" + (t.key === active ? " on" : "")} role="tab" aria-selected={t.key === active} onClick={() => onTab(t.key)}>
                  {t.icon && <Icon name={t.icon} />}{t.label}
                  {t.count != null && <span className="tab-count">{t.count}</span>}
                </button>
              ))}
            </div>
          )}
          <div className="dx-panes">{children}</div>
        </div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

// definition cells used inside detail panes
function DxCell({ label, children, empty }) {
  const isEmpty = empty || children == null || children === "" || children === "—";
  return <div className={"dx-cell" + (isEmpty ? " empty" : "")}><dt>{label}</dt><dd>{isEmpty ? "No informado" : children}</dd></div>;
}
function DxGrid({ children }) { return <dl className="dx-grid">{children}</dl>; }
function DxSection({ title, children }) {
  return <div className="dx-block">{title && <p className="dx-section-title">{title}</p>}{children}</div>;
}

// --- photo gallery + lightbox (lectura) ---
function PhotoGallery({ fotos, empty }) {
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
  useLucide();
  if (list.length === 0) {
    return <div className="empty" style={{ padding: "40px 20px" }}><span className="empty-ic"><Icon name="image-off" /></span><h3>Sin fotografías</h3><p>{empty || "El postulante no adjuntó imágenes."}</p></div>;
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

// --- image manager (edición): drag&drop + url + galería curada + quitar ---
const CURATED_IMG = ["1501785888041-af3ef285b470", "1470071459604-3b5ec3a7fe05", "1500382017468-9049fed747ef", "1426604966848-d7adac402bff", "1454496522488-7a8e488e8606", "1469474968028-56623f02e42e", "1472396961693-142e6e269027", "1433086966358-54859d0ed716", "1518495973542-4542c06a5843", "1441974231531-c6227db76b6e"];
function ImageManager({ fotos, onChange, max, hideCover }) {
  const list = (fotos || []).filter(Boolean);
  const [url, setUrl] = useState("");
  const [over, setOver] = useState(false);
  const fileRef = useRef(null);
  useLucide();
  const limit = max || 12;
  const add = (v) => { if (v && list.length < limit && list.indexOf(v) < 0) onChange(list.concat([v])); };
  const removeAt = (i) => onChange(list.filter((_, x) => x !== i));
  // FileReader is async — read sequentially and commit once all are done:
  const handleFiles = (files) => {
    const arr = Array.from(files || []).filter((f) => f.type.startsWith("image/"));
    let next = list.slice();
    let pending = arr.length;
    if (!pending) return;
    arr.forEach((f) => {
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
            {i === 0 && !hideCover && <span className="imgmgr-cover">Portada</span>}
            <button className="imgmgr-x" onClick={() => removeAt(i)} aria-label="Quitar foto"><Icon name="trash-2" /></button>
          </div>
        ))}
        {list.length < limit && (
          <div className={"imgmgr-drop" + (over ? " over" : "")} onClick={() => fileRef.current && fileRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
            onDrop={(e) => { e.preventDefault(); setOver(false); handleFiles(e.dataTransfer.files); }}>
            <Icon name="image-plus" />
            <span>Arrastrá una imagen<br />o hacé clic para subir</span>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => handleFiles(e.target.files)} />
          </div>
        )}
      </div>
      <div className="imgmgr-url">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="…o pegá una URL de imagen" style={{ flex: 1, fontFamily: "var(--sans)", fontSize: 13.5, color: "var(--fg1)", background: "var(--bg-raised)", border: "1px solid var(--line-strong)", borderRadius: "var(--radius-md)", padding: "10px 13px", outline: "none" }}
          onKeyDown={(e) => { if (e.key === "Enter") { add(url.trim()); setUrl(""); } }} />
        <Btn variant="ghost" icon="plus" sm onClick={() => { add(url.trim()); setUrl(""); }}>Agregar</Btn>
      </div>
      <div>
        <p className="muted" style={{ fontSize: 12, margin: "0 0 7px" }}>Galería de ejemplo</p>
        <div className="imgmgr-gallery">
          {CURATED_IMG.filter((g) => list.indexOf(g) < 0).slice(0, 8).map((g) => (
            <button key={g} style={{ backgroundImage: "url(" + resolveImg(g) + ")" }} onClick={() => add(g)} aria-label="Agregar de la galería"></button>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- confirm dialog ---
function Confirm({ title, message, confirmLabel, danger, icon, onConfirm, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  useLucide();
  return (
    <div className="confirm-scrim" onClick={onClose}>
      <div className="confirm" role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className={"confirm-ic" + (danger ? "" : " warn")}><Icon name={icon || (danger ? "trash-2" : "alert-triangle")} /></div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-foot">
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <button className={"btn-bo " + (danger ? "btn-danger-bo" : "btn-primary-bo")} onClick={onConfirm}>{confirmLabel || "Confirmar"}</button>
        </div>
      </div>
    </div>
  );
}

// --- searchable select (filtros largos) ---
function SearchableSelect({ value, onChange, options, allLabel, placeholder, ariaLabel, counts }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  useLucide();
  const all = allLabel || "Todos";
  const opts = options.filter((o) => o.toLowerCase().includes(q.toLowerCase()));
  const current = (!value || value === "__all") ? all : value;
  const has = value && value !== "__all";
  return (
    <div className="ssel" ref={ref}>
      <button className={"ssel-btn" + (has ? " has" : "")} onClick={() => setOpen((o) => !o)} aria-label={ariaLabel}>
        <span className="ssel-label">{current}</span><Icon name="chevron-down" />
      </button>
      {open && (
        <div className="ssel-pop">
          <div className="ssel-search">
            <Icon name="search" />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder || "Buscar…"} />
          </div>
          <div className="ssel-list">
            <button className={"ssel-opt" + (!has ? " on" : "")} onClick={() => { onChange("__all"); setOpen(false); setQ(""); }}>{all}</button>
            {opts.map((o) => (
              <button key={o} className={"ssel-opt" + (o === value ? " on" : "")} onClick={() => { onChange(o); setOpen(false); setQ(""); }}>
                <span>{o}</span>{counts && counts[o] != null && <span className="ssel-c">{counts[o]}</span>}
              </button>
            ))}
            {opts.length === 0 && <div className="ssel-empty">Sin resultados</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// --- toggle switch (brand-styled) ---
function Toggle({ checked, onChange }) {
  return (
    <span style={{ position: "relative", display: "inline-block", width: 40, height: 23, flex: "none" }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", margin: 0, cursor: "pointer" }} />
      <span style={{ position: "absolute", inset: 0, borderRadius: 999, background: checked ? "var(--forest)" : "var(--stone)", transition: "background .18s" }}></span>
      <span style={{ position: "absolute", top: 3, left: checked ? 20 : 3, width: 17, height: 17, borderRadius: "50%", background: "var(--ivory)", transition: "left .18s", boxShadow: "var(--shadow-sm)" }}></span>
    </span>
  );
}

// --- generic list controller: search + filter + sort + paginate ---
function useListController(rows, { searchKeys, perPage = 10, defaultSort }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState(defaultSort || null);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({});

  const setFilter = (k, v) => { setFilters((f) => ({ ...f, [k]: v })); setPage(0); };
  const toggleSort = (key) => {
    setSort((s) => s && s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
  };

  const filtered = useMemo(() => {
    let out = rows.slice();
    if (q.trim()) {
      const needle = q.toLowerCase();
      out = out.filter((r) => searchKeys.some((k) => String(r[k] || "").toLowerCase().includes(needle)));
    }
    Object.keys(filters).forEach((k) => {
      const fv = filters[k];
      if (fv && fv !== "__all") {
        if (k === "__archived") {
          out = out.filter((r) => fv === "archived" ? r.archivado : !r.archivado);
        } else {
          out = out.filter((r) => String(r[k]) === fv);
        }
      }
    });
    if (sort) {
      out.sort((a, b) => {
        let av = a[sort.key], bv = b[sort.key];
        if (sort.key === "fecha") { av = new Date(av).getTime(); bv = new Date(bv).getTime(); }
        else { av = String(av || "").toLowerCase(); bv = String(bv || "").toLowerCase(); }
        if (av < bv) return sort.dir === "asc" ? -1 : 1;
        if (av > bv) return sort.dir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return out;
  }, [rows, q, sort, filters, searchKeys]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, pages - 1);
  const pageRows = filtered.slice(safePage * perPage, safePage * perPage + perPage);

  return { q, setQ, sort, toggleSort, filters, setFilter, page: safePage, setPage, pages, perPage, filtered, pageRows, total: filtered.length };
}

export {
  Icon, useLucide, useStore, fmtDate, relDays, resolveImg,
  Badge, Tag, TagRow, ModuleHead, Search, Select, Btn,
  DataTable, Pagination, Empty, Drawer, DRow, DGroup,
  StatusChanger, Notes, Modal, FField, BarChart, showToast, ToastHost,
  DetailModal, DxCell, DxGrid, DxSection, PhotoGallery, ImageManager, Confirm, SearchableSelect, Toggle,
  useListController, STATUS_CLASS, STATUS_HUE
};
