import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BO } from '../../lib/store.js';
import { PartnersRepository } from '../../repositories/index';
import { Icon, useLucide, useStore, fmtDate, relDays, resolveImg, Badge, Tag, TagRow, ModuleHead, Search, Select, Btn, DataTable, Pagination, Empty, Drawer, DRow, DGroup, StatusChanger, Notes, Modal, FField, BarChart, showToast, ToastHost, DetailModal, DxCell, DxGrid, DxSection, PhotoGallery, ImageManager, Confirm, SearchableSelect, Toggle, useListController, STATUS_CLASS, STATUS_HUE, Spinner } from './ui.jsx';


// ============================================================
// NÓMADE — Módulo Partners.
// Establecimientos que quieren sumar experiencias a la red.
// Mismo criterio que Postulaciones: detalle en modal grande,
// colores de estado consistentes, eliminar si está archivado.
// ============================================================
function PartnerModalDetail({ rec, onClose, onEstado, onNote, onArchive, onDelete }) {
  const [tab, setTab] = useState("resumen");
  const fotos = rec.fotos || [];

  const tabs = [
    { key: "resumen", label: "Resumen", icon: "handshake" },
    { key: "fotos", label: "Fotos", icon: "image", count: fotos.length || null },
    { key: "notas", label: "Notas", icon: "message-square", count: (rec.notas || []).length || null }
  ];

  const sub = (
    <React.Fragment>
      <span><Icon name="tag" />{rec.tipo}</span>
      <span><Icon name="map-pin" />{rec.localidad}, {rec.provincia}</span>
      <Badge status={rec.estado} />
    </React.Fragment>
  );

  return (
    <DetailModal kicker="Partner" title={rec.nombre} cover={fotos[0]} sub={sub}
      tabs={tabs} active={tab} onTab={setTab} onClose={onClose}
      footer={
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" icon={rec.archivado ? "archive-restore" : "archive"} sm onClick={onArchive}>
            {rec.archivado ? "Restaurar" : "Archivar"}
          </Btn>
          {rec.archivado && (
            <button className="btn-bo btn-danger-bo btn-sm" onClick={onDelete}><Icon name="trash-2" />Eliminar definitivamente</button>
          )}
        </div>
      }>

      {tab === "resumen" && (
        <React.Fragment>
          <DxSection title="Estado del proceso">
            <StatusChanger options={BO.ESTADOS} value={rec.estado} onChange={onEstado} />
          </DxSection>
          <div className="dx-cols">
            <DxSection title="Datos del establecimiento">
              <DxGrid>
                <DxCell label="Tipo">{rec.tipo}</DxCell>
                <DxCell label="Número fiscal">{rec.fiscal}</DxCell>
                <DxCell label="Capacidad">{rec.capacidad}</DxCell>
                <DxCell label="Años operando">{rec.anosOperando ? rec.anosOperando + (rec.anosOperando === 1 ? " año" : " años") : "Nuevo"}</DxCell>
                <DxCell label="Provincia">{rec.provincia}</DxCell>
                <DxCell label="Localidad">{rec.localidad}</DxCell>
              </DxGrid>
            </DxSection>
            <DxSection title="Contacto">
              <DxGrid>
                <DxCell label="Email"><a href={"mailto:" + rec.email}>{rec.email}</a></DxCell>
                <DxCell label="Teléfono"><a href={"tel:" + (rec.telefono || "").replace(/\s/g, "")}>{rec.telefono}</a></DxCell>
                <DxCell label="Sitio web" empty={!rec.web}>{rec.web && <a href={rec.web} target="_blank" rel="noopener">{rec.web.replace(/^https?:\/\//, "")} →</a>}</DxCell>
              </DxGrid>
            </DxSection>
          </div>
          {rec.descripcion && (
            <DxSection title="Sobre el establecimiento">
              <p className="dx-prose">{rec.descripcion}</p>
            </DxSection>
          )}
        </React.Fragment>
      )}

      {tab === "fotos" && (
        <DxSection title="Fotografías del establecimiento">
          <PhotoGallery fotos={fotos} empty="El partner no adjuntó imágenes." />
        </DxSection>
      )}

      {tab === "notas" && (
        <DxSection title="Observaciones internas">
          <Notes notas={rec.notas} onAdd={onNote} />
        </DxSection>
      )}
    </DetailModal>
  );
}

function Partners({ onToast }) {
  useStore();
  useLucide();
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
      onToast('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const ctrl = useListController(all, {
    searchKeys: ["nombre", "email", "provincia", "localidad", "tipo"],
    perPage: 8, defaultSort: { key: "fecha", dir: "desc" }
  });

  const estadoFilter = ctrl.filters.estado || "__all";
  const tipoFilter = ctrl.filters.tipo || "__all";
  const archFilter = ctrl.filters.__archived || "active";

  const columns = [
    { key: "nombre", label: "Establecimiento", sortable: true, render: (r) => (
      <span className="cell-name"><span className="td-strong">{r.nombre}</span><span className="td-sub">{r.email}</span></span>
    ) },
    { key: "tipo", label: "Tipo", sortable: true, render: (r) => <Tag>{r.tipo}</Tag> },
    { key: "provincia", label: "Ubicación", sortable: true, render: (r) => (
      <span className="cell-name"><span>{r.localidad}</span><span className="td-sub">{r.provincia}</span></span>
    ) },
    { key: "estado", label: "Estado", sortable: true, render: (r) => <Badge status={r.estado} /> },
    { key: "fecha", label: "Recibido", sortable: true, render: (r) => <span className="td-mono" title={fmtDate(r.fecha)}>{relDays(r.fecha)}</span> }
  ];

  const rec = useMemo(() => openId ? all.find((r) => r.id === openId) : null, [openId, all]);
  
  const setEstado = async (e) => {
    await PartnersRepository.update(openId, { estado: e });
    onToast("Estado actualizado a “" + e + "”.");
    loadData();
  };
  
  const addNote = async (t) => {
    await PartnersRepository.addNote(openId, t);
    loadData();
  };
  
  const toggleArch = async () => {
    const next = !rec.archivado;
    await PartnersRepository.update(openId, { archivado: next });
    onToast(next ? "Partner archivado." : "Partner restaurado.");
    loadData();
  };
  
  const doDelete = async () => {
    await PartnersRepository.delete(openId);
    onToast("Partner eliminado definitivamente.");
    setConfirmDel(false);
    setOpenId(null);
    loadData();
  };

  if (loading) {
    return <Spinner message="Cargando partners..." />;
  }

  return (
    <div className="main-inner">
      <ModuleHead eyebrow="Módulo" title="Partners"
        desc="Establecimientos que quieren sumar sus experiencias a la red NÓMADE. Llegan desde el formulario Partner de la web y desde contactos directos." />

      <div className="toolbar">
        <Search value={ctrl.q} onChange={ctrl.setQ} placeholder="Buscar por establecimiento, email o ubicación…" />
        <Select ariaLabel="Filtrar por estado" value={estadoFilter} onChange={(v) => ctrl.setFilter("estado", v)}
          options={[{ value: "__all", label: "Todos los estados" }, ...BO.ESTADOS]} />
        <SearchableSelect ariaLabel="Filtrar por tipo" value={tipoFilter} onChange={(v) => ctrl.setFilter("tipo", v)}
          options={BO.TIPOS_ESTAB} allLabel="Todos los tipos" placeholder="Buscar tipo…" />
        <Select ariaLabel="Archivados" value={archFilter} onChange={(v) => ctrl.setFilter("__archived", v)}
          options={[{ value: "active", label: "Activos" }, { value: "archived", label: "Archivados" }]} />
      </div>

      <div className="panel-card">
        {ctrl.total === 0 ? (
          <Empty icon="handshake" title="Sin partners">
            No hay establecimientos que coincidan con la búsqueda o los filtros actuales.
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
        <Confirm danger title="Eliminar partner" confirmLabel="Eliminar definitivamente"
          message={"Vas a eliminar a “" + rec.nombre + "”. Esta acción no se puede deshacer."}
          onConfirm={doDelete} onClose={() => setConfirmDel(false)} />
      )}
    </div>
  );
}

export { Partners };
