import React, { useState } from 'react';
import { BO } from '../../lib/store.js';
import { Icon, relDays, Badge, Btn, StatusChanger, Tag, DRow, DGroup, DxCell, DxGrid, DxSection, PhotoGallery, Notes, DetailModal } from './ui.jsx';
import { useI18n } from '../../lib/i18n/i18nContext.jsx';

export function PostulacionModal({ rec, onClose, onEstado, onNote, onArchive, onDelete }) {
  const { t, locale, tValue } = useI18n();
  const [tab, setTab] = useState("resumen");
  const L = rec.legal || {};
  const T = rec.turismo || {};
  const P = rec.participacion || {};
  const fotos = rec.fotos || [];
  const docs = rec.documentos || [];

  const tabs = [
    { key: "resumen", label: t('common.postulaciones.modal.tabs.resumen'), icon: "user" },
    { key: "terreno", label: t('common.postulaciones.modal.tabs.terreno'), icon: "mountain" },
    { key: "legal", label: t('common.postulaciones.modal.tabs.legal'), icon: "scale" },
    { key: "turismo", label: t('common.postulaciones.modal.tabs.turismo'), icon: "compass" },
    { key: "fotos", label: t('common.postulaciones.modal.tabs.fotos'), icon: "image", count: fotos.length || null },
    { key: "notas", label: t('common.postulaciones.modal.tabs.notas'), icon: "message-square", count: (rec.notas || []).length || null }
  ];

  const sub = (
    <React.Fragment>
      <span><Icon name="map-pin" />{rec.localidad}, {tValue(rec.provincia)}</span>
      <span><Icon name="calendar" />{t('common.postulaciones.table.received')} {relDays(rec.fecha, locale)}</span>
      <Badge status={rec.estado} />
    </React.Fragment>
  );

  return (
    <DetailModal kicker={t('common.postulaciones.modal.kicker')} title={rec.nombre + " " + rec.apellido} cover={fotos[0]} sub={sub}
      tabs={tabs} active={tab} onTab={setTab} onClose={onClose}
      footer={
        <React.Fragment>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="ghost" icon={rec.archivado ? "archive-restore" : "archive"} sm onClick={onArchive}>
              {rec.archivado ? t('common.postulaciones.modal.footer.restore') : t('common.postulaciones.modal.footer.archive')}
            </Btn>
            {rec.archivado && (
              <button className="btn-bo btn-danger-bo btn-sm" onClick={onDelete}><Icon name="trash-2" />{t('common.postulaciones.modal.footer.delete')}</button>
            )}
          </div>
        </React.Fragment>
      }>

      {tab === "resumen" && (
        <React.Fragment>
          <DxSection title={t('common.postulaciones.modal.sections.processStatus')}>
            <StatusChanger options={BO.ESTADOS} value={rec.estado} onChange={onEstado} />
          </DxSection>
          <div className="dx-cols">
            <DxSection title={t('common.postulaciones.modal.sections.personalData')}>
              <DxGrid>
                <DxCell label={t('common.postulaciones.modal.sections.personalFields.name')}>{rec.nombre}</DxCell>
                <DxCell label={t('common.postulaciones.modal.sections.personalFields.lastname')}>{rec.apellido}</DxCell>
                <DxCell label={t('common.postulaciones.modal.sections.personalFields.email')}><a href={"mailto:" + rec.email}>{rec.email}</a></DxCell>
                <DxCell label={t('common.postulaciones.modal.sections.personalFields.phone')}><a href={"tel:" + (rec.telefono || "").replace(/\s/g, "")}>{rec.telefono}</a></DxCell>
                <DxCell label={t('common.postulaciones.modal.sections.personalFields.relation')}>{tValue(rec.relacion)}</DxCell>
              </DxGrid>
            </DxSection>
            <DxSection title={t('common.postulaciones.modal.sections.location')}>
              <DxGrid>
                <DxCell label={t('common.postulaciones.modal.sections.locationFields.province')}>{tValue(rec.provincia)}</DxCell>
                <DxCell label={t('common.postulaciones.modal.sections.locationFields.locality')}>{rec.localidad}</DxCell>
                <DxCell label={t('common.postulaciones.modal.sections.locationFields.distance')}>{tValue(rec.distanciaCiudad)}</DxCell>
                <DxCell label={t('common.postulaciones.modal.sections.locationFields.map')} empty={!rec.mapsLink}>
                  {rec.mapsLink && (
                    <a
                      href={rec.mapsLink.startsWith('http') ? rec.mapsLink : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rec.mapsLink)}`}
                      target="_blank"
                      rel="noopener"
                    >
                      {t('common.postulaciones.modal.sections.locationFields.viewMap')}
                    </a>
                  )}
                </DxCell>
              </DxGrid>
            </DxSection>
          </div>
          {rec.comentarios && (
            <DxSection title={t('common.postulaciones.modal.sections.comments')}>
              <p className="dx-prose">{rec.comentarios}</p>
            </DxSection>
          )}
        </React.Fragment>
      )}

      {tab === "terreno" && (
        <React.Fragment>
          <DxSection title={t('common.postulaciones.modal.sections.landInfo')}>
            <DxGrid>
              <DxCell label={t('common.postulaciones.modal.sections.landFields.size')}>{tValue(rec.tamano)}</DxCell>
              <DxCell label={t('common.postulaciones.modal.sections.landFields.topography')}>{tValue(rec.topografia)}</DxCell>
              <DxCell label={t('common.postulaciones.modal.sections.landFields.landscape')}><span className="dx-pillrow">{(rec.paisaje || []).map((p, i) => <Tag key={i}>{tValue(p)}</Tag>)}</span></DxCell>
              <DxCell label={t('common.postulaciones.modal.sections.landFields.water')}>{tValue(rec.cuerpoAgua)}</DxCell>
              <DxCell label={t('common.postulaciones.modal.sections.landFields.views')}>{tValue(rec.vistas)}</DxCell>
              <DxCell label={t('common.postulaciones.modal.sections.landFields.vegetation')}>{tValue(rec.vegetacion)}</DxCell>
            </DxGrid>
          </DxSection>
          <DxSection title={t('common.postulaciones.modal.sections.access')}>
            <DxGrid>
              <DxCell label={t('common.postulaciones.modal.sections.accessFields.type')}>{tValue(rec.accesoTipo)}</DxCell>
              <DxCell label={t('common.postulaciones.modal.sections.accessFields.availability')}>{tValue(rec.accesoDisp)}</DxCell>
              <DxCell label={t('common.postulaciones.modal.sections.accessFields.constructions')}>{tValue(rec.construcciones)}</DxCell>
              <DxCell label={t('common.postulaciones.modal.sections.accessFields.services')}><span className="dx-pillrow">{(rec.servicios || []).map((s, i) => <Tag key={i}>{tValue(s)}</Tag>)}</span></DxCell>
            </DxGrid>
          </DxSection>
        </React.Fragment>
      )}

      {tab === "legal" && (
        <DxSection title={t('common.postulaciones.modal.sections.legal')}>
          <DxGrid>
            <DxCell label={t('common.postulaciones.modal.sections.legalFields.deed')}>{tValue(L.titulo)}</DxCell>
            <DxCell label={t('common.postulaciones.modal.sections.legalFields.use')}>{tValue(L.usoSuelo)}</DxCell>
            <DxCell label={t('common.postulaciones.modal.sections.legalFields.restrictions')}>{tValue(L.restricciones)}</DxCell>
            <DxCell label={t('common.postulaciones.modal.sections.legalFields.remarks')} empty={!L.observaciones}>{tValue(L.observaciones)}</DxCell>
          </DxGrid>
        </DxSection>
      )}

      {tab === "turismo" && (
        <React.Fragment>
          <DxSection title={t('common.postulaciones.modal.sections.tourism')}>
            <DxGrid>
              <DxCell label={t('common.postulaciones.modal.sections.tourismFields.activities')}><span className="dx-pillrow">{(T.actividades || []).map((a, i) => <Tag key={i}>{tValue(a)}</Tag>)}</span></DxCell>
              <DxCell label={t('common.postulaciones.modal.sections.tourismFields.attractions')}>{tValue(T.atractivos)}</DxCell>
              <DxCell label={t('common.postulaciones.modal.sections.tourismFields.demand')}>{tValue(T.demanda)}</DxCell>
            </DxGrid>
          </DxSection>
          <DxSection title={t('common.postulaciones.modal.sections.participation')}>
            <DxGrid>
              <DxCell label={t('common.postulaciones.modal.sections.participationFields.model')}>{tValue(P.modelo)}</DxCell>
              <DxCell label={t('common.postulaciones.modal.sections.participationFields.investment')}>{tValue(P.inversion)}</DxCell>
              <DxCell label={t('common.postulaciones.modal.sections.participationFields.horizon')}>{tValue(P.horizonte)}</DxCell>
            </DxGrid>
          </DxSection>
        </React.Fragment>
      )}

      {tab === "fotos" && (
        <React.Fragment>
          <DxSection title={t('common.postulaciones.modal.sections.photos')}>
            <PhotoGallery fotos={fotos} />
          </DxSection>
          <DxSection title={t('common.postulaciones.modal.sections.documentation')}>
            {docs.length === 0
              ? <p className="muted" style={{ fontSize: 13.5, margin: 0 }}>{t('common.postulaciones.modal.sections.noDocs')}</p>
              : <div className="dx-doclist">{docs.map((d, i) => (
                  <a key={i} className="dx-doc" href="#" onClick={(e) => e.preventDefault()}><Icon name="file-text" />{d.nombre}<span className="muted" style={{ marginLeft: "auto", fontSize: 11.5 }}>{tValue(d.tipo)}</span></a>
                ))}</div>}
          </DxSection>
        </React.Fragment>
      )}

      {tab === "notas" && (
        <DxSection title={t('common.postulaciones.modal.sections.internalRemarks')}>
          <Notes notas={rec.notas} onAdd={onNote} />
        </DxSection>
      )}
    </DetailModal>
  );
}
