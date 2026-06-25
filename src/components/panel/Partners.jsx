import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BO } from '../../lib/store.js';
import { PartnersRepository } from '../../repositories/index';
import { useI18n } from '../../lib/i18n/i18nContext.jsx';
import { Icon, useLucide, useStore, fmtDate, relDays, resolveImg, Badge, Tag, TagRow, ModuleHead, Search, Select, Btn, DataTable, Pagination, Empty, Drawer, DRow, DGroup, StatusChanger, Notes, Modal, FField, BarChart, showToast, ToastHost, DetailModal, DxCell, DxGrid, DxSection, PhotoGallery, ImageManager, Confirm, SearchableSelect, Toggle, useListController, STATUS_CLASS, STATUS_HUE, Spinner } from './ui.jsx';


// ============================================================
// NÓMADE — Módulo Partners.
// Establecimientos que quieren sumar experiencias a la red.
// Mismo criterio que Postulaciones: detalle en modal grande,
// colores de estado consistentes, eliminar si está archivado.
// ============================================================
function PartnerModalDetail({ rec, onClose, onEstado, onNote, onArchive, onDelete }) {
  const { t, tValue } = useI18n();
  const [tab, setTab] = useState("resumen");

  const tabs = [
    { key: "resumen", label: t('common.partners.modal.tabs.resumen'), icon: "handshake" },
    { key: "notas", label: t('common.partners.modal.tabs.notas'), icon: "message-square", count: (rec.notas || []).length || null }
  ];

  const sub = (
    <React.Fragment>
      <span><Icon name="tag" />{tValue(rec.tipo)}</span>
      <span><Icon name="map-pin" />{rec.localidad}, {rec.provincia}</span>
      <Badge status={rec.estado} />
    </React.Fragment>
  );

  return (
    <DetailModal kicker={t('common.partners.modal.kicker')} title={rec.nombre} sub={sub}
      tabs={tabs} active={tab} onTab={setTab} onClose={onClose}
      footer={
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" icon={rec.archivado ? "archive-restore" : "archive"} sm onClick={onArchive}>
            {rec.archivado ? t('common.partners.modal.footer.restore') : t('common.partners.modal.footer.archive')}
          </Btn>
          {rec.archivado && (
            <button className="btn-bo btn-danger-bo btn-sm" onClick={onDelete}><Icon name="trash-2" />{t('common.partners.modal.footer.delete')}</button>
          )}
        </div>
      }>

      {tab === "resumen" && (
        <React.Fragment>
          <DxSection title={t('common.partners.modal.sections.processStatus')}>
            <StatusChanger options={BO.ESTADOS} value={rec.estado} onChange={onEstado} />
          </DxSection>
          <div className="dx-cols">
            <DxSection title={t('common.partners.modal.sections.details')}>
              <DxGrid>
                <DxCell label={t('common.partners.modal.fields.type')}>{tValue(rec.tipo)}</DxCell>
                <DxCell label={t('common.partners.modal.fields.taxId')}>{rec.fiscal}</DxCell>
                <DxCell label={t('common.partners.modal.fields.capacity')}>{rec.capacidad}</DxCell>
                <DxCell label={t('common.partners.modal.fields.yearsOperating')}>
                  {rec.anosOperando ? rec.anosOperando + " " + (rec.anosOperando === 1 ? t('common.partners.modal.fields.year') : t('common.partners.modal.fields.years')) : t('common.partners.modal.fields.new')}
                </DxCell>
                <DxCell label={t('common.partners.modal.fields.province')}>{rec.provincia}</DxCell>
                <DxCell label={t('common.partners.modal.fields.locality')}>{rec.localidad}</DxCell>
              </DxGrid>
            </DxSection>
            <DxSection title={t('common.partners.modal.sections.contact')}>
              <DxGrid>
                <DxCell label={t('common.partners.modal.fields.email')}><a href={"mailto:" + rec.email}>{rec.email}</a></DxCell>
                <DxCell label={t('common.partners.modal.fields.phone')}><a href={"tel:" + (rec.telefono || "").replace(/\s/g, "")}>{rec.telefono}</a></DxCell>
                <DxCell label={t('common.partners.modal.fields.website')} empty={!rec.web}>{rec.web && <a href={rec.web} target="_blank" rel="noopener">{rec.web.replace(/^https?:\/\//, "")} →</a>}</DxCell>
              </DxGrid>
            </DxSection>
          </div>
          {rec.descripcion && (
            <DxSection title={t('common.partners.modal.sections.about')}>
              <p className="dx-prose">{rec.descripcion}</p>
            </DxSection>
          )}
        </React.Fragment>
      )}

      {tab === "notas" && (
        <DxSection title={t('common.partners.modal.sections.internalRemarks')}>
          <Notes notas={rec.notas} onAdd={onNote} />
        </DxSection>
      )}
    </DetailModal>
  );
}

function Partners({ onToast }) {
  useStore();
  useLucide();
  const { t, locale, tValue } = useI18n();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [confirmDel, setConfirmDel] = useState(false);

  const loadData = async () => {
    try {
      const data = await PartnersRepository.getAll();
      setAll(data || []);
    } catch (e) {
      console.error('Error al cargar partners:', e);
      onToast(t('common.partners.toasts.connError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const ctrl = useListController(all, {
    searchKeys: ["nombre", "email", "provincia", "localidad", "tipo"],
    perPage: 5, defaultSort: { key: "fecha", dir: "desc" }
  });

  const estadoFilter = ctrl.filters.estado || "__all";
  const tipoFilter = ctrl.filters.tipo || "__all";
  const archFilter = ctrl.filters.__archived || "active";

  const columns = [
    { key: "nombre", label: t('common.partners.table.establishment'), sortable: true, render: (r) => (
      <span className="cell-name"><span className="td-strong">{r.nombre}</span><span className="td-sub">{r.email}</span></span>
    ) },
    { key: "tipo", label: t('common.partners.table.type'), sortable: true, render: (r) => <Tag>{tValue(r.tipo)}</Tag> },
    { key: "provincia", label: t('common.partners.table.location'), sortable: true, render: (r) => (
      <span className="cell-name"><span>{r.localidad}</span><span className="td-sub">{r.provincia}</span></span>
    ) },
    { key: "estado", label: t('common.partners.table.status'), sortable: true, render: (r) => <Badge status={r.estado} /> },
    { key: "fecha", label: t('common.partners.table.received'), sortable: true, render: (r) => <span className="td-mono" title={fmtDate(r.fecha)}>{relDays(r.fecha, locale)}</span> }
  ];

  const rec = useMemo(() => openId ? all.find((r) => r.id === openId) : null, [openId, all]);
  
  const setEstado = async (e) => {
    await PartnersRepository.update(openId, { estado: e });
    onToast(t('common.partners.toasts.statusUpdated', { status: tValue(e) }));
    loadData();
  };
  
  const addNote = async (tOption) => {
    const user = BO.currentUser();
    const author = user?.nombre || 'Usuario';
    await PartnersRepository.addNote(openId, tOption, author);
    loadData();
  };
  
  const toggleArch = async () => {
    const next = !rec.archivado;
    await PartnersRepository.update(openId, { archivado: next });
    onToast(next ? t('common.partners.toasts.archived') : t('common.partners.toasts.restored'));
    loadData();
  };
  
  const doDelete = async () => {
    await PartnersRepository.delete(openId);
    onToast(t('common.partners.toasts.deleted'));
    setConfirmDel(false);
    setOpenId(null);
    loadData();
  };

  if (loading) {
    return <Spinner message={t('common.partners.toasts.loading')} />;
  }

  return (
    <div className="main-inner">
      <ModuleHead eyebrow={t('common.partners.eyebrow')} title={t('common.partners.title')}
        desc={t('common.partners.desc')} />

      <div className="toolbar">
        <Search value={ctrl.q} onChange={ctrl.setQ} placeholder={t('common.partners.searchPlaceholder')} />
        <Select ariaLabel={t('common.partners.filterEstado')} value={estadoFilter} onChange={(v) => ctrl.setFilter("estado", v)}
          options={[{ value: "__all", label: t('common.partners.allEstados') }, ...BO.ESTADOS.map(e => ({ value: e, label: tValue(e) }))]} />
        <SearchableSelect ariaLabel={t('common.partners.filterTipo')} value={tipoFilter} onChange={(v) => ctrl.setFilter("tipo", v)}
          options={BO.TIPOS_ESTAB.map(tOption => ({ value: tOption, label: tValue(tOption) }))} allLabel={t('common.partners.allTipos')} placeholder={t('common.partners.searchTipo')} />
        <Select ariaLabel={t('common.partners.filterArchived')} value={archFilter} onChange={(v) => ctrl.setFilter("__archived", v)}
          options={[{ value: "active", label: t('common.partners.active') }, { value: "archived", label: t('common.partners.archived') }]} />
      </div>

      <div className="panel-card">
        {ctrl.total === 0 ? (
          <Empty icon="handshake" title={t('common.partners.noPartners')}>
            {t('common.partners.noPartnersDesc')}
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
        <PartnerModalDetail rec={rec} onClose={() => setOpenId(null)}
          onEstado={setEstado} onNote={addNote} onArchive={toggleArch} onDelete={() => setConfirmDel(true)} />
      )}

      {confirmDel && rec && (
        <Confirm danger title={t('common.partners.deleteTitle')} confirmLabel={t('common.partners.deleteConfirm')}
          message={t('common.partners.deleteMessage', { nombre: rec.nombre })}
          onConfirm={doDelete} onClose={() => setConfirmDel(false)} />
      )}
    </div>
  );
}

export { Partners };
