import React, { useState } from 'react';
import { BO } from '../../lib/store.js';
import { Icon, relDays, Badge, Btn, StatusChanger, Tag, DRow, DGroup, DxCell, DxGrid, DxSection, PhotoGallery, Notes, DetailModal } from './ui.jsx';

export function PostulacionModal({ rec, onClose, onEstado, onNote, onArchive, onDelete }) {
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
