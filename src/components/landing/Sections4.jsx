import React, { useState } from 'react';
import { Icon, Eyebrow, Button, useLucide, scrollToId } from './primitives.jsx';
// NÓMADE — 10 NÓMADE Partners · 11 Future guests waitlist · 12 Footer

function Partners(props) {
  const d = props.d || props;
  const onPartner = props.onPartner;
  const audiences = d.audiences || [];
  const values = d.value || d.values || [];

  return (
    <section className="section partners-band" id="socios">
      <div className="wrap">
        <div className="partners">
          <div className="partners-head">
            {d.eyebrow && <Eyebrow>{d.eyebrow}</Eyebrow>}
            <h2>{d.h2}</h2>
            {d.lead && <p className="lead">{d.lead}</p>}
            {audiences.length > 0 && (
              <div className="partner-audiences">
                {audiences.map((a, i) =>
                  <span className="audience-chip" key={i}>
                    <Icon name={a.icon} />{a.h}
                  </span>
                )}
              </div>
            )}
            <div className="partners-cta">
              <Button variant="primary" icon="arrow-right" onClick={onPartner}>{d.cta}</Button>
            </div>
          </div>
          {values.length > 0 && (
            <div className="partner-values">
              {values.map((v, i) =>
                <div className="partner-value" key={i}>
                  <span className="pv-num">{String(i + 1).padStart(2, "0")}</span>
                  <div><h4>{v.h}</h4><p>{v.p}</p></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FutureGuests(props) {
  const d = props.d || props;
  useLucide();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Revisá el formato del email.");
      return;
    }
    setError("");
    setDone(true);
  };
  return (
    <section className="section charcoal guests" id="huespedes">
      <div className="wrap-narrow guests-inner">
        {d.eyebrow && <Eyebrow onDark center>{d.eyebrow}</Eyebrow>}
        <h2>{d.h2}</h2>
        {d.lead && <p className="guests-lead">{d.lead}</p>}
        {done ?
          <div className="guests-done">
            <span className="guests-done-mark"><Icon name="check" /></span>
            <p>{d.success}</p>
          </div> :

          <form className="guests-form" onSubmit={submit}>
            <div className="guests-field">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder={d.placeholder}
                aria-label="Email" />

              <Button variant="ivory" icon="arrow-right" type="submit">{d.cta}</Button>
            </div>
            {error && <span className="guests-error">{error}</span>}
          </form>
        }
        {d.note && <p className="guests-note">{d.note}</p>}
      </div>
    </section>);

}

function Footer(props) {
  const d = props.d || props;
  const onCta = props.onCta;
  const tagline = d.tagline || "Una red de hospitalidad y bienestar. Experiencias extraordinarias, estándares consistentes, en ubicaciones cuidadosamente seleccionadas.";
  const copyright = d.copyright || "© 2026 NÓMADE — todos los derechos reservados.";

  return (
    <footer className="foot" id="footer" aria-labelledby="foot-brand">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brandcol">
            <img className="foot-brand-logo" id="foot-brand" src="/assets/brand/imagotipo-ivory.svg" alt="NÓMADE" />
            <p className="foot-tag">{tagline}</p>
          </div>
          <div className="foot-col">
            <h4>El proyecto</h4>
            <button className="foot-link" onClick={() => scrollToId("que-es")}>Qué es NÓMADE</button>
            <button className="foot-link" onClick={() => scrollToId("experiencia")}>La experiencia</button>
            <button className="foot-link" onClick={() => scrollToId("destinos")}>Destinos</button>
            <button className="foot-link" onClick={() => scrollToId("modelo")}>El modelo</button>
          </div>
          <div className="foot-col">
            <h4>Sumarse</h4>
            <button className="foot-link" onClick={() => scrollToId("formulario")}>Postular mi terreno</button>
            <button className="foot-link" onClick={() => scrollToId("socios")}>NÓMADE Partners</button>
            <button className="foot-link" onClick={() => scrollToId("huespedes")}>Lista de futuros huéspedes</button>
            <button className="foot-link" onClick={() => onCta?.("Contacto")}>Contacto</button>
          </div>
        </div>
        <div className="foot-bottom">
          <span>{copyright}<br />Diseñado y desarrollado por <a href="#" target="_blank" style={{ color: "#e0d9cf", textDecoration: "underline" }}>Tulux</a>.</span>
          <span className="foot-note">Proyecto en formación · imágenes conceptuales</span>
        </div>
      </div>
    </footer>);

}

export { Partners, FutureGuests, Footer };
