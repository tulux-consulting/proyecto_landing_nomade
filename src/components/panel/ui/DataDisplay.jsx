import React, { useState, useEffect } from 'react';
import { Icon } from './Icon.jsx';
import { Btn } from './Btn.jsx';
import { BO } from '../../../lib/store.js';
import { relDays } from './Helpers.jsx';

export function useStore() {
  const [, force] = useState(0);
  useEffect(() => BO.subscribe(() => force((n) => n + 1)), []);
}

export function Tag({ children }) { return <span className="tag">{children}</span>; }

export function TagRow({ items, max }) {
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

export function ModuleHead({ eyebrow, title, desc, actions }) {
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

export function DRow({ label, children }) {
  return <div className="drow"><dt>{label}</dt><dd>{children}</dd></div>;
}

export function DGroup({ title, children }) {
  return <div className="dgroup">{title && <p className="dgroup-title">{title}</p>}{children}</div>;
}

export function DxCell({ label, children, empty }) {
  const isEmpty = empty || children == null || children === "" || children === "—";
  return <div className={"dx-cell" + (isEmpty ? " empty" : "")}><dt>{label}</dt><dd>{isEmpty ? "No informado" : children}</dd></div>;
}

export function DxGrid({ children }) { return <dl className="dx-grid">{children}</dl>; }

export function DxSection({ title, children }) {
  return <div className="dx-block">{title && <p className="dx-section-title">{title}</p>}{children}</div>;
}

export function BarChart({ data, color }) {
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

export function Notes({ notas, onAdd }) {
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
