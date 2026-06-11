import React, { useState, useEffect, useRef } from 'react';
import { Icon, Eyebrow, Button, useReveal, scrollToId } from './primitives.jsx';
// NÓMADE — 1 Hero · 3 What is NÓMADE · 4 The Experience · 4.5 Audience split

function Hero({ d }) {
  return (
    <header className="hero" id="top">
      <div className="hero-img" role="img" aria-label="Viajero contemplando un paisaje de montaña a la hora dorada" style={{ backgroundImage: `url(${d.img})`, backgroundColor: "#3a4a3d" }}></div>
      <div className="hero-scrim" aria-hidden="true"></div>
      <div className="hero-content">
        <div className="wrap">
          <Eyebrow onDark>{d.eyebrow}</Eyebrow>
          <h1 className="hero-h1">
            <span>{d.h1a}</span>
            <span>{d.h1b}</span>
          </h1>
          <p className="hero-couplet">
            {d.sub1} <em>{d.sub2}</em>
          </p>
          <p className="hero-lead">{d.lead}</p>
          <div className="hero-actions">
            <Button variant="ivory" icon="arrow-right" onClick={() => scrollToId("que-es")}>{d.cta}</Button>
          </div>
        </div>
      </div>
      <button className="scroll-hint" onClick={() => scrollToId("que-es")} aria-label="Bajar a conocer NÓMADE">
        <span>Conocer</span><Icon name="chevron-down" />
      </button>
    </header>);

}

function WhatIs({ d }) {
  const ref = useReveal();
  return (
    <section className="section" id="que-es" aria-labelledby="que-es-title">
      <div className="wrap">
        <div className="section-head center" style={{ marginInline: "auto" }}>
          <Eyebrow center>{d.eyebrow}</Eyebrow>
          <h2 id="que-es-title">{d.h2}</h2>
          <p className="lead">{d.lead}</p>
        </div>
        <ul className="whatis-grid reveal-group" ref={ref}>
          {d.points.map((p, i) =>
          <li className="whatis-item" key={i} style={{ "--i": i }}>
              <span className="whatis-ic" aria-hidden="true"><Icon name={p.icon} /></span>
              <h3>{p.h}</h3>
              <p>{p.p}</p>
            </li>
          )}
        </ul>
      </div>
    </section>);

}

function Experience({ d }) {
  const ref = useReveal();
  return (
    <section className="section forest" id="experiencia" aria-labelledby="exp-title">
      <div className="wrap">
        <div className="exp-top">
          <div className="section-head">
            <Eyebrow onDark>{d.eyebrow}</Eyebrow>
            <h2 id="exp-title">{d.h2}</h2>
            <p className="lead">{d.lead}</p>
          </div>
          <div className="exp-media">
            <div className="frame-img" role="img" aria-label="Interior cálido de madera de un alojamiento NÓMADE bañado por luz dorada" style={{ backgroundImage: `url(${d.img})`, backgroundColor: "#55644F" }}></div>
          </div>
        </div>
        <ul className="exp-pillars reveal-group" ref={ref}>
          {d.pillars.map((p, i) =>
          <li className="exp-pillar" key={i} style={{ "--i": i }}>
              <span className="exp-pi" aria-hidden="true"><Icon name={p.icon} /></span>
              <h3>{p.h}</h3>
              <p>{p.p}</p>
            </li>
          )}
        </ul>
        <div className="exp-statement">
          <p>{d.statement[0]} <em>{d.statement[1]}</em></p>
        </div>
      </div>
    </section>);

}

// 4.5 — Audience self-identification. NOT navigation: a storytelling fork.
function Split({ d }) {
  const Panel = ({ side, p }) =>
  <button
    className={"split-panel " + side}
    onClick={() => scrollToId(p.target)}
    aria-label={p.h + " — " + p.cta}>
    
      <div className="split-panel-img" style={{ backgroundImage: `url(${p.img})`, backgroundColor: "#3a4a3d" }}></div>
      <div className="split-panel-scrim" aria-hidden="true"></div>
      <div className="split-panel-body">
        <span className="split-kicker">{p.kicker}</span>
        <h3>{p.h}</h3>
        <p>{p.p}</p>
        <span className="split-cta">{p.cta}<Icon name="arrow-right" /></span>
      </div>
    </button>;

  return (
    <section className="section split-section" id="explorar" aria-labelledby="split-title">
      <div className="wrap">
        <div className="section-head center" style={{ marginInline: "auto" }}>
          <Eyebrow center>{d.eyebrow}</Eyebrow>
          <h2 id="split-title">{d.h2}</h2>
          <p className="lead">{d.lead}</p>
        </div>
        <div className="split-panels">
          <Panel side="left" p={d.left} />
          <Panel side="right" p={d.right} />
        </div>
      </div>
    </section>);

}

export { Hero, WhatIs, Experience, Split };
