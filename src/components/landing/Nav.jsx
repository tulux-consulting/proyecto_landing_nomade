import React, { useState, useEffect } from 'react';
import { Button, scrollToId } from './primitives.jsx';
import { NOMADE } from '../../data/content.js';
// NÓMADE — fixed glass nav that turns solid on scroll
function Nav() {
  const D = NOMADE.nav;
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  useEffect(() => {
    const read = () => setSolid(window.scrollY > 80);
    window.addEventListener("scroll", read, { passive: true });
    read();
    return () => window.removeEventListener("scroll", read);
  }, []);
  // Scrollspy — highlight the nav link for the section currently in view
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const ids = D.links.map(([, id]) => id).filter((id) => id !== "contacto");
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const ratios = {};
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { ratios[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
      let best = null, bestR = 0;
      Object.keys(ratios).forEach((id) => { if (ratios[id] > bestR) { bestR = ratios[id]; best = id; } });
      setActive(bestR > 0 ? best : null);
    }, { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.02, 0.05, 0.1, 0.25, 0.5, 1] });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const go = (id) => {
    setOpen(false);
    if (id === "contacto") { scrollToId("footer"); return; }
    scrollToId(id);
  };
  return (
    <nav className={"nav " + (solid || open ? "solid" : "transparent")} aria-label="Principal">
      <div className="nav-inner">
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="NÓMADE — ir al inicio">
          <img className="brand-mark v-ivory" src="/assets/brand/isotipo-ivory.svg" alt="" aria-hidden="true" />
          <img className="brand-mark v-forest" src="/assets/brand/isotipo-forest.svg" alt="" aria-hidden="true" />
          <img className="brand-word v-ivory" src="/assets/brand/wordmark-ivory.svg" alt="" aria-hidden="true" />
          <img className="brand-word v-forest" src="/assets/brand/wordmark-forest.svg" alt="" aria-hidden="true" />
        </button>
        <div className="nav-links">
          {D.links.map(([label, id]) => (
            <button key={id} className={"nav-link" + (active === id ? " active" : "")} onClick={() => go(id)} aria-current={active === id ? "true" : undefined}>{label}</button>
          ))}
        </div>
        <div className="nav-actions">
          <Button variant={solid ? "primary" : "ghost"} onClick={() => go("formulario")}>{D.cta}</Button>
        </div>
        <button
          className={"nav-burger" + (open ? " open" : "")}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="nav-drawer"
        >
          <span></span><span></span>
        </button>
      </div>
      <div
        id="nav-drawer"
        className={"nav-drawer" + (open ? " open" : "")}
        ref={(el) => { if (el) { if (open) el.removeAttribute("inert"); else el.setAttribute("inert", ""); } }}
      >
        {D.links.map(([label, id]) => (
          <button key={id} className="nav-drawer-link" onClick={() => go(id)}>{label}</button>
        ))}
        <Button variant="primary" onClick={() => go("formulario")}>{D.cta}</Button>
      </div>
    </nav>
  );
}

export { Nav };
