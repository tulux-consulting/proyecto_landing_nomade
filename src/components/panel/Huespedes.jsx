import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BO } from '../../lib/store.js';
import { Icon, useLucide, useStore, fmtDate, relDays, resolveImg, Badge, Tag, TagRow, ModuleHead, Search, Select, Btn, DataTable, Pagination, Empty, Drawer, DRow, DGroup, StatusChanger, Notes, Modal, FField, BarChart, showToast, ToastHost, DetailModal, DxCell, DxGrid, DxSection, PhotoGallery, ImageManager, Confirm, SearchableSelect, Toggle, useListController, STATUS_CLASS, STATUS_HUE } from './ui.jsx';

// ============================================================
// NÓMADE — Módulo Lista de huéspedes.
// Personas interesadas en hospedarse + analítica de origen
// integrada (de dónde viene el mayor interés). Sin dashboard
// aparte: la información vive dentro del módulo.
// ============================================================
function countBy(rows, key, limit) {
  const map = {};
  rows.forEach((r) => { const v = r[key] || "—"; map[v] = (map[v] || 0) + 1; });
  let out = Object.keys(map).map((k) => ({ label: k, value: map[k] })).sort((a, b) => b.value - a.value);
  return limit ? out.slice(0, limit) : out;
}

function Huespedes() {
  useStore();
  useLucide();
  const all = BO.all("huespedes");
  const [openId, setOpenId] = useState(null);
  const [tab, setTab] = useState("listado");

  const ctrl = useListController(all, {
    searchKeys: ["email", "pais", "provincia", "ciudad"],
    perPage: 10, defaultSort: { key: "fecha", dir: "desc" }
  });
  const paisFilter = ctrl.filters.pais || "__all";
  const devFilter = ctrl.filters.dispositivo || "__all";

  const paises = useMemo(() => Array.from(new Set(all.map((r) => r.pais))).sort(), [all]);
  const thisMonth = all.filter((r) => new Date(r.fecha) > new Date(Date.now() - 30 * 86400000)).length;
  const byProv = countBy(all, "provincia");
  const byPais = countBy(all, "pais");
  const byCity = countBy(all, "ciudad");
  const byDev = countBy(all, "dispositivo");
  const topProv = byProv[0];

  const columns = [
    { key: "email", label: "Email", sortable: true, render: (r) => <span className="td-strong">{r.email}</span> },
    { key: "ciudad", label: "Origen", sortable: true, render: (r) => (
      <span className="cell-name"><span>{r.ciudad}, {r.provincia}</span><span className="td-sub">{r.pais}</span></span>
    ) },
    { key: "dispositivo", label: "Dispositivo", sortable: true, render: (r) => <Tag>{r.dispositivo}</Tag> },
    { key: "so", label: "Sistema", render: (r) => <span className="muted">{r.so} · {r.navegador}</span> },
    { key: "fecha", label: "Sumado", sortable: true, render: (r) => <span className="td-mono" title={fmtDate(r.fecha)}>{relDays(r.fecha)}</span> }
  ];

  const rec = openId ? BO.get("huespedes", openId) : null;

  return (
    <div className="main-inner">
      <ModuleHead eyebrow="Módulo" title="Lista de huéspedes"
        desc="Personas que quieren ser las primeras en enterarse cuando abramos nuevos destinos — y de dónde proviene el interés." />

      <div className="seg" style={{ marginBottom: 24 }}>
        <button className={"seg-btn" + (tab === "listado" ? " on" : "")} onClick={() => setTab("listado")}>
          <Icon name="list" />Listado<span className="seg-c">{all.length}</span>
        </button>
        <button className={"seg-btn" + (tab === "metricas" ? " on" : "")} onClick={() => setTab("metricas")}>
          <Icon name="bar-chart-3" />Métricas
        </button>
      </div>

      {tab === "listado" && (
      <React.Fragment>
        <div className="toolbar">
          <Search value={ctrl.q} onChange={ctrl.setQ} placeholder="Buscar por email u origen…" />
          <SearchableSelect ariaLabel="Filtrar por país" value={paisFilter} onChange={(v) => ctrl.setFilter("pais", v)}
            options={paises} allLabel="Todos los países" placeholder="Buscar país…" />
          <Select ariaLabel="Filtrar por dispositivo" value={devFilter} onChange={(v) => ctrl.setFilter("dispositivo", v)}
            options={[{ value: "__all", label: "Todos los dispositivos" }, "Móvil", "Escritorio", "Tablet"]} />
        </div>

        <div className="panel-card">
          {ctrl.total === 0 ? (
            <Empty icon="users" title="Sin huéspedes">No hay personas que coincidan con la búsqueda o los filtros.</Empty>
          ) : (
            <React.Fragment>
              <DataTable columns={columns} rows={ctrl.pageRows} onRow={(r) => setOpenId(r.id)} sort={ctrl.sort} onSort={ctrl.toggleSort} />
              <Pagination page={ctrl.page} pages={ctrl.pages} total={ctrl.total} perPage={ctrl.perPage} onPage={ctrl.setPage} />
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
      )}

      {tab === "metricas" && (
      <React.Fragment>
        {/* stat tiles */}
        <div className="stat-row">
          <div className="stat-tile"><p className="stat-label">En lista de espera</p><div className="stat-val">{all.length}</div></div>
          <div className="stat-tile"><p className="stat-label">Nuevos (30 días)</p><div className="stat-val">{thisMonth}</div></div>
          <div className="stat-tile"><p className="stat-label">Provincia con más interés</p><div className="stat-val" style={{ fontSize: 22 }}>{topProv ? topProv.label : "—"}</div><p className="stat-foot">{topProv ? topProv.value + " personas" : ""}</p></div>
          <div className="stat-tile"><p className="stat-label">Países alcanzados</p><div className="stat-val">{paises.length}</div></div>
        </div>

        {/* analytics — integrado en el módulo */}
        <div className="analytics">
          <div className="chart-card">
            <h3>Por provincia</h3>
            <p className="chart-sub">Dónde se concentra el interés dentro del país.</p>
            <BarChart data={byProv} />
          </div>
          <div className="chart-card">
            <h3>Por país</h3>
            <p className="chart-sub">Alcance internacional de la lista.</p>
            <BarChart data={byPais} color="gold" />
          </div>
          <div className="chart-card">
            <h3>Por ciudad</h3>
            <p className="chart-sub">Las ciudades de mayor interés.</p>
            <BarChart data={byCity} />
          </div>
          <div className="chart-card">
            <h3>Por dispositivo</h3>
            <p className="chart-sub">Cómo llegan a la web.</p>
            <BarChart data={byDev} color="forest" />
          </div>
        </div>
      </React.Fragment>
      )}

      {rec && (
        <DetailModal kicker="Huésped en lista" title={rec.email} onClose={() => setOpenId(null)}
          sub={<React.Fragment>
            <span><Icon name="map-pin" />{rec.ciudad}, {rec.pais}</span>
            <span><Icon name="calendar" />Sumado {relDays(rec.fecha)}</span>
            <span><Icon name={rec.dispositivo === "Móvil" ? "smartphone" : rec.dispositivo === "Tablet" ? "tablet" : "monitor"} />{rec.dispositivo}</span>
          </React.Fragment>}>
          <div className="dx-cols">
            <DxSection title="Origen">
              <DxGrid>
                <DxCell label="País">{rec.pais}</DxCell>
                <DxCell label="Provincia / Región">{rec.provincia}</DxCell>
                <DxCell label="Ciudad aproximada">{rec.ciudad}</DxCell>
              </DxGrid>
            </DxSection>
            <DxSection title="Dispositivo">
              <DxGrid>
                <DxCell label="Tipo">{rec.dispositivo}</DxCell>
                <DxCell label="Sistema operativo">{rec.so}</DxCell>
                <DxCell label="Navegador">{rec.navegador}</DxCell>
                <DxCell label="Fecha">{fmtDate(rec.fecha)}</DxCell>
              </DxGrid>
            </DxSection>
          </div>
          <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.55, margin: 0 }}>
            Los datos de origen y dispositivo se registran automáticamente al sumarse, siempre que el navegador lo permita.
          </p>
        </DetailModal>
      )}
    </div>
  );
}

export { Huespedes };
