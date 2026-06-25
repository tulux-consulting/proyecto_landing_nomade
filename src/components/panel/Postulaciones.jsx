import React, { useState, useEffect, useMemo } from 'react';
import { BO } from '../../lib/store.js';
import { PostulacionesRepository } from '../../repositories/index';
import { PostulacionModal } from './PostulacionModal.jsx';
import { Icon, useLucide, fmtDate, relDays, Badge, TagRow, ModuleHead, Search, Select, DataTable, Pagination, Empty, Confirm, SearchableSelect, Spinner } from './ui.jsx';
import { useI18n } from '../../lib/i18n/i18nContext.jsx';

function Postulaciones({ onToast }) {
  useLucide();
  const { t, locale, tValue } = useI18n();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [confirmDel, setConfirmDel] = useState(false);

  const loadData = async () => {
    try {
      const data = await PostulacionesRepository.getAll();
      setAll(data || []);
    } catch (e) {
      console.error('Error al cargar postulaciones:', e);
      onToast(t('common.postulaciones.toasts.connError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const ctrl = useListController(all, {
    searchKeys: ["nombre", "apellido", "email", "provincia", "localidad"],
    perPage: 5, defaultSort: { key: "fecha", dir: "desc" }
  });

  const estadoFilter = ctrl.filters.estado || "__all";
  const provFilter = ctrl.filters.provincia || "__all";
  const archFilter = ctrl.filters.__archived || "active";

  const provincias = useMemo(() => Array.from(new Set(all.map((r) => r.provincia))).sort(), [all]);

  const columns = [
    { key: "nombre", label: t('common.postulaciones.table.applicant'), sortable: true, render: (r) => (
      <span className="cell-name"><span className="td-strong">{r.nombre} {r.apellido}</span><span className="td-sub">{r.email}</span></span>
    ) },
    { key: "provincia", label: t('common.postulaciones.table.location'), sortable: true, render: (r) => (
      <span className="cell-name"><span>{r.localidad}</span><span className="td-sub">{tValue(r.provincia)}</span></span>
    ) },
    { key: "paisaje", label: t('common.postulaciones.table.landscape'), render: (r) => <TagRow items={tValue(r.paisaje)} max={2} /> },
    { key: "tamano", label: t('common.postulaciones.table.size'), render: (r) => <span className="muted">{tValue(r.tamano)}</span> },
    { key: "estado", label: t('common.postulaciones.table.status'), sortable: true, render: (r) => <Badge status={r.estado} /> },
    { key: "fecha", label: t('common.postulaciones.table.received'), sortable: true, render: (r) => <span className="td-mono" title={fmtDate(r.fecha)}>{relDays(r.fecha, locale)}</span> }
  ];

  const rec = useMemo(() => openId ? all.find((r) => r.id === openId) : null, [openId, all]);

  const setEstado = async (e) => {
    await PostulacionesRepository.update(openId, { estado: e });
    onToast(t('common.postulaciones.toasts.statusUpdated', { status: tValue(e) }));
    loadData();
  };

  const addNote = async (t) => {
    const user = BO.currentUser();
    const author = user?.nombre || 'Usuario';
    await PostulacionesRepository.addNote(openId, t, author);
    loadData();
  };

  const toggleArch = async () => {
    const next = !rec.archivado;
    await PostulacionesRepository.update(openId, { archivado: next });
    onToast(next ? t('common.postulaciones.toasts.archived') : t('common.postulaciones.toasts.restored'));
    loadData();
  };

  const doDelete = async () => {
    await PostulacionesRepository.delete(openId);
    onToast(t('common.postulaciones.toasts.deleted'));
    setConfirmDel(false);
    setOpenId(null);
    loadData();
  };

  if (loading) {
    return <Spinner message={t('common.postulaciones.toasts.loading')} />;
  }

  return (
    <div className="main-inner">
      <ModuleHead eyebrow={t('common.postulaciones.eyebrow')} title={t('common.postulaciones.title')}
        desc={t('common.postulaciones.desc')} />

      <div className="toolbar">
        <Search value={ctrl.q} onChange={ctrl.setQ} placeholder={t('common.postulaciones.searchPlaceholder')} />
        <Select ariaLabel={t('common.postulaciones.filterEstado')} value={estadoFilter} onChange={(v) => ctrl.setFilter("estado", v)}
          options={[{ value: "__all", label: t('common.postulaciones.allEstados') }, ...BO.ESTADOS.map(st => ({ value: st, label: tValue(st) }))]} />
        <SearchableSelect ariaLabel={t('common.postulaciones.filterProvincia')} value={provFilter} onChange={(v) => ctrl.setFilter("provincia", v)}
          options={provincias} allLabel={t('common.postulaciones.allProvincias')} placeholder={t('common.postulaciones.searchProvincia')} />
        <Select ariaLabel={t('common.postulaciones.filterArchived')} value={archFilter} onChange={(v) => ctrl.setFilter("__archived", v)}
          options={[{ value: "active", label: t('common.postulaciones.active') }, { value: "archived", label: t('common.postulaciones.archived') }]} />
      </div>

      <div className="panel-card">
        {ctrl.total === 0 ? (
          <Empty icon="clipboard-list" title={t('common.postulaciones.noApplications')}>
            {t('common.postulaciones.noApplicationsDesc')}
          </Empty>
        ) : (
          <React.Fragment>
            <DataTable columns={columns} rows={ctrl.pageRows} onRow={(r) => setOpenId(r.id)}
              sort={ctrl.sort} onSort={ctrl.toggleSort} rowClass={(r) => r.archivado ? "archived" : ""} />
            <Pagination page={ctrl.page} pages={ctrl.pages} total={ctrl.total} perPage={ctrl.perPage} onPage={ctrl.setPage} />
          </React.Fragment>
        )}
      </div>

      {rec && (
        <PostulacionModal rec={rec} onClose={() => setOpenId(null)}
          onEstado={setEstado} onNote={addNote} onArchive={toggleArch} onDelete={() => setConfirmDel(true)} />
      )}

      {confirmDel && rec && (
        <Confirm danger title={t('common.postulaciones.deleteTitle')} confirmLabel={t('common.postulaciones.deleteConfirm')}
          message={t('common.postulaciones.deleteMessage', { name: rec.nombre, lastname: rec.apellido })}
          onConfirm={doDelete} onClose={() => setConfirmDel(false)} />
      )}
    </div>
  );
}

// Custom hook to support search/filter/sort in list controller
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

export { Postulaciones };
