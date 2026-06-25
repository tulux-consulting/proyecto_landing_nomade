import React, { useState, useEffect, useRef } from 'react';
import { Icon, Eyebrow, Button, useReveal, scrollToId } from './primitives.jsx';
import { resolveImg } from '../panel/ui/Helpers.jsx';
import { useI18n } from '../../lib/i18n/i18nContext.jsx';
// NÓMADE — 1 Hero · 3 What is NÓMADE · 4 The Experience · 4.5 Audience split

function Hero(props) {
  const { t } = useI18n();
  const d = props.d || props;
  const eyebrow = d.eyebrow;
  const imgUrl = resolveImg(d.imagen || d.img);
  const title = d.titulo || `${d.h1a || ""} ${d.h1b || ""}`.trim();
  const sub = d.subtitulo || `${d.sub1 || ""} ${d.sub2 || ""}`.trim();
  const lead = d.lead;
  const cta = d.cta;

  const titleParts = title ? title.split(/(?<=\.)\s+/) : [];

  return (
    <header className="hero" id="top">
      <div className="hero-img" role="img" aria-label="Viajero contemplando un paisaje de montaña a la hora dorada" style={{ backgroundImage: imgUrl ? `url(${imgUrl})` : undefined, backgroundColor: "#3a4a3d" }}></div>
      <div className="hero-scrim" aria-hidden="true"></div>
      <div className="hero-content">
        <div className="wrap">
          {eyebrow && <Eyebrow onDark>{eyebrow}</Eyebrow>}
          <h1 className="hero-h1">
            {titleParts.length > 0 ? titleParts.map((part, i) => <span key={i}>{part}</span>) : <span>{title}</span>}
          </h1>
          {sub && (
            <p className="hero-couplet">
              {sub}
            </p>
          )}
          {lead && <p className="hero-lead">{lead}</p>}
          <div className="hero-actions">
            <Button variant="ivory" icon="arrow-right" onClick={() => scrollToId("que-es")}>{cta}</Button>
          </div>
        </div>
      </div>
      <button className="scroll-hint" onClick={() => scrollToId("que-es")} aria-label={t('landing.hero.scrollHintAria')}>
        <span>{t('landing.hero.scrollHint')}</span><Icon name="chevron-down" />
      </button>
    </header>);
}

function WhatIs(props) {
  const d = props.d || props;
  const ref = useReveal();
  return (
    <section className="section" id="que-es" aria-labelledby="que-es-title">
      <div className="wrap">
        <div className="section-head center" style={{ marginInline: "auto" }}>
          {d.eyebrow && <Eyebrow center>{d.eyebrow}</Eyebrow>}
          <h2 id="que-es-title">{d.h2}</h2>
          {d.lead && <p className="lead">{d.lead}</p>}
        </div>
        {d.points && d.points.length > 0 && (
          <ul className="whatis-grid reveal-group" ref={ref}>
            {d.points.map((p, i) =>
            <li className="whatis-item" key={i} style={{ "--i": i }}>
                <span className="whatis-ic" aria-hidden="true"><Icon name={p.icon || "compass"} /></span>
                <h3>{p.h}</h3>
                <p>{p.p}</p>
              </li>
            )}
          </ul>
        )}
      </div>
    </section>);
}

function Experience(props) {
  const d = props.d || props;
  const ref = useReveal();
  const imgUrl = resolveImg(d.imagen || d.img);
  const pillars = d.pillars || d.items || [];
  const statement = d.statement || [];

  const ICONS = ["drafting-compass", "flower-2", "shield", "hand-heart", "map", "badge-check"];

  return (
    <section className="section forest" id="experiencia" aria-labelledby="exp-title">
      <div className="wrap">
        <div className="exp-top">
          <div className="section-head">
            {d.eyebrow && <Eyebrow onDark>{d.eyebrow}</Eyebrow>}
            <h2 id="exp-title">{d.h2}</h2>
            {d.lead && <p className="lead">{d.lead}</p>}
          </div>
          <div className="exp-media">
            <div className="frame-img" role="img" aria-label="Interior cálido de madera de un alojamiento NÓMADE bañado por luz dorada" style={{ backgroundImage: imgUrl ? `url(${imgUrl})` : undefined, backgroundColor: "#55644F" }}></div>
          </div>
        </div>
        {pillars.length > 0 && (
          <ul className="exp-pillars reveal-group" ref={ref}>
            {pillars.map((p, i) => {
              const iconName = p.icon || ICONS[i % ICONS.length];
              return (
                <li className="exp-pillar" key={i} style={{ "--i": i }}>
                  <span className="exp-pi" aria-hidden="true"><Icon name={iconName} /></span>
                  <h3>{p.h}</h3>
                  <p>{p.p}</p>
                </li>
              );
            })}
          </ul>
        )}
        {statement.length > 0 && (
          <div className="exp-statement">
            <p>{statement[0]} {statement[1] && <em>{statement[1]}</em>}</p>
          </div>
        )}
      </div>
    </section>);
}

function Split(props) {
  const d = props.d || props;
  const panels = d.options || [d.left, d.middle, d.right].filter(Boolean);
  
  const Panel = ({ index, p }) => {
    if (!p) return null;
    const imgUrl = resolveImg(p.imagen || p.img);
    const side = index % 2 === 0 ? "side-left" : "side-right";
    return (
      <button
        className={"split-panel " + side}
        onClick={() => scrollToId(p.target || "")}
        aria-label={p.h + " — " + p.cta}
        style={{ flex: "1 1 300px" }}>
        
        <div className="split-panel-img" style={{ backgroundImage: imgUrl ? `url(${imgUrl})` : undefined, backgroundColor: "#3a4a3d" }}></div>
        <div className="split-panel-scrim" aria-hidden="true"></div>
        <div className="split-panel-body">
          <span className="split-kicker">{p.kicker}</span>
          <h3>{p.h}</h3>
          <p>{p.p}</p>
          <span className="split-cta">{p.cta}<Icon name="arrow-right" /></span>
        </div>
      </button>
    );
  };

  return (
    <section className="section split-section" id="explorar" aria-labelledby="split-title">
      <div className="wrap">
        <div className="section-head center" style={{ marginInline: "auto" }}>
          {d.eyebrow && <Eyebrow center>{d.eyebrow}</Eyebrow>}
          <h2 id="split-title">{d.h2}</h2>
          {d.lead && <p className="lead">{d.lead}</p>}
        </div>
        <div className="split-panels" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {panels.map((p, i) => (
            <Panel key={i} index={i} p={p} />
          ))}
        </div>
      </div>
    </section>);
}

export { Hero, WhatIs, Experience, Split };
