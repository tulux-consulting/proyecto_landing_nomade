import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon.jsx';

export function Search({ value, onChange, placeholder }) {
  return (
    <div className="search">
      <Icon name="search" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || "Buscar…"} aria-label="Buscar" />
    </div>
  );
}

export function Select({ value, onChange, options, ariaLabel }) {
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

export function FField({ label, required, error, full, hint, children }) {
  return (
    <div className={"f-field" + (full ? " full" : "") + (error ? " err" : "")}>
      {label && <label>{label}{required && <span className="req">*</span>}</label>}
      {children}
      {hint && !error && <span className="muted" style={{ fontSize: 12.5 }}>{hint}</span>}
      {error && <span className="f-err"><Icon name="alert-circle" />{error}</span>}
    </div>
  );
}

export function Toggle({ checked, onChange }) {
  return (
    <span style={{ position: "relative", display: "inline-block", width: 40, height: 23, flex: "none" }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", margin: 0, cursor: "pointer" }} />
      <span style={{ position: "absolute", inset: 0, borderRadius: 999, background: checked ? "var(--forest)" : "var(--stone)", transition: "background .18s" }}></span>
      <span style={{ position: "absolute", top: 3, left: checked ? 20 : 3, width: 17, height: 17, borderRadius: "50%", background: "var(--ivory)", transition: "left .18s", boxShadow: "var(--shadow-sm)" }}></span>
    </span>
  );
}

export function SearchableSelect({ value, onChange, options, allLabel, placeholder, ariaLabel, counts }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

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
