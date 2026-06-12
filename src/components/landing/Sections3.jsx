import React from 'react';
import { Icon, Eyebrow, Button, scrollToId } from './primitives.jsx';
import { resolveImg } from '../panel/ui/Helpers.jsx';
// NÓMADE — 7 Do you own a location with potential? · 8 Selection process

function Landowners(props) {
  const d = props.d || props;
  const imgUrl = resolveImg(d.imagen || d.img);
  const qualifies = d.qualifies || { h: "", items: [] };
  const disqualifies = d.disqualifies || { h: "", items: [] };
  const benefits = d.benefits || [];

  return (
    <section className="section sand" id="propietarios" aria-labelledby="prop-title">
      <div className="wrap">
        <div className="split">
          <div className="split-media">
            <div className="frame-img" role="img" aria-label="Cabañas de diseño NÓMADE integradas en un jardín natural" style={{ backgroundImage: imgUrl ? `url(${imgUrl})` : undefined, backgroundColor: "#6b6450" }}></div>
          </div>
          <div className="split-body">
            {d.eyebrow && <Eyebrow>{d.eyebrow}</Eyebrow>}
            <h2 id="prop-title">{d.h2}</h2>
            {d.lead && <p className="lead">{d.lead}</p>}
            <div className="qualify">
              <div className="qual-col">
                <h4 className="qual-h"><Icon name="check" />{qualifies.h}</h4>
                <ul>{qualifies.items?.map((it, i) => <li key={i}>{it}</li>)}</ul>
              </div>
              <div className="qual-col no">
                <h4 className="qual-h"><Icon name="x" />{disqualifies.h}</h4>
                <ul>{disqualifies.items?.map((it, i) => <li key={i}>{it}</li>)}</ul>
              </div>
            </div>
          </div>
        </div>

        {benefits.length > 0 && (
          <div className="benefits-row">
            {benefits.map((b, i) =>
              <div className="benefit-card" key={i}>
                <span className="bi"><Icon name={b.icon} /></span>
                <h4>{b.h}</h4>
                <p>{b.p}</p>
              </div>
            )}
          </div>
        )}
        <div className="landowners-cta">
          <Button variant="primary" icon="arrow-right" onClick={() => scrollToId("formulario")}>{d.cta}</Button>
        </div>
      </div>
    </section>
  );
}

function Process(props) {
  const d = props.d || props;
  const steps = d.steps || d.pasos || [];

  return (
    <section className="section forest" id="proceso" aria-labelledby="proceso-title">
      <div className="wrap">
        <div className="section-head center" style={{ marginInline: "auto" }}>
          {d.eyebrow && <Eyebrow onDark>{d.eyebrow}</Eyebrow>}
          <h2 id="proceso-title">{d.h2}</h2>
          {d.lead && <p className="lead">{d.lead}</p>}
        </div>
        {steps.length > 0 && (
          <div className="flow">
            {steps.map((s, i) => (
              <div className="flow-step" key={i}>
                <span className="flow-num">{s.n || String(i + 1).padStart(2, "0")}</span>
                <span className="flow-ic"><Icon name={s.icon || "compass"} /></span>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export { Landowners, Process };
