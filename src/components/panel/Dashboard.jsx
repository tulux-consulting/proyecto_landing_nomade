import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BO } from '../../lib/store.js';
import { Icon, useLucide, useStore, fmtDate, relDays, resolveImg, Badge, Tag, TagRow, ModuleHead, Search, Select, Btn, DataTable, Pagination, Empty, Drawer, DRow, DGroup, StatusChanger, Notes, Modal, FField, BarChart, showToast, ToastHost, DetailModal, DxCell, DxGrid, DxSection, PhotoGallery, ImageManager, Confirm, SearchableSelect, Toggle, useListController, STATUS_CLASS, STATUS_HUE } from './ui.jsx';
import { totalCount, pendingCount } from './Shell.jsx';
import { useI18n } from '../../lib/i18n/i18nContext.jsx';

// ============================================================
// NÓMADE — Dashboard (launcher de módulos con datos vivos).
// Pantalla de bienvenida. Cada card abre su módulo. Muestra
// conteos útiles; el detalle siempre vive dentro del módulo.
// ============================================================
function Dashboard({ user, onGo }) {
  useStore();
  useLucide();
  const { t } = useI18n();
  const hour = new Date().getHours();
  const saludo = hour < 12 ? t('common.dashboard.salutation.morning') : hour < 20 ? t('common.dashboard.salutation.afternoon') : t('common.dashboard.salutation.evening');
  const first = (user.nombre || "").split(" ")[0];

  const modules = BO.MODULES.filter((m) => m.key !== "dashboard" && user.permisos.includes(m.key));

  const statFor = (m) => {
    if (m.key === "postulaciones" || m.key === "partners") {
      const total = totalCount(m.col);
      const pend = pendingCount(m.key);
      return { value: total, unit: total === 1 ? t('common.dashboard.unit.record') : t('common.dashboard.unit.records'), pend };
    }
    if (m.key === "huespedes") {
      const total = totalCount("huespedes");
      return { value: total, unit: t('common.dashboard.unit.waitingList') };
    }
    if (m.key === "destinos") {
      const all = BO.all("destinos").filter((d) => !d.archivado);
      const disp = all.filter((d) => d.estado === "Disponible").length;
      return { value: all.length, unit: t('common.dashboard.unit.destinations'), note: disp + " " + t('common.dashboard.unit.available') };
    }
    if (m.key === "contenido") {
      return { value: 11, unit: t('common.dashboard.unit.sections') };
    }
    if (m.key === "ajustes") {
      const u = BO.all("usuarios").filter((x) => x.is_active !== false && x.activo !== false).length;
      return { value: u, unit: u === 1 ? t('common.dashboard.unit.user') : t('common.dashboard.unit.users') };
    }
    return { value: 0, unit: "" };
  };

  return (
    <div className="main-inner">
      <ModuleHead eyebrow={t('common.dashboard.eyebrow')} title={saludo + (first ? ", " + first : "") + "."}
        desc={t('common.dashboard.desc')} />
      <div className="dash-grid">
        {modules.map((m) => {
          const s = statFor(m);
          return (
            <button key={m.key} className="dash-card" onClick={() => onGo(m.route)}>
              <div className="dash-card-top">
                <span className="dash-ic"><Icon name={m.icon} /></span>
                {s.pend > 0 && <span className="dash-pending">{t('common.dashboard.pendingCount', { count: s.pend })}</span>}
              </div>
              <h3>{t(`common.modules.${m.key}`)}</h3>
              <p>{t(`common.dashboard.moduleDescriptions.${m.key}`)}</p>
              <div className="dash-stat">
                <b>{s.value}</b><span>{s.unit}{s.note ? " · " + s.note : ""}</span>
              </div>
              <span className="dash-card-foot">{t('common.dashboard.openModule')} <Icon name="arrow-right" /></span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { Dashboard };
