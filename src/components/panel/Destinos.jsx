import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BO } from '../../lib/store.js';
import { DestinosRepository } from '../../repositories/index';
import { useI18n } from '../../lib/i18n/i18nContext.jsx';
import { Icon, useLucide, useStore, fmtDate, relDays, resolveImg, Badge, Tag, TagRow, ModuleHead, Search, Select, Btn, DataTable, Pagination, Empty, Drawer, DRow, DGroup, StatusChanger, Notes, Modal, FField, BarChart, showToast, ToastHost, DetailModal, DxCell, DxGrid, DxSection, PhotoGallery, ImageManager, Confirm, SearchableSelect, Toggle, useListController, STATUS_CLASS, STATUS_HUE, Spinner } from './ui.jsx';

// ============================================================
// NÓMADE — Módulo Destinos (ABM).
// Las experiencias de hospedaje de la red. ABM completo:
// habilitar/deshabilitar, nombre del complejo, galería de fotos
// (agregar/eliminar) y eliminación definitiva de archivados.
// ============================================================
function DestinoForm({ rec, onClose, onSave }) {
  const { t } = useI18n();
  const blank = { nombre: "", complejo: "", ubicacion: "", estado: "No disponible", reserva: "", descripcion: "", fotos: [], imagen: "", translations: {} };
  const [v, setV] = useState(rec ? { ...rec, fotos: (rec.fotos && rec.fotos.length ? rec.fotos.slice() : (rec.imagen ? [rec.imagen] : [])), translations: rec.translations || {} } : blank);
  const [err, setErr] = useState({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("es"); // "es" or "en"
  
  const habilitado = v.estado === "Disponible";

  const getUbicacionParts = (str) => {
    if (!str) return { provincia: "", paisaje: "" };
    const parts = str.split("·");
    return {
      provincia: parts[0] ? parts[0].trim() : "",
      paisaje: parts[1] ? parts[1].trim() : ""
    };
  };

  const initialParts = getUbicacionParts(v.ubicacion);
  const [provincia, setProvincia] = useState(initialParts.provincia);
  const [paisaje, setPaisaje] = useState(initialParts.paisaje);

  // English translation fields state
  const enTrans = v.translations?.en || {};
  const enParts = getUbicacionParts(enTrans.ubicacion || "");
  const [enNombre, setEnNombre] = useState(enTrans.nombre || "");
  const [enComplejo, setEnComplejo] = useState(enTrans.complejo || "");
  const [enProvincia, setEnProvincia] = useState(enParts.provincia || "");
  const [enPaisaje, setEnPaisaje] = useState(enParts.paisaje || "");
  const [enDescripcion, setEnDescripcion] = useState(enTrans.descripcion || "");

  const set = (k) => (e) => {
    setV((s) => ({ ...s, [k]: e.target.value }));
    setErr((x) => ({ ...x, [k]: undefined }));
  };

  const save = async () => {
    const e = {};
    if (!v.nombre.trim()) e.nombre = t('common.errors.required');
    if (!provincia.trim()) e.provincia = t('common.errors.required');
    if (!paisaje.trim()) e.paisaje = t('common.errors.required');
    if (habilitado && (!v.fotos || v.fotos.length === 0)) e.fotos = t('destinations.fields.photos') + " is required.";
    if (Object.keys(e).length) { setErr(e); return; }
    
    setSaving(true);
    try {
      const combinedUbicacion = provincia.trim() + " · " + paisaje.trim();
      const translations = { ...v.translations };
      const enCombinedUbicacion = enProvincia.trim() || enPaisaje.trim() ? enProvincia.trim() + " · " + enPaisaje.trim() : "";
      
      if (enNombre.trim() || enComplejo.trim() || enCombinedUbicacion || enDescripcion.trim()) {
        translations.en = {
          nombre: enNombre.trim(),
          complejo: enComplejo.trim(),
          ubicacion: enCombinedUbicacion,
          descripcion: enDescripcion.trim()
        };
      } else {
        delete translations.en;
      }

      await onSave({
        ...v,
        ubicacion: combinedUbicacion,
        imagen: (v.fotos && v.fotos[0]) || "",
        translations
      });
    } catch (error) {
      console.error("Error al guardar destino:", error);
      setSaving(false);
    }
  };

  return (
    <Modal kicker={rec ? t('destinations.edit') : t('destinations.new')} title={rec ? rec.nombre : t('destinations.new')} wide
      subtitle={rec ? t('destinations.form.editSubtitle') : t('destinations.form.newSubtitle')}
      onClose={onClose}
      footer={
        <React.Fragment>
          <Btn variant="ghost" onClick={onClose} disabled={saving}>{t('common.actions.cancel')}</Btn>
          <Btn 
            variant="primary" 
            icon={saving ? undefined : "check"} 
            onClick={save} 
            disabled={saving}
          >
            {saving ? (
              <React.Fragment>
                <span className="spinner spinner-sm on-dark" style={{ marginRight: 8, verticalAlign: "middle" }}></span>
                {t('common.actions.saving')}
              </React.Fragment>
            ) : (
              rec ? t('common.actions.saveChanges') : t('destinations.new')
            )}
          </Btn>
        </React.Fragment>
      }>

      {/* publicación */}
      <div className="dest-publish">
        <div>
          <p className="dest-publish-h">{habilitado ? t('destinations.form.enabled') : t('destinations.form.disabled')}</p>
          <p className="dest-publish-p">{habilitado ? t('destinations.form.enabledDesc') : t('destinations.form.disabledDesc')}</p>
        </div>
        <Toggle checked={habilitado} onChange={(e) => setV((s) => ({ ...s, estado: e.target.checked ? "Disponible" : "No disponible" }))} disabled={saving} />
      </div>

      {/* Tab Switcher */}
      <div className="tabs-nav" style={{ display: "flex", gap: 12, borderBottom: "1px solid var(--border-color)", paddingBottom: 8, marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setActiveTab("es")}
          className={`tab-btn ${activeTab === "es" ? "active" : ""}`}
          style={{
            padding: "8px 16px",
            border: "none",
            background: "none",
            borderBottom: activeTab === "es" ? "2px solid var(--accent-deep)" : "none",
            color: activeTab === "es" ? "var(--fg-color)" : "var(--muted-color)",
            fontWeight: activeTab === "es" ? "bold" : "normal",
            cursor: "pointer"
          }}
        >
          {t('destinations.form.tabs.es')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("en")}
          className={`tab-btn ${activeTab === "en" ? "active" : ""}`}
          style={{
            padding: "8px 16px",
            border: "none",
            background: "none",
            borderBottom: activeTab === "en" ? "2px solid var(--accent-deep)" : "none",
            color: activeTab === "en" ? "var(--fg-color)" : "var(--muted-color)",
            fontWeight: activeTab === "en" ? "bold" : "normal",
            cursor: "pointer"
          }}
        >
          {t('destinations.form.tabs.en')}
        </button>
      </div>

      {activeTab === "es" ? (
        <div className="f-grid">
          <FField label={t('destinations.fields.name')} required error={err.nombre}>
            <input value={v.nombre} onChange={set("nombre")} placeholder={t('destinations.form.fields.provincePlaceholder')} disabled={saving} />
          </FField>
          <FField label={t('destinations.fields.complex')} hint={t('destinations.form.fields.complexHint')}>
            <input value={v.complejo} onChange={set("complejo")} placeholder={t('destinations.form.fields.complexPlaceholder')} disabled={saving} />
          </FField>
          <FField label={t('destinations.form.fields.province')} required error={err.provincia} hint={t('destinations.form.fields.provinceHint')}>
            <input value={provincia} onChange={(e) => { setProvincia(e.target.value); setErr(x => ({ ...x, provincia: undefined })); }} placeholder={t('destinations.form.fields.provincePlaceholder')} disabled={saving} />
          </FField>
          <FField label={t('destinations.form.fields.landscape')} required error={err.paisaje} hint={t('destinations.form.fields.landscapeHint')}>
            <input value={paisaje} onChange={(e) => { setPaisaje(e.target.value); setErr(x => ({ ...x, paisaje: undefined })); }} placeholder={t('destinations.form.fields.landscapePlaceholder')} disabled={saving} />
          </FField>
          <FField label={t('destinations.fields.reservationUrl')} error={err.reserva} full hint={t('destinations.form.fields.reservationUrlHint')}>
            <input value={v.reserva} onChange={set("reserva")} placeholder="https://…" disabled={saving} />
          </FField>
          <FField label={t('destinations.fields.photos')} full error={err.fotos} hint={t('destinations.form.fields.photosHint')}>
            <ImageManager fotos={v.fotos} onChange={(fotos) => { setV((s) => ({ ...s, fotos })); setErr((x) => ({ ...x, fotos: undefined })); }} />
          </FField>
          <FField label={t('destinations.fields.description')} full hint={t('destinations.form.fields.descriptionHint')}>
            <textarea value={v.descripcion} onChange={set("descripcion")} rows="4" placeholder={t('destinations.form.fields.descriptionPlaceholder')} disabled={saving} />
          </FField>
        </div>
      ) : (
        <div>
          <p style={{ color: "var(--muted-color)", fontSize: "14px", marginBottom: "16px" }}>
            {t('destinations.translationTab.desc')}
          </p>
          <div className="f-grid">
            <FField label={t('destinations.translationTab.name')}>
              <input value={enNombre} onChange={(e) => setEnNombre(e.target.value)} placeholder={t('destinations.form.translationTab.provincePlaceholder')} disabled={saving} />
            </FField>
            <FField label={t('destinations.form.translationTab.complexLabel')} hint={t('destinations.form.translationTab.complexHint')}>
              <input value={enComplejo} onChange={(e) => setEnComplejo(e.target.value)} placeholder={t('destinations.form.translationTab.complexPlaceholder')} disabled={saving} />
            </FField>
            <FField label={t('destinations.form.translationTab.provinceLabel')} hint={t('destinations.form.translationTab.provinceHint')}>
              <input value={enProvincia} onChange={(e) => setEnProvincia(e.target.value)} placeholder={t('destinations.form.translationTab.provincePlaceholder')} disabled={saving} />
            </FField>
            <FField label={t('destinations.form.translationTab.landscapeLabel')} hint={t('destinations.form.translationTab.landscapeHint')}>
              <input value={enPaisaje} onChange={(e) => setEnPaisaje(e.target.value)} placeholder={t('destinations.form.translationTab.landscapePlaceholder')} disabled={saving} />
            </FField>
            <FField label={t('destinations.translationTab.description')} full>
              <textarea value={enDescripcion} onChange={(e) => setEnDescripcion(e.target.value)} rows="4" placeholder={t('destinations.form.translationTab.descriptionPlaceholder')} disabled={saving} />
            </FField>
          </div>
        </div>
      )}
    </Modal>
  );
}

function Destinos({ onToast }) {
  useStore();
  useLucide();
  const { t, locale, tValue } = useI18n();
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
      onToast(t('common.errors.network'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const ctrl = useListController(all, { searchKeys: ["nombre", "complejo", "ubicacion"], perPage: 5, defaultSort: { key: "fecha", dir: "desc" } });
  const estadoFilter = ctrl.filters.estado || "__all";
  const archFilter = ctrl.filters.__archived || "active";

  const thumbOf = (r) => (r.fotos && r.fotos[0]) || r.imagen;

  const columns = [
    { key: "imagen", label: "", width: "76px", render: (r) => <span className="dest-thumb" style={thumbOf(r) ? { backgroundImage: "url(" + resolveImg(thumbOf(r)) + ")" } : null}></span> },
    { key: "nombre", label: t('destinations.fields.name'), sortable: true, render: (r) => (
      <span className="cell-name"><span className="td-strong">{r.nombre}</span><span className="td-sub">{r.complejo ? r.complejo + " · " : ""}{r.ubicacion}</span></span>
    ) },
    { key: "fotos", label: t('destinations.fields.photos'), render: (r) => <span className="muted">{(r.fotos || (r.imagen ? [r.imagen] : [])).length}</span> },
    { key: "estado", label: t('destinations.fields.status'), sortable: true, render: (r) => <Badge status={r.estado} /> },
    { key: "reserva", label: t('destinations.fields.reservationUrl'), render: (r) => r.reserva
      ? <a href={r.reserva} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()} style={{ color: "var(--accent-deep)", textDecoration: "none", fontSize: 13 }}><Icon name="external-link" style={{ width: 13, height: 13, verticalAlign: "-2px", marginRight: 4 }} />Link</a>
      : <span className="muted">—</span> }
  ];

  const saveDest = async (v) => {
    if (editId) {
      await DestinosRepository.update(editId, v);
      onToast(t('destinations.toasts.saved'));
    } else {
      await DestinosRepository.create({ ...v, archivado: false });
      onToast(t('destinations.toasts.saved'));
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
    onToast(next ? t('destinations.toasts.archived') : t('destinations.toasts.restored'));
    loadData();
  };

  const doDelete = async () => {
    await DestinosRepository.delete(delId);
    onToast(t('destinations.toasts.deleted'));
    setDelId(null);
    loadData();
  };

  if (loading) {
    return <Spinner message={t('destinations.toasts.loading')} />;
  }

  const cols = columns.concat([
    { key: "arch", label: "", width: "92px", align: "right", render: (r) => (
      <span style={{ display: "inline-flex", gap: 6, justifyContent: "flex-end" }} onClick={(e) => e.stopPropagation()}>
        <button className="btn-bo btn-ghost-bo icon-btn" title={r.archivado ? t('common.actions.unarchive') : t('common.actions.archive')} onClick={(e) => toggleArch(r, e)}>
          <Icon name={r.archivado ? "archive-restore" : "archive"} />
        </button>
        {r.archivado && (
          <button className="btn-bo btn-ghost-bo icon-btn icon-btn-danger" title={t('common.actions.delete')} onClick={(e) => { e.stopPropagation(); setDelId(r.id); }}>
            <Icon name="trash-2" />
          </button>
        )}
      </span>
    ) }
  ]);

  return (
    <div className="main-inner">
      <ModuleHead eyebrow={t('destinations.eyebrow')} title={t('destinations.title')}
        desc={t('destinations.desc')} />

      <div className="toolbar">
        <Search value={ctrl.q} onChange={ctrl.setQ} placeholder={t('destinations.searchPlaceholder')} />
        <Select ariaLabel={t('destinations.filterEstado')} value={estadoFilter} onChange={(v) => ctrl.setFilter("estado", v)}
          options={[{ value: "__all", label: t('destinations.allEstados') }, ...["Disponible", "No disponible"].map(st => ({ value: st, label: tValue(st) }))]} />
        <Select ariaLabel={t('destinations.filterArchived')} value={archFilter} onChange={(v) => ctrl.setFilter("__archived", v)}
          options={[{ value: "active", label: t('destinations.active') }, { value: "archived", label: t('destinations.archived') }]} />
        <div className="toolbar-spacer"></div>
        <Btn variant="primary" icon="plus" onClick={() => setEditId(null)}>{t('destinations.new')}</Btn>
      </div>

      <div className="panel-card">
        {ctrl.total === 0 ? (
          <Empty icon="map-pin" title={t('destinations.noDestinations')}>{t('destinations.noDestinationsDesc')}</Empty>
        ) : (
          <React.Fragment>
            <DataTable columns={cols} rows={ctrl.pageRows} onRow={(r) => setEditId(r.id)} sort={ctrl.sort} onSort={ctrl.toggleSort} rowClass={(r) => r.archivado ? "archived" : ""} />
            <Pagination page={ctrl.page} pages={ctrl.pages} total={ctrl.total} perPage={ctrl.perPage} onPage={ctrl.setPage} />
          </React.Fragment>
        )}
      </div>

      {editId !== undefined && <DestinoForm rec={rec} onClose={() => setEditId(undefined)} onSave={saveDest} />}
      {delRec && (
        <Confirm danger title={t('destinations.deleteTitle')} confirmLabel={t('destinations.deleteConfirm')}
          message={t('destinations.deleteMessage', { nombre: delRec.nombre })}
          onConfirm={doDelete} onClose={() => setDelId(null)} />
      )}
    </div>
  );
}

export { Destinos };
