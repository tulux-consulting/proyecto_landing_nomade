import React, { useState, useEffect, useMemo } from 'react';
import { BO } from '../../lib/store.js';
import { HuespedesRepository } from '../../repositories/index';
import { useI18n } from '../../lib/i18n/i18nContext.jsx';
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
  const { t, locale, tValue } = useI18n();
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
      showToast(t('common.huespedes.toasts.loadingError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const ctrl = useListController(all, {
    searchKeys: ["email", "pais", "provincia", "ciudad", "estado"],
    perPage: 5, defaultSort: { key: "fecha", dir: "desc" }
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
    { key: "email", label: t('common.huespedes.table.email'), sortable: true, render: (r) => <span className="td-strong">{r.email}</span> },
    { key: "ciudad", label: t('common.huespedes.table.origin'), sortable: true, render: (r) => (
      <span className="cell-name"><span>{r.ciudad}, {r.provincia}</span><span className="td-sub">{r.pais}</span></span>
    ) },
    { key: "dispositivo", label: t('common.huespedes.table.device'), sortable: true, render: (r) => <Tag>{tValue(r.dispositivo)}</Tag> },
    { key: "estado", label: t('common.huespedes.table.status'), sortable: true, render: (r) => <Badge status={r.estado || 'Nuevo'} /> },
    { key: "so", label: t('common.huespedes.table.system'), render: (r) => <span className="muted">{r.so} · {r.navegador}</span> },
    { key: "fecha", label: t('common.huespedes.table.joined'), sortable: true, render: (r) => <span className="td-mono" title={fmtDate(r.fecha)}>{relDays(r.fecha, locale)}</span> }
  ];

  const rec = useMemo(() => openId ? all.find((r) => r.id === openId) : null, [openId, all]);

  const setEstado = async (e) => {
    try {
      await HuespedesRepository.update(openId, { estado: e });
      showToast(t('common.huespedes.toasts.statusUpdated', { status: tValue(e) }));
      loadData();
    } catch (err) {
      console.error(err);
      showToast(t('common.huespedes.toasts.statusUpdateError'));
    }
  };

  const updateNotes = async (tOption) => {
    try {
      await HuespedesRepository.update(openId, { admin_notes: tOption });
      showToast(t('common.huespedes.toasts.notesSaved'));
      loadData();
    } catch (err) {
      console.error(err);
      showToast(t('common.huespedes.toasts.notesSaveError'));
    }
  };

  const doDelete = async () => {
    try {
      await HuespedesRepository.delete(openId);
      showToast(t('common.huespedes.toasts.deleted'));
      setConfirmDel(false);
      setOpenId(null);
      loadData();
    } catch (err) {
      console.error(err);
      showToast(t('common.huespedes.toasts.deleteError'));
    }
  };

  if (loading) {
    return <Spinner message={t('common.huespedes.toasts.loading')} />;
  }

  return (
    <div className="main-inner">
      <ModuleHead eyebrow={t('common.huespedes.eyebrow')} title={t('common.huespedes.title')}
        desc={t('common.huespedes.desc')} />

      <div className="seg" style={{ marginBottom: 24 }}>
        <button className={"seg-btn" + (tab === "listado" ? " on" : "")} onClick={() => setTab("listado")}>
          <Icon name="list" />{t('common.huespedes.tabs.listado')}<span className="seg-c">{all.length}</span>
        </button>
        <button className={"seg-btn" + (tab === "metricas" ? " on" : "")} onClick={() => setTab("metricas")}>
          <Icon name="bar-chart-3" />{t('common.huespedes.tabs.metricas')}
        </button>
      </div>

      {tab === "listado" && (
      <React.Fragment>
        <div className="toolbar">
          <Search value={ctrl.q} onChange={ctrl.setQ} placeholder={t('common.huespedes.searchPlaceholder')} />
          <Select ariaLabel={t('common.huespedes.filterEstado')} value={estadoFilter} onChange={(v) => ctrl.setFilter("estado", v)}
            options={[{ value: "__all", label: t('common.huespedes.allEstados') }, ...["Nuevo", "Contactado", "Archivado"].map(st => ({ value: st, label: tValue(st) }))]} />
          <SearchableSelect ariaLabel={t('common.huespedes.filterPais')} value={paisFilter} onChange={(v) => ctrl.setFilter("pais", v)}
            options={paises} allLabel={t('common.huespedes.allPaises')} placeholder={t('common.huespedes.searchPais')} />
          <Select ariaLabel={t('common.huespedes.filterDispositivo')} value={devFilter} onChange={(v) => ctrl.setFilter("dispositivo", v)}
            options={[{ value: "__all", label: t('common.huespedes.allDispositivos') }, ...["Móvil", "Escritorio", "Tablet"].map(d => ({ value: d, label: tValue(d) }))]} />
        </div>

        <div className="panel-card">
          {ctrl.total === 0 ? (
            <Empty icon="users" title={t('common.huespedes.noGuests')}>{t('common.huespedes.noGuestsDesc')}</Empty>
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
          <div className="stat-tile"><p className="stat-label">{t('common.huespedes.metrics.waitingList')}</p><div className="stat-val">{all.length}</div></div>
          <div className="stat-tile"><p className="stat-label">{t('common.huespedes.metrics.new30Days')}</p><div className="stat-val">{thisMonth}</div></div>
          <div className="stat-tile"><p className="stat-label">{t('common.huespedes.metrics.topProvince')}</p><div className="stat-val" style={{ fontSize: 22 }}>{topProv ? topProv.label : "—"}</div><p className="stat-foot">{topProv ? t('common.huespedes.metrics.topProvinceFoot', { count: topProv.value }) : ""}</p></div>
          <div className="stat-tile"><p className="stat-label">{t('common.huespedes.metrics.countriesReached')}</p><div className="stat-val">{paises.length}</div></div>
        </div>

        {/* analytics — integrado en el módulo */}
        <div className="analytics">
          <div className="chart-card">
            <h3>{t('common.huespedes.metrics.charts.byProv')}</h3>
            <p className="chart-sub">{t('common.huespedes.metrics.charts.byProvSub')}</p>
            <BarChart data={byProv} />
          </div>
          <div className="chart-card">
            <h3>{t('common.huespedes.metrics.charts.byPais')}</h3>
            <p className="chart-sub">{t('common.huespedes.metrics.charts.byPaisSub')}</p>
            <BarChart data={byPais.map(item => ({ ...item, label: tValue(item.label) }))} color="gold" />
          </div>
          <div className="chart-card">
            <h3>{t('common.huespedes.metrics.charts.byCity')}</h3>
            <p className="chart-sub">{t('common.huespedes.metrics.charts.byCitySub')}</p>
            <BarChart data={byCity} />
          </div>
          <div className="chart-card">
            <h3>{t('common.huespedes.metrics.charts.byDev')}</h3>
            <p className="chart-sub">{t('common.huespedes.metrics.charts.byDevSub')}</p>
            <BarChart data={byDev.map(item => ({ ...item, label: tValue(item.label) }))} color="forest" />
          </div>
        </div>
      </React.Fragment>
      )}

      {rec && (
        <DetailModal kicker={t('common.huespedes.modal.kicker')} title={rec.email} onClose={() => setOpenId(null)}
          sub={<React.Fragment>
            <span><Icon name="map-pin" />{rec.ciudad}, {rec.pais}</span>
            <span><Icon name="calendar" />{t('common.huespedes.table.joined')} {relDays(rec.fecha, locale)}</span>
            <span><Icon name={rec.dispositivo === "Móvil" ? "smartphone" : rec.dispositivo === "Tablet" ? "tablet" : "monitor"} />{tValue(rec.dispositivo)}</span>
          </React.Fragment>}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="muted" style={{ fontSize: 13 }}>{t('common.huespedes.modal.statusLabel')}</span>
              <Select ariaLabel="Cambiar estado" value={rec.estado || 'Nuevo'} onChange={setEstado}
                options={["Nuevo", "Contactado", "Archivado"].map(st => ({ value: st, label: tValue(st) }))} />
            </div>
            <button className="btn btn-text text-danger" onClick={() => setConfirmDel(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', whiteSpace: 'nowrap' }}>
              <Icon name="trash-2" />{t('common.huespedes.modal.deleteBtn')}
            </button>
          </div>

          <div className="dx-cols">
            <DxSection title={t('common.huespedes.modal.sections.origin')}>
              <DxGrid>
                <DxCell label={t('common.huespedes.modal.fields.country')}>{rec.pais}</DxCell>
                <DxCell label={t('common.huespedes.modal.fields.province')}>{rec.provincia}</DxCell>
                <DxCell label={t('common.huespedes.modal.fields.city')}>{rec.ciudad}</DxCell>
              </DxGrid>
            </DxSection>
            <DxSection title={t('common.huespedes.modal.sections.device')}>
              <DxGrid>
                <DxCell label={t('common.huespedes.modal.fields.type')}>{tValue(rec.dispositivo)}</DxCell>
                <DxCell label={t('common.huespedes.modal.fields.os')}>{rec.so}</DxCell>
                <DxCell label={t('common.huespedes.modal.fields.browser')}>{rec.navegador}</DxCell>
                <DxCell label={t('common.huespedes.modal.fields.date')}>{fmtDate(rec.fecha)}</DxCell>
              </DxGrid>
            </DxSection>
          </div>

          <DxSection title={t('common.huespedes.modal.sections.adminRemarks')} style={{ marginTop: 20 }}>
            <textarea
              className="form-control"
              style={{ width: '100%', minHeight: 80, padding: 10, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--fg)', marginTop: 8 }}
              placeholder={t('common.huespedes.modal.fields.placeholderNotes')}
              defaultValue={rec.admin_notes || ''}
              onBlur={(e) => {
                if (e.target.value !== (rec.admin_notes || '')) {
                  updateNotes(e.target.value);
                }
              }}
            />
            <p className="muted" style={{ fontSize: 11.5, marginTop: 4 }}>
              {t('common.huespedes.modal.fields.notesFooter')}
            </p>
          </DxSection>
        </DetailModal>
      )}

      {confirmDel && (
        <Confirm danger title={t('common.huespedes.deleteConfirm.title')} confirmLabel={t('common.huespedes.deleteConfirm.confirm')} message={t('common.huespedes.deleteConfirm.message')} onConfirm={doDelete} onClose={() => setConfirmDel(false)} />
      )}
    </div>
  );
}

export { Huespedes };
