import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BO } from '../../lib/store.js';
import { Icon, useLucide, useStore, fmtDate, relDays, resolveImg, Badge, Tag, TagRow, ModuleHead, Search, Select, Btn, DataTable, Pagination, Empty, Drawer, DRow, DGroup, StatusChanger, Notes, Modal, FField, BarChart, showToast, ToastHost, DetailModal, DxCell, DxGrid, DxSection, PhotoGallery, ImageManager, Confirm, SearchableSelect, Toggle, useListController, STATUS_CLASS, STATUS_HUE } from './ui.jsx';

// ============================================================
// NÓMADE — Módulo Postulaciones.
// Personas que postulan un terreno para convertirse en destino.
// Detalle en modal grande con tabs (reemplaza el sidebar).
// Muestra toda la información enviada por el postulante.
// ============================================================
function PostulacionModal({ rec, onClose, onEstado, onNote, onArchive, onDelete }) {
  const [tab, setTab] = useState("resumen");
  const L = rec.legal || {};
  const T = rec.turismo || {};
  const P = rec.participacion || {};
  const fotos = rec.fotos || [];
  const docs = rec.documentos || [];

  const tabs = [
    { key: "resumen", label: "Resumen", icon: "user" },
    { key: "terreno", label: "Terreno", icon: "mountain" },
    { key: "legal", label: "Legal", icon: "scale" },
    { key: "turismo", label: "Turismo", icon: "compass" },
    { key: "fotos", label: "Fotos", icon: "image", count: fotos.length || null },
    { key: "notas", label: "Notas", icon: "message-square", count: (rec.notas || []).length || null }
  ];

  const sub = (
    <React.Fragment>
      <span><Icon name="map-pin" />{rec.localidad}, {rec.provincia}</span>
      <span><Icon name="calendar" />Recibida {relDays(rec.fecha)}</span>
      <Badge status={rec.estado} />
    </React.Fragment>
  );

  return (
    <DetailModal kicker="Postulación" title={rec.nombre + " " + rec.apellido} cover={fotos[0]} sub={sub}
      tabs={tabs} active={tab} onTab={setTab} onClose={onClose}
      footer={
        <React.Fragment>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="ghost" icon={rec.archivado ? "archive-restore" : "archive"} sm onClick={onArchive}>
              {rec.archivado ? "Restaurar" : "Archivar"}
            </Btn>
            {rec.archivado && (
              <button className="btn-bo btn-danger-bo btn-sm" onClick={onDelete}><Icon name="trash-2" />Eliminar definitivamente</button>
            )}
          </div>
        </React.Fragment>
      }>

      {tab === "resumen" && (
        <React.Fragment>
          <DxSection title="Estado del proceso">
            <StatusChanger options={BO.ESTADOS} value={rec.estado} onChange={onEstado} />
          </DxSection>
          <div className="dx-cols">
            <DxSection title="Datos personales">
              <DxGrid>
                <DxCell label="Nombre">{rec.nombre}</DxCell>
                <DxCell label="Apellido">{rec.apellido}</DxCell>
                <DxCell label="Email"><a href={"mailto:" + rec.email}>{rec.email}</a></DxCell>
                <DxCell label="Teléfono"><a href={"tel:" + (rec.telefono || "").replace(/\s/g, "")}>{rec.telefono}</a></DxCell>
                <DxCell label="Relación con el terreno">{rec.relacion}</DxCell>
              </DxGrid>
            </DxSection>
            <DxSection title="Ubicación">
              <DxGrid>
                <DxCell label="Provincia">{rec.provincia}</DxCell>
                <DxCell label="Localidad o paraje">{rec.localidad}</DxCell>
                <DxCell label="Distancia a ciudad">{rec.distanciaCiudad}</DxCell>
                <DxCell label="Mapa / coordenadas" empty={!rec.mapsLink}>
                  {rec.mapsLink && <a href={rec.mapsLink} target="_blank" rel="noopener">Ver en Google Maps →</a>}
                </DxCell>
              </DxGrid>
            </DxSection>
          </div>
          {rec.comentarios && (
            <DxSection title="Comentarios del postulante">
              <p className="dx-prose">{rec.comentarios}</p>
            </DxSection>
          )}
        </React.Fragment>
      )}

      {tab === "terreno" && (
        <React.Fragment>
          <DxSection title="Información del terreno">
            <DxGrid>
              <DxCell label="Tamaño">{rec.tamano}</DxCell>
              <DxCell label="Topografía">{rec.topografia}</DxCell>
              <DxCell label="Tipo de paisaje"><span className="dx-pillrow">{(rec.paisaje || []).map((p, i) => <Tag key={i}>{p}</Tag>)}</span></DxCell>
              <DxCell label="Cuerpo de agua">{rec.cuerpoAgua}</DxCell>
              <DxCell label="Vistas predominantes">{rec.vistas}</DxCell>
              <DxCell label="Vegetación">{rec.vegetacion}</DxCell>
            </DxGrid>
          </DxSection>
          <DxSection title="Acceso y servicios">
            <DxGrid>
              <DxCell label="Tipo de acceso">{rec.accesoTipo}</DxCell>
              <DxCell label="Disponibilidad de acceso">{rec.accesoDisp}</DxCell>
              <DxCell label="Construcciones existentes">{rec.construcciones}</DxCell>
              <DxCell label="Servicios disponibles"><span className="dx-pillrow">{(rec.servicios || []).map((s, i) => <Tag key={i}>{s}</Tag>)}</span></DxCell>
            </DxGrid>
          </DxSection>
        </React.Fragment>
      )}

      {tab === "legal" && (
        <DxSection title="Aspectos legales">
          <DxGrid>
            <DxCell label="Título de propiedad">{L.titulo}</DxCell>
            <DxCell label="Uso del suelo">{L.usoSuelo}</DxCell>
            <DxCell label="Restricciones ambientales">{L.restricciones}</DxCell>
            <DxCell label="Observaciones legales" empty={!L.observaciones}>{L.observaciones}</DxCell>
          </DxGrid>
        </DxSection>
      )}

      {tab === "turismo" && (
        <React.Fragment>
          <DxSection title="Turismo">
            <DxGrid>
              <DxCell label="Actividades posibles"><span className="dx-pillrow">{(T.actividades || []).map((a, i) => <Tag key={i}>{a}</Tag>)}</span></DxCell>
              <DxCell label="Atractivos cercanos">{T.atractivos}</DxCell>
              <DxCell label="Demanda turística de la zona">{T.demanda}</DxCell>
            </DxGrid>
          </DxSection>
          <DxSection title="Participación">
            <DxGrid>
              <DxCell label="Modelo de interés">{P.modelo}</DxCell>
              <DxCell label="Disponibilidad de inversión">{P.inversion}</DxCell>
              <DxCell label="Horizonte temporal">{P.horizonte}</DxCell>
            </DxGrid>
          </DxSection>
        </React.Fragment>
      )}

      {tab === "fotos" && (
        <React.Fragment>
          <DxSection title="Fotografías del terreno">
            <PhotoGallery fotos={fotos} />
          </DxSection>
          <DxSection title="Documentación">
            {docs.length === 0
              ? <p className="muted" style={{ fontSize: 13.5, margin: 0 }}>El postulante no adjuntó documentación.</p>
              : <div className="dx-doclist">{docs.map((d, i) => (
                  <a key={i} className="dx-doc" href="#" onClick={(e) => e.preventDefault()}><Icon name="file-text" />{d.nombre}<span className="muted" style={{ marginLeft: "auto", fontSize: 11.5 }}>{d.tipo}</span></a>
                ))}</div>}
          </DxSection>
        </React.Fragment>
      )}

      {tab === "notas" && (
        <DxSection title="Observaciones internas">
          <Notes notas={rec.notas} onAdd={onNote} />
        </DxSection>
      )}
    </DetailModal>
  );
}

function Postulaciones({ onToast }) {
  useStore();
  useLucide();
  const all = BO.all("postulaciones");
  const [openId, setOpenId] = useState(null);
  const [confirmDel, setConfirmDel] = useState(false);

  const ctrl = useListController(all, {
    searchKeys: ["nombre", "apellido", "email", "provincia", "localidad"],
    perPage: 8, defaultSort: { key: "fecha", dir: "desc" }
  });

  const estadoFilter = ctrl.filters.estado || "__all";
  const provFilter = ctrl.filters.provincia || "__all";
  const archFilter = ctrl.filters.__archived || "active";

  const provincias = useMemo(() => Array.from(new Set(all.map((r) => r.provincia))).sort(), [all]);

  const columns = [
    { key: "nombre", label: "Postulante", sortable: true, render: (r) => (
      <span className="cell-name"><span className="td-strong">{r.nombre} {r.apellido}</span><span className="td-sub">{r.email}</span></span>
    ) },
    { key: "provincia", label: "Ubicación", sortable: true, render: (r) => (
      <span className="cell-name"><span>{r.localidad}</span><span className="td-sub">{r.provincia}</span></span>
    ) },
    { key: "paisaje", label: "Paisaje", render: (r) => <TagRow items={r.paisaje} max={2} /> },
    { key: "tamano", label: "Tamaño", render: (r) => <span className="muted">{r.tamano}</span> },
    { key: "estado", label: "Estado", sortable: true, render: (r) => <Badge status={r.estado} /> },
    { key: "fecha", label: "Recibida", sortable: true, render: (r) => <span className="td-mono" title={fmtDate(r.fecha)}>{relDays(r.fecha)}</span> }
  ];

  const rec = openId ? BO.get("postulaciones", openId) : null;

  const setEstado = (e) => { BO.update("postulaciones", openId, { estado: e }); onToast("Estado actualizado a “" + e + "”."); };
  const addNote = (t) => { BO.addNote("postulaciones", openId, t); };
  const toggleArch = () => {
    const next = !rec.archivado;
    BO.update("postulaciones", openId, { archivado: next });
    onToast(next ? "Postulación archivada." : "Postulación restaurada.");
  };
  const doDelete = () => {
    BO.remove("postulaciones", openId);
    onToast("Postulación eliminada definitivamente.");
    setConfirmDel(false); setOpenId(null);
  };

  return (
    <div className="main-inner">
      <ModuleHead eyebrow="Módulo" title="Postulaciones"
        desc="Personas que postulan un terreno para convertirse en un destino NÓMADE. Revisá, contactá y movelas por el proceso de evaluación." />

      <div className="toolbar">
        <Search value={ctrl.q} onChange={ctrl.setQ} placeholder="Buscar por nombre, email o ubicación…" />
        <Select ariaLabel="Filtrar por estado" value={estadoFilter} onChange={(v) => ctrl.setFilter("estado", v)}
          options={[{ value: "__all", label: "Todos los estados" }, ...BO.ESTADOS]} />
        <SearchableSelect ariaLabel="Filtrar por provincia" value={provFilter} onChange={(v) => ctrl.setFilter("provincia", v)}
          options={provincias} allLabel="Todas las provincias" placeholder="Buscar provincia…" />
        <Select ariaLabel="Archivadas" value={archFilter} onChange={(v) => ctrl.setFilter("__archived", v)}
          options={[{ value: "active", label: "Activas" }, { value: "archived", label: "Archivadas" }]} />
      </div>

      <div className="panel-card">
        {ctrl.total === 0 ? (
          <Empty icon="clipboard-list" title="Sin postulaciones">
            No hay postulaciones que coincidan con la búsqueda o los filtros actuales.
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
        <Confirm danger title="Eliminar postulación" confirmLabel="Eliminar definitivamente"
          message={"Vas a eliminar la postulación de " + rec.nombre + " " + rec.apellido + ". Esta acción no se puede deshacer."}
          onConfirm={doDelete} onClose={() => setConfirmDel(false)} />
      )}
    </div>
  );
}

export { Postulaciones };
