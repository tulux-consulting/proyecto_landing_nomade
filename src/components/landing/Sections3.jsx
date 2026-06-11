import React from 'react';
import { Icon, Eyebrow, Button, scrollToId } from './primitives.jsx';
// NÓMADE — 7 Do you own a location with potential? · 8 Selection process

function Landowners({ d }) {
  return (
    <section className="section sand" id="propietarios" aria-labelledby="prop-title">
      <div className="wrap">
        <div className="split">
          <div className="split-media">
            <div className="frame-img" role="img" aria-label="Cabañas de diseño NÓMADE integradas en un jardín natural" style={{ backgroundImage: `url(${d.img})`, backgroundColor: "#6b6450" }}></div>
          </div>
          <div className="split-body">
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <h2 id="prop-title">{d.h2}</h2>
            <p className="lead">{d.lead}</p>
            <div className="qualify">
              <div className="qual-col">
                <h4 className="qual-h"><Icon name="check" />{d.qualifies.h}</h4>
                <ul>{d.qualifies.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
              </div>
              <div className="qual-col no">
                <h4 className="qual-h"><Icon name="x" />{d.disqualifies.h}</h4>
                <ul>{d.disqualifies.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
              </div>
            </div>
          </div>
        </div>

        <div className="benefits-row">
          {d.benefits.map((b, i) =>
          <div className="benefit-card" key={i}>
              <span className="bi"><Icon name={b.icon} /></span>
              <h4>{b.h}</h4>
              <p>{b.p}</p>
            </div>
          )}
        </div>
        <div className="landowners-cta">
          <Button variant="primary" icon="arrow-right" onClick={() => scrollToId("formulario")}>{d.cta}</Button>
        </div>
      </div>
    </section>);

}

function Process({ d }) {
  return (
    <section className="section forest" id="proceso" aria-labelledby="proceso-title">
      <div className="wrap">
        <div className="section-head center" style={{ marginInline: "auto" }}>
          <Eyebrow onDark>{d.eyebrow}</Eyebrow>
          <h2 id="proceso-title">{d.h2}</h2>
          <p className="lead">{d.lead}</p>
        </div>
        <div className="flow">
          {d.steps.map((s, i) =>
          <div className="flow-step" key={i}>
              <span className="flow-num">{s.n}</span>
              <span className="flow-ic"><Icon name={s.icon} /></span>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}

export { Landowners, Process };
