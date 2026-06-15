import React, { useState, useEffect, useMemo } from 'react';
import { BO } from '../../lib/store.js';
import { HuespedesRepository } from '../../repositories/index';
import { Icon, useLucide, useStore, fmtDate, relDays, Badge, Tag, ModuleHead, Search, Select, DataTable, Pagination, Empty, DetailModal, DxCell, DxGrid, DxSection, Confirm, SearchableSelect, useListController, Spinner, showToast, BarChart } from './ui.jsx';

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
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [tab, setTab] = useState("listado");
  const [confirmDel, setConfirmDel] = useState(false);

  const loadData = async () => {
    try {
      const data = await HuespedesRepository.getAll();
      setAll(data || []);
    } catch (e) {
      console.error('Error al cargar huéspedes:', e);
      showToast('Error al cargar la lista de huéspedes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const ctrl = useListController(all, {
    searchKeys: ["email", "pais", "provincia", "ciudad", "estado"],
    perPage: 10, defaultSort: { key: "fecha", dir: "desc" }
  });
  const paisFilter = ctrl.filters.pais || "__all";
  const devFilter = ctrl.filters.dispositivo || "__all";
  const estadoFilter = ctrl.filters.estado || "__all";

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
    { key: "estado", label: "Estado", sortable: true, render: (r) => <Badge status={r.estado || 'Nuevo'} /> },
    { key: "so", label: "Sistema", render: (r) => <span className="muted">{r.so} · {r.navegador}</span> },
    { key: "fecha", label: "Sumado", sortable: true, render: (r) => <span className="td-mono" title={fmtDate(r.fecha)}>{relDays(r.fecha)}</span> }
  ];

  const rec = useMemo(() => openId ? all.find((r) => r.id === openId) : null, [openId, all]);

  const setEstado = async (e) => {
    try {
      await HuespedesRepository.update(openId, { estado: e });
      showToast("Estado actualizado a “" + e + "”.");
      loadData();
    } catch (err) {
      console.error(err);
      showToast("Error al actualizar el estado.");
    }
  };

  const updateNotes = async (t) => {
    try {
      await HuespedesRepository.update(openId, { admin_notes: t });
      showToast("Observaciones guardadas.");
      loadData();
    } catch (err) {
      console.error(err);
      showToast("Error al guardar observaciones.");
    }
  };

  const doDelete = async () => {
    try {
      await HuespedesRepository.delete(openId);
      showToast("Huésped eliminado definitivamente.");
      setConfirmDel(false);
      setOpenId(null);
      loadData();
    } catch (err) {
      console.error(err);
      showToast("Error al eliminar el huésped.");
    }
  };

  if (loading) {
    return <Spinner message="Cargando lista de huéspedes..." />;
  }

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
          <Select ariaLabel="Filtrar por estado" value={estadoFilter} onChange={(v) => ctrl.setFilter("estado", v)}
            options={[{ value: "__all", label: "Todos los estados" }, "Nuevo", "Contactado", "Archivado"]} />
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
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="muted" style={{ fontSize: 13 }}>Estado:</span>
              <Select ariaLabel="Cambiar estado" value={rec.estado || 'Nuevo'} onChange={setEstado}
                options={["Nuevo", "Contactado", "Archivado"]} />
            </div>
            <button className="btn btn-text text-danger" onClick={() => setConfirmDel(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px' }}>
              <Icon name="trash-2" />Eliminar de lista
            </button>
          </div>

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

          <DxSection title="Observaciones administrativas" style={{ marginTop: 20 }}>
            <textarea
              className="form-control"
              style={{ width: '100%', minHeight: 80, padding: 10, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--fg)', marginTop: 8 }}
              placeholder="Escribí notas u observaciones sobre este huésped..."
              defaultValue={rec.admin_notes || ''}
              onBlur={(e) => {
                if (e.target.value !== (rec.admin_notes || '')) {
                  updateNotes(e.target.value);
                }
              }}
            />
            <p className="muted" style={{ fontSize: 11.5, marginTop: 4 }}>
              Las notas se guardan automáticamente al perder el foco (blur).
            </p>
          </DxSection>
        </DetailModal>
      )}

      {confirmDel && (
        <Confirm title="Eliminar huésped" message="¿Estás seguro de que querés eliminar a este huésped de la lista? Esta acción no se puede deshacer." onConfirm={doDelete} onCancel={() => setConfirmDel(false)} />
      )}
    </div>
  );
}

export { Huespedes };
