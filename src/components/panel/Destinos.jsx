import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BO } from '../../lib/store.js';
import { DestinosRepository } from '../../repositories/index';
import { Icon, useLucide, useStore, fmtDate, relDays, resolveImg, Badge, Tag, TagRow, ModuleHead, Search, Select, Btn, DataTable, Pagination, Empty, Drawer, DRow, DGroup, StatusChanger, Notes, Modal, FField, BarChart, showToast, ToastHost, DetailModal, DxCell, DxGrid, DxSection, PhotoGallery, ImageManager, Confirm, SearchableSelect, Toggle, useListController, STATUS_CLASS, STATUS_HUE, Spinner } from './ui.jsx';

// ============================================================
// NÓMADE — Módulo Destinos (ABM).
// Las experiencias de hospedaje de la red. ABM completo:
// habilitar/deshabilitar, nombre del complejo, galería de fotos
// (agregar/eliminar) y eliminación definitiva de archivados.
// ============================================================
function DestinoForm({ rec, onClose, onSave }) {
  const blank = { nombre: "", complejo: "", ubicacion: "", estado: "No disponible", reserva: "", descripcion: "", fotos: [], imagen: "" };
  const [v, setV] = useState(rec ? { ...rec, fotos: (rec.fotos && rec.fotos.length ? rec.fotos.slice() : (rec.imagen ? [rec.imagen] : [])) } : blank);
  const [err, setErr] = useState({});
  const set = (k) => (e) => { setV((s) => ({ ...s, [k]: e.target.value })); setErr((x) => ({ ...x, [k]: undefined })); };
  const habilitado = v.estado === "Disponible";

  const save = () => {
    const e = {};
    if (!v.nombre.trim()) e.nombre = "Ingresá un nombre.";
    if (!v.ubicacion.trim()) e.ubicacion = "Ingresá la ubicación.";
    if (habilitado && !v.reserva.trim()) e.reserva = "Un destino habilitado necesita un link de reserva.";
    if (habilitado && (!v.fotos || v.fotos.length === 0)) e.fotos = "Agregá al menos una foto antes de habilitar.";
    if (Object.keys(e).length) { setErr(e); return; }
    onSave({ ...v, imagen: (v.fotos && v.fotos[0]) || "" });
  };

  return (
    <Modal kicker={rec ? "Editar destino" : "Nuevo destino"} title={rec ? rec.nombre : "Crear un destino"} wide
      subtitle={rec ? "Actualizá la información de este destino de la red." : "Sumá una nueva experiencia de hospedaje a la red NÓMADE."}
      onClose={onClose}
      footer={<React.Fragment><Btn variant="ghost" onClick={onClose}>Cancelar</Btn><Btn variant="primary" icon="check" onClick={save}>{rec ? "Guardar cambios" : "Crear destino"}</Btn></React.Fragment>}>

      {/* publicación */}
      <div className="dest-publish">
        <div>
          <p className="dest-publish-h">{habilitado ? "Destino habilitado" : "Destino deshabilitado"}</p>
          <p className="dest-publish-p">{habilitado ? "Visible en la landing como destino disponible." : "Oculto para los visitantes hasta que lo habilites."}</p>
        </div>
        <Toggle checked={habilitado} onChange={(e) => setV((s) => ({ ...s, estado: e.target.checked ? "Disponible" : "No disponible" }))} />
      </div>

      <div className="f-grid">
        <FField label="Nombre del destino" required error={err.nombre}>
          <input value={v.nombre} onChange={set("nombre")} placeholder="Ej.: Bariloche" />
        </FField>
        <FField label="Nombre del complejo" hint="El nombre propio del lugar. Ej.: Complejo Arcoíris.">
          <input value={v.complejo} onChange={set("complejo")} placeholder="Ej.: Complejo Arcoíris" />
        </FField>
        <FField label="Ubicación" required error={err.ubicacion} full hint="Provincia y tipo de paisaje. Ej.: Río Negro · Lagos y bosque andino">
          <input value={v.ubicacion} onChange={set("ubicacion")} placeholder="Provincia · paisaje" />
        </FField>
        <FField label="Link del botón de reserva" error={err.reserva} full hint="A dónde lleva «Reservar» en la landing.">
          <input value={v.reserva} onChange={set("reserva")} placeholder="https://…" />
        </FField>
        <FField label="Fotografías" full error={err.fotos} hint="La primera imagen es la portada. Arrastrá para subir, pegá una URL o elegí de la galería.">
          <ImageManager fotos={v.fotos} onChange={(fotos) => { setV((s) => ({ ...s, fotos })); setErr((x) => ({ ...x, fotos: undefined })); }} />
        </FField>
        <FField label="Descripción" full hint="Texto que se muestra en la landing.">
          <textarea value={v.descripcion} onChange={set("descripcion")} rows="4" placeholder="Describí la experiencia y el entorno del destino…" />
        </FField>
      </div>
    </Modal>
  );
}

function Destinos({ onToast }) {
  useStore();
  useLucide();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(undefined); // undefined = closed, null = new, id = edit
  const [delId, setDelId] = useState(null);

  const loadData = async () => {
    try {
      const data = await DestinosRepository.getAll();
      setAll(data || []);
    } catch (e) {
      console.error('Error al cargar destinos:', e);
      onToast('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const ctrl = useListController(all, { searchKeys: ["nombre", "complejo", "ubicacion"], perPage: 8, defaultSort: { key: "fecha", dir: "desc" } });
  const estadoFilter = ctrl.filters.estado || "__all";
  const archFilter = ctrl.filters.__archived || "active";

  const thumbOf = (r) => (r.fotos && r.fotos[0]) || r.imagen;

  const columns = [
    { key: "imagen", label: "", width: "76px", render: (r) => <span className="dest-thumb" style={thumbOf(r) ? { backgroundImage: "url(" + resolveImg(thumbOf(r)) + ")" } : null}></span> },
    { key: "nombre", label: "Destino", sortable: true, render: (r) => (
      <span className="cell-name"><span className="td-strong">{r.nombre}</span><span className="td-sub">{r.complejo ? r.complejo + " · " : ""}{r.ubicacion}</span></span>
    ) },
    { key: "fotos", label: "Fotos", render: (r) => <span className="muted">{(r.fotos || (r.imagen ? [r.imagen] : [])).length}</span> },
    { key: "estado", label: "Estado", sortable: true, render: (r) => <Badge status={r.estado} /> },
    { key: "reserva", label: "Reserva", render: (r) => r.reserva
      ? <a href={r.reserva} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()} style={{ color: "var(--accent-deep)", textDecoration: "none", fontSize: 13 }}><Icon name="external-link" style={{ width: 13, height: 13, verticalAlign: "-2px", marginRight: 4 }} />Link</a>
      : <span className="muted">—</span> }
  ];

  const saveDest = async (v) => {
    if (editId) {
      await DestinosRepository.update(editId, v);
      onToast("Destino actualizado.");
    } else {
      await DestinosRepository.create({ ...v, archivado: false });
      onToast("Destino creado.");
    }
    setEditId(undefined);
    loadData();
  };

  const rec = useMemo(() => editId ? all.find((r) => r.id === editId) : null, [editId, all]);
  const delRec = useMemo(() => delId ? all.find((r) => r.id === delId) : null, [delId, all]);

  const toggleArch = async (r, e) => {
    e.stopPropagation();
    const next = !r.archivado;
    await DestinosRepository.update(r.id, { archivado: next });
    onToast(next ? "Destino archivado." : "Destino restaurado.");
    loadData();
  };

  const doDelete = async () => {
    await DestinosRepository.delete(delId);
    onToast("Destino eliminado definitivamente.");
    setDelId(null);
    loadData();
  };

  if (loading) {
    return <Spinner message="Cargando destinos..." />;
  }

  const cols = columns.concat([
    { key: "arch", label: "", width: "92px", align: "right", render: (r) => (
      <span style={{ display: "inline-flex", gap: 6, justifyContent: "flex-end" }} onClick={(e) => e.stopPropagation()}>
        <button className="btn-bo btn-ghost-bo icon-btn" title={r.archivado ? "Restaurar" : "Archivar"} onClick={(e) => toggleArch(r, e)}>
          <Icon name={r.archivado ? "archive-restore" : "archive"} />
        </button>
        {r.archivado && (
          <button className="btn-bo btn-ghost-bo icon-btn icon-btn-danger" title="Eliminar definitivamente" onClick={(e) => { e.stopPropagation(); setDelId(r.id); }}>
            <Icon name="trash-2" />
          </button>
        )}
      </span>
    ) }
  ]);

  return (
    <div className="main-inner">
      <ModuleHead eyebrow="Módulo" title="Destinos"
        desc="Las experiencias de hospedaje de la red NÓMADE. Creá, editá y publicá destinos; lo que habilites es lo que ve el visitante." />

      <div className="toolbar">
        <Search value={ctrl.q} onChange={ctrl.setQ} placeholder="Buscar por destino o complejo…" />
        <Select ariaLabel="Filtrar por estado" value={estadoFilter} onChange={(v) => ctrl.setFilter("estado", v)}
          options={[{ value: "__all", label: "Todos los estados" }, "Disponible", "No disponible"]} />
        <Select ariaLabel="Archivados" value={archFilter} onChange={(v) => ctrl.setFilter("__archived", v)}
          options={[{ value: "active", label: "Activos" }, { value: "archived", label: "Archivados" }]} />
        <div className="toolbar-spacer"></div>
        <Btn variant="primary" icon="plus" onClick={() => setEditId(null)}>Nuevo destino</Btn>
      </div>

      <div className="panel-card">
        {ctrl.total === 0 ? (
          <Empty icon="map-pin" title="Sin destinos">Creá el primer destino de la red con «Nuevo destino».</Empty>
        ) : (
          <React.Fragment>
            <DataTable columns={cols} rows={ctrl.pageRows} onRow={(r) => setEditId(r.id)} sort={ctrl.sort} onSort={ctrl.toggleSort} rowClass={(r) => r.archivado ? "archived" : ""} />
            <Pagination page={ctrl.page} pages={ctrl.pages} total={ctrl.total} perPage={ctrl.perPage} onPage={ctrl.setPage} />
          </React.Fragment>
        )}
      </div>

      {editId !== undefined && <DestinoForm rec={rec} onClose={() => setEditId(undefined)} onSave={saveDest} />}
      {delRec && (
        <Confirm danger title="Eliminar destino" confirmLabel="Eliminar definitivamente"
          message={"Vas a eliminar “" + delRec.nombre + "” y todas sus fotos. Esta acción no se puede deshacer."}
          onConfirm={doDelete} onClose={() => setDelId(null)} />
      )}
    </div>
  );
}

export { Destinos };
