import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BO } from '../../lib/store.js';
import { Icon, useLucide, useStore, fmtDate, relDays, resolveImg, Badge, Tag, TagRow, ModuleHead, Search, Select, Btn, DataTable, Pagination, Empty, Drawer, DRow, DGroup, StatusChanger, Notes, Modal, FField, BarChart, showToast, ToastHost, DetailModal, DxCell, DxGrid, DxSection, PhotoGallery, ImageManager, Confirm, SearchableSelect, Toggle, useListController, STATUS_CLASS, STATUS_HUE } from './ui.jsx';
import { totalCount, pendingCount } from './Shell.jsx';

// ============================================================
// NÓMADE — Dashboard (launcher de módulos con datos vivos).
// Pantalla de bienvenida. Cada card abre su módulo. Muestra
// conteos útiles; el detalle siempre vive dentro del módulo.
// ============================================================
function Dashboard({ user, onGo }) {
  useStore();
  useLucide();
  const hour = new Date().getHours();
  const saludo = hour < 12 ? "Buenos días" : hour < 20 ? "Buenas tardes" : "Buenas noches";
  const first = (user.nombre || "").split(" ")[0];

  const modules = BO.MODULES.filter((m) => m.key !== "dashboard" && user.permisos.includes(m.key));

  const statFor = (m) => {
    if (m.key === "postulaciones" || m.key === "partners") {
      const total = totalCount(m.col);
      const pend = pendingCount(m.key);
      return { value: total, unit: total === 1 ? "registro" : "registros", pend };
    }
    if (m.key === "huespedes") {
      const total = totalCount("huespedes");
      return { value: total, unit: "en lista de espera" };
    }
    if (m.key === "destinos") {
      const all = BO.all("destinos").filter((d) => !d.archivado);
      const disp = all.filter((d) => d.estado === "Disponible").length;
      return { value: all.length, unit: "destinos", note: disp + " disponibles" };
    }
    if (m.key === "contenido") {
      return { value: 11, unit: "secciones editables" };
    }
    if (m.key === "ajustes") {
      const u = BO.all("usuarios").filter((x) => x.is_active !== false && x.activo !== false).length;
      return { value: u, unit: u === 1 ? "usuario activo" : "usuarios activos" };
    }
    return { value: 0, unit: "" };
  };

  return (
    <div className="main-inner">
      <ModuleHead eyebrow="Backoffice" title={saludo + (first ? ", " + first : "") + "."}
        desc="Este es el panel interno de NÓMADE. Desde acá gestionás lo que llega desde la web. Elegí un módulo para empezar." />
      <div className="dash-grid">
        {modules.map((m) => {
          const s = statFor(m);
          return (
            <button key={m.key} className="dash-card" onClick={() => onGo(m.route)}>
              <div className="dash-card-top">
                <span className="dash-ic"><Icon name={m.icon} /></span>
                {s.pend > 0 && <span className="dash-pending">{s.pend} sin revisar</span>}
              </div>
              <h3>{m.label}</h3>
              <p>{m.desc}</p>
              <div className="dash-stat">
                <b>{s.value}</b><span>{s.unit}{s.note ? " · " + s.note : ""}</span>
              </div>
              <span className="dash-card-foot">Abrir módulo <Icon name="arrow-right" /></span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { Dashboard };
