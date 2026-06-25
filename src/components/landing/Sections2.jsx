import React, { useState, useEffect, useRef } from 'react';
import { Icon, Eyebrow, useLucide } from './primitives.jsx';
import { resolveImg } from '../panel/ui/Helpers.jsx';
import { DestinosRepository } from '../../repositories/index.ts';
import { useI18n } from '../../lib/i18n/i18nContext.jsx';

// NÓMADE — 5 Destinations worth discovering (potential) · 6 How we create destinations (model)

function DestinoModal({ destino, onClose }) {
  const { t } = useI18n();
  useLucide();
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const photos = destino ? destino.photos : [];
  const n = photos.length;

  // reset carousel + zoom whenever the destination changes
  useEffect(() => { setIdx(0); setZoom(false); }, [destino]);

  useEffect(() => {
    if (!destino) return;
    const onKey = (e) => {
      if (e.key === "Escape") { if (zoom) { setZoom(false); } else { onClose(); } } else
        if (e.key === "ArrowRight") { setZoom(false); setIdx((i) => (i + 1) % n); } else
          if (e.key === "ArrowLeft") { setZoom(false); setIdx((i) => (i - 1 + n) % n); }
    };
    document.addEventListener("keydown", onKey);
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [destino, onClose, zoom, n]);

  if (!destino) return null;

  const go = (dir) => { setZoom(false); setIdx((i) => (i + dir + n) % n); };
  const onMove = (e) => {
    if (!zoom) return;
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({ x: (e.clientX - r.left) / r.width * 100, y: (e.clientY - r.top) / r.height * 100 });
  };

  return (
    <div className="destino-modal" role="dialog" aria-modal="true" aria-label={destino.name} onClick={onClose}>
      <div className="destino-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="destino-close" onClick={onClose} aria-label={t('landing.destinations.close')}><Icon name="x" /></button>

        <div className="destino-carousel">
          <div
            className={"destino-stage" + (zoom ? " zoomed" : "")}
            onClick={() => setZoom((z) => !z)}
            onMouseMove={onMove}
            onMouseLeave={() => setZoom(false)}
            role="button"
            tabIndex={0}
            aria-label={zoom ? t('landing.destinations.zoomOut') : t('landing.destinations.zoomIn')}>

            {photos.map((src, i) =>
              <div
                key={i}
                className={"destino-slide" + (i === idx ? " on" : "")}
                role="img"
                aria-label={destino.name + " — imagen " + (i + 1) + " de " + n}
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundColor: "#3a4a3d",
                  transform: i === idx && zoom ? "scale(2.1)" : "scale(1)",
                  transformOrigin: `${origin.x}% ${origin.y}%`
                }}>
              </div>
            )}
            <span className="destino-zoom-hint" aria-hidden="true">
              <Icon name={zoom ? "zoom-out" : "zoom-in"} />{zoom ? t('landing.destinations.exploreCursor') : t('landing.destinations.zoomIn')}
            </span>
            {n > 1 &&
              <React.Fragment>
                <button className="destino-arrow prev" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label={t('landing.destinations.previous')}><Icon name="chevron-left" /></button>
                <button className="destino-arrow next" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label={t('landing.destinations.next')}><Icon name="chevron-right" /></button>
                <span className="destino-counter" aria-hidden="true">{idx + 1} / {n}</span>
              </React.Fragment>
            }
          </div>

          {n > 1 &&
            <div className="destino-thumbs" role="tablist" aria-label="Galería de imágenes">
              {photos.map((src, i) =>
                <button
                  key={i}
                  className={"destino-thumb" + (i === idx ? " on" : "")}
                  role="tab"
                  aria-selected={i === idx}
                  aria-label={"Ver imagen " + (i + 1)}
                  style={{ backgroundImage: `url(${src})`, backgroundColor: "#3a4a3d" }}
                  onClick={() => { setZoom(false); setIdx(i); }}>
                </button>
              )}
            </div>
          }
        </div>

        <div className="destino-body">
          <span className="destino-tag">{t('landing.destinations.exploring')}</span>
          <h3 className="destino-name">{destino.name}</h3>
          <p className="destino-geo">{destino.geo}</p>
          <p className="destino-desc">{destino.desc}</p>
          {destino.book && (
            <div className="destino-actions">
              <a className="destino-cta" href={destino.book} target="_blank" rel="noopener noreferrer">{t('landing.destinations.book')}<Icon name="arrow-up-right" /></a>
              <span className="destino-meta">{t('landing.destinations.partnerMeta')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DestinosExplorer({ destinos, onOpen, isPreview }) {
  const { t } = useI18n();
  const [zone, setZone] = useState("");
  const [sort, setSort] = useState("region");
  const [edges, setEdges] = useState({ start: true, end: false });
  const trackRef = useRef(null);

  const zoneOf = (d) => d.geo.split("·")[0].trim();
  const zones = Array.from(new Set(destinos.map(zoneOf))).sort((a, b) => a.localeCompare(b, "es"));

  const shown = destinos
    .filter((d) => !zone || zoneOf(d) === zone)
    .sort((a, b) => {
      if (sort === "nombre") {
        return a.name.localeCompare(b.name, "es");
      }
      return zoneOf(a).localeCompare(zoneOf(b), "es") || a.name.localeCompare(b.name, "es");
    });

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 });
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    requestAnimationFrame(updateEdges);
  }, [zone, sort]);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(".dcard");
    const amt = card ? card.offsetWidth + 18 : 340;
    el.scrollBy({ left: dir * amt, behavior: "smooth" });
  };

  return (
    <div className="dexp">
      <div className="dexp-controls">
        <div className="dexp-selects">
          <label className="dexp-select">
            <span className="dexp-select-label">{t('landing.destinations.region')}</span>
            <span className="dexp-select-field">
              <select value={zone} onChange={(e) => setZone(e.target.value)} aria-label="Filtrar por región">
                <option value="">{t('landing.destinations.allRegions')}</option>
                {zones.map((z) => <option key={z} value={z}>{z}</option>)}
              </select>
              <Icon name="chevron-down" />
            </span>
          </label>
          <label className="dexp-select">
            <span className="dexp-select-label">{t('landing.destinations.orderBy')}</span>
            <span className="dexp-select-field">
              <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Ordenar destinos">
                <option value="region">{t('landing.destinations.byRegion')}</option>
                <option value="nombre">{t('landing.destinations.byName')}</option>
              </select>
              <Icon name="chevron-down" />
            </span>
          </label>
        </div>
        <div className="dexp-nav">
          <span className="dexp-count">{shown.length} {shown.length === 1 ? t('landing.destinations.destination') : t('landing.destinations.destinations')}</span>
          <div className="dexp-arrows">
            <button className="dexp-arrow" onClick={() => scrollBy(-1)} disabled={edges.start} aria-label={t('landing.destinations.previous')}><Icon name="chevron-left" /></button>
            <button className="dexp-arrow" onClick={() => scrollBy(1)} disabled={edges.end} aria-label={t('landing.destinations.next')}><Icon name="chevron-right" /></button>
          </div>
        </div>
      </div>

      <div className="dexp-track" ref={trackRef} onScroll={updateEdges}>
        {shown.map((d) => (
          <button className="dcard" key={d.id} onClick={() => !isPreview && onOpen(d)} style={isPreview ? { cursor: "default" } : {}} aria-haspopup={isPreview ? undefined : "dialog"} aria-label={isPreview ? d.name : "Ver destino " + d.name}>
            <span className="dcard-img" style={{ backgroundImage: `url(${d.photos[0] || ''})`, backgroundColor: "#3a4a3d" }} aria-hidden="true"></span>
            <span className="dcard-scrim" aria-hidden="true"></span>
            <span className="dcard-body">
              <span className="dcard-tag">{t('landing.destinations.exploring')}</span>
              <span className="dcard-name">{d.name}</span>
              <span className="dcard-geo">{d.geo}</span>
              <span className="dcard-go">{t('landing.destinations.viewDestination')}<Icon name="arrow-up-right" /></span>

            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Destinations(props) {
  const { locale, t } = useI18n();
  const d = props.d || props;
  const isPreview = props.isPreview || false;
  const [openDestino, setOpenDestino] = useState(null);
  const [destinosList, setDestinosList] = useState([]);
  const [hasActiveDestinos, setHasActiveDestinos] = useState(false);

  const types = d.types || [];

  useEffect(() => {
    let active = true;
    DestinosRepository.getPublished().then(data => {
      if (active) {
        if (data && data.length > 0) {
          setHasActiveDestinos(true);
          const mapped = data.map(destino => {
            const photos = [];
            if (destino.imagen) {
              photos.push(resolveImg(destino.imagen));
            }
            if (Array.isArray(destino.fotos)) {
              destino.fotos.forEach(f => {
                if (f) {
                  const resolved = resolveImg(f);
                  if (!photos.includes(resolved)) {
                    photos.push(resolved);
                  }
                }
              });
            }

            let name = destino.nombre;
            let geo = destino.ubicacion;
            let desc = destino.descripcion;

            if (locale === 'en' && destino.translations?.en) {
              const en = destino.translations.en;
              if (en.nombre) name = en.nombre;
              if (en.ubicacion) geo = en.ubicacion;
              if (en.descripcion) desc = en.descripcion;
            }

            return {
              id: destino.id,
              name: name,
              geo: geo,
              desc: desc,
              photos: photos,
              book: destino.reserva || ''
            };
          });
          setDestinosList(mapped);
        } else {
          setHasActiveDestinos(false);
          setDestinosList(mapFallback(d.regions));
        }
      }
    }).catch(err => {
      console.error("Error loading active destinations:", err);
      if (active) {
        setHasActiveDestinos(false);
        setDestinosList(mapFallback(d.regions));
      }
    });
    return () => { active = false; };
  }, [d.regions, locale]);

  const mapFallback = (regions) => {
    if (!regions) return [];
    return Object.keys(regions).map(name => {
      const r = regions[name];
      return {
        id: name,
        name: name,
        geo: r.geo || '',
        desc: r.desc || '',
        photos: (r.photos || []).map(p => resolveImg(p)),
        book: r.book || ''
      };
    });
  };

  return (
    <section className="section sand has-band" id="destinos">
      <div className="wrap">
        <div className="section-head">
          {d.eyebrow && <Eyebrow>{d.eyebrow}</Eyebrow>}
          <h2>{d.h2}</h2>
          {d.lead && <p className="lead">{d.lead}</p>}
        </div>
        {types.length > 0 && (
          <div className="types">
            {types.map((t, i) => {
              const typeImg = resolveImg(t.img);
              return (
                <figure className="type-frame" key={i}>
                  <div className="type-img" style={{ backgroundImage: typeImg ? `url(${typeImg})` : undefined, backgroundColor: "#3a4a3d" }}></div>
                  <figcaption className="type-cap">{t.cap}</figcaption>
                </figure>
              );
            })}
          </div>
        )}
        {d.note && <p className="types-note"><Icon name="info" />{d.note}</p>}
      </div>

      <hr className="destinos-separator" style={{ border: "none", borderTop: "1px solid var(--line)", opacity: 0.25, margin: "0" }} />

      <div className="destinos-map">
        <div className="wrap">
          <div className="map-intro">
            {d.mapEyebrow && <Eyebrow onDark>{d.mapEyebrow}</Eyebrow>}
            <h3 className="map-h">{d.mapH}</h3>
            {d.mapLead && <p className="map-lead">{d.mapLead}</p>}
          </div>
          {destinosList.length > 0 && (
            <DestinosExplorer destinos={destinosList} onOpen={setOpenDestino} isPreview={isPreview} />
          )}
          {!hasActiveDestinos && d.disclaimer && (
            <p className="map-disclaimer-below">
              <Icon name="info" />
              {d.disclaimer}
            </p>
          )}
        </div>
      </div>
      <DestinoModal destino={openDestino} onClose={() => setOpenDestino(null)} />
    </section>
  );
}

function Model(props) {
  const d = props.d || props;
  const parts = d.parts || [];

  return (
    <section className="section" id="modelo">
      <div className="wrap">
        <div className="section-head center" style={{ marginInline: "auto" }}>
          {d.eyebrow && <Eyebrow center>{d.eyebrow}</Eyebrow>}
          <h2>{d.h2}</h2>
          {d.lead && <p className="lead">{d.lead}</p>}
        </div>
        <div className="equation">
          <div className="eq-terms eq-3">
            {parts.map((p, i) =>
              <React.Fragment key={i}>
                <div className="eq-term">
                  <span className="eq-ic"><Icon name={p.icon} /></span>
                  <h3>{p.h}</h3>
                  <p>{p.p}</p>
                </div>
                {i < parts.length - 1 && <span className="eq-op" aria-hidden="true">+</span>}
              </React.Fragment>
            )}
          </div>
          <div className="eq-rule"><span className="eq-eq" aria-hidden="true">=</span></div>
          {d.result && (
            <div className="eq-result">
              <span className="eq-result-mark"><Icon name="map-pin" /></span>
              <div>
                <h3>{d.result.h}</h3>
                <p>{d.result.p}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export { Destinations, Model };
