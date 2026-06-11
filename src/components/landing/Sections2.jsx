import React, { useState, useEffect } from 'react';
import { Icon, Eyebrow, useLucide } from './primitives.jsx';
import { ARGENTINA } from '../../lib/argentina.js';
// NÓMADE — 5 Destinations worth discovering (potential) · 6 How we create destinations (model)

function DestinoModal({ name, region, onClose }) {
  useLucide();
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const photos = region ? region.photos : [];
  const n = photos.length;

  // reset carousel + zoom whenever the destination changes
  useEffect(() => {setIdx(0);setZoom(false);}, [name]);

  useEffect(() => {
    if (!region) return;
    const onKey = (e) => {
      if (e.key === "Escape") {if (zoom) {setZoom(false);} else {onClose();}} else
      if (e.key === "ArrowRight") {setZoom(false);setIdx((i) => (i + 1) % n);} else
      if (e.key === "ArrowLeft") {setZoom(false);setIdx((i) => (i - 1 + n) % n);}
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
  }, [region, onClose, zoom, n]);

  if (!region) return null;

  const go = (dir) => {setZoom(false);setIdx((i) => (i + dir + n) % n);};
  const onMove = (e) => {
    if (!zoom) return;
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({ x: (e.clientX - r.left) / r.width * 100, y: (e.clientY - r.top) / r.height * 100 });
  };

  return (
    <div className="destino-modal" role="dialog" aria-modal="true" aria-label={name} onClick={onClose}>
      <div className="destino-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="destino-close" onClick={onClose} aria-label="Cerrar"><Icon name="x" /></button>

        <div className="destino-carousel">
          <div
            className={"destino-stage" + (zoom ? " zoomed" : "")}
            onClick={() => setZoom((z) => !z)}
            onMouseMove={onMove}
            onMouseLeave={() => setZoom(false)}
            role="button"
            tabIndex={0}
            aria-label={zoom ? "Alejar imagen" : "Acercar imagen"}>

            {photos.map((src, i) =>
            <div
              key={i}
              className={"destino-slide" + (i === idx ? " on" : "")}
              role="img"
              aria-label={name + " — imagen " + (i + 1) + " de " + n}
              style={{
                backgroundImage: `url(${src})`,
                backgroundColor: "#3a4a3d",
                transform: i === idx && zoom ? "scale(2.1)" : "scale(1)",
                transformOrigin: `${origin.x}% ${origin.y}%`
              }}>
            </div>
            )}
            <span className="destino-zoom-hint" aria-hidden="true">
              <Icon name={zoom ? "zoom-out" : "zoom-in"} />{zoom ? "Mové el cursor para explorar" : "Tocá para acercar"}
            </span>
            {n > 1 &&
            <React.Fragment>
              <button className="destino-arrow prev" onClick={(e) => {e.stopPropagation();go(-1);}} aria-label="Imagen anterior"><Icon name="chevron-left" /></button>
              <button className="destino-arrow next" onClick={(e) => {e.stopPropagation();go(1);}} aria-label="Imagen siguiente"><Icon name="chevron-right" /></button>
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
              onClick={() => {setZoom(false);setIdx(i);}}>
            </button>
            )}
          </div>
          }
        </div>

        <div className="destino-body">
          <span className="destino-tag">En exploración</span>
          <h3 className="destino-name">{name}</h3>
          <p className="destino-geo">{region.geo}</p>
          <p className="destino-desc">{region.desc}</p>
          <div className="destino-actions">
            <a className="destino-cta" href={region.book} target="_blank" rel="noopener noreferrer">Ir a reservar<Icon name="arrow-up-right" /></a>
            <span className="destino-meta">Reservá a través de nuestros partners de alojamiento.</span>
          </div>
        </div>
      </div>
    </div>);

}

function Destinations({ d }) {
  const A = ARGENTINA;
  const [active, setActive] = useState(null);
  const [open, setOpen] = useState(null);
  return (
    <section className="section sand has-band" id="destinos">
      <div className="wrap">
        <div className="section-head">
          <Eyebrow>{d.eyebrow}</Eyebrow>
          <h2>{d.h2}</h2>
          <p className="lead">{d.lead}</p>
        </div>
        <div className="types">
          {d.types.map((t, i) =>
          <figure className="type-frame" key={i}>
              <div className="type-img" style={{ backgroundImage: `url(${t.img})`, backgroundColor: "#3a4a3d" }}></div>
              <figcaption className="type-cap">{t.cap}</figcaption>
            </figure>
          )}
        </div>
        <p className="types-note"><Icon name="info" />{d.note}</p>
      </div>

      {/* Regions in exploration — map */}
      <div className="destinos-map">
        <div className="wrap">
          <div className="map-intro">
            <Eyebrow onDark>{d.mapEyebrow}</Eyebrow>
            <h3 className="map-h">{d.mapH}</h3>
            <p className="map-lead">{d.mapLead}</p>
          </div>
          <div className="map-grid">
            <div className="map-side">
              <div className="region-list">
                {A.pins.map((p, i) =>
                <button
                  className={"region" + (active === p.name ? " active" : "")}
                  key={p.name}
                  onMouseEnter={() => setActive(p.name)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(p.name)}
                  onBlur={() => setActive(null)}
                  onClick={() => setOpen(p.name)}
                  aria-haspopup="dialog">

                    <span className="region-thumb" aria-hidden="true" style={{ backgroundImage: `url(${d.regions[p.name].photos[0]})` }}></span>
                    <span className="region-text">
                      <span className="rname">{p.name}</span>
                      <span className="rgeo">{d.regions[p.name].geo}</span>
                    </span>
                    <span className="region-go" aria-hidden="true"><Icon name="arrow-up-right" /></span>
                  </button>
                )}
              </div>
            </div>
            <div className="map-figure">
            <div className="map-canvas">
                <div className="map-terrain" style={{ backgroundImage: `url(${d.terrain})` }}></div>
                <svg className="map-svg" viewBox={A.viewBox} preserveAspectRatio="xMidYMid meet">
                  <path className="map-path" d={A.path} />
                  {A.pins.map((p) => {
                      const on = active === p.name;
                      return (
                        <g key={p.name} className={"map-pin" + (on ? " on" : "")}
                        onMouseEnter={() => setActive(p.name)} onMouseLeave={() => setActive(null)}
                        onClick={() => setOpen(p.name)}>
                        <circle className="map-ping" cx={p.x} cy={p.y} r="5" />
                        <circle className="map-halo" cx={p.x} cy={p.y} r="10" />
                        <circle className="map-dot" cx={p.x} cy={p.y} r="3.4" />
                      </g>);

                    })}
                </svg>
                {A.pins.map((p) =>
                  <span
                    key={p.name}
                    className={"map-label" + (active === p.name ? " on" : "") + (p.xp > 50 ? " flip" : "")}
                    style={{ left: p.xp + "%", top: p.yp + "%" }}>
                  {p.name}</span>
                  )}
            </div>
            <p className="map-disclaimer-below">{d.disclaimer}</p>
            </div>
          </div>
        </div>
      </div>
      <DestinoModal name={open} region={open ? d.regions[open] : null} onClose={() => setOpen(null)} />
    </section>);

}

function Model({ d }) {
  return (
    <section className="section" id="modelo">
      <div className="wrap">
        <div className="section-head center" style={{ marginInline: "auto" }}>
          <Eyebrow center>{d.eyebrow}</Eyebrow>
          <h2>{d.h2}</h2>
          <p className="lead">{d.lead}</p>
        </div>
        <div className="equation">
          <div className="eq-terms eq-3">
            {d.parts.map((p, i) =>
            <React.Fragment key={i}>
                <div className="eq-term">
                  <span className="eq-ic"><Icon name={p.icon} /></span>
                  <h3>{p.h}</h3>
                  <p>{p.p}</p>
                </div>
                {i < d.parts.length - 1 && <span className="eq-op" aria-hidden="true">+</span>}
              </React.Fragment>
            )}
          </div>
          <div className="eq-rule"><span className="eq-eq" aria-hidden="true">=</span></div>
          <div className="eq-result">
            <span className="eq-result-mark"><Icon name="map-pin" /></span>
            <div>
              <h3>{d.result.h}</h3>
              <p>{d.result.p}</p>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

export { Destinations, Model };
