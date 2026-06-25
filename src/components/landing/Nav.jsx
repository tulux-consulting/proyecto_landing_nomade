import React, { useState, useEffect } from 'react';
import { Button, scrollToId } from './primitives.jsx';
import { NOMADE } from '../../data/content.js';
import { useI18n } from '../../lib/i18n/i18nContext.jsx';

// Accessible language switcher dropdown
function LangSwitcher({ align = 'left' }) {
  const { locale, changeLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(0);

  const languages = [
    { code: 'es', label: 'ES', name: 'Español' },
    { code: 'en', label: 'EN', name: 'English' }
  ];

  const labels = {
    es: { aria: "Cambiar idioma", current: "Idioma actual" },
    en: { aria: "Change language", current: "Current language" }
  };

  const activeLang = languages.find(l => l.code === locale) || languages[0];
  const tLabels = labels[locale] || labels.es;

  useEffect(() => {
    if (!open) return;
    const handleDocClick = () => setOpen(false);
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, [open]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  };

  const onMenuKey = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusIdx((focusIdx + 1) % languages.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusIdx((focusIdx - 1 + languages.length) % languages.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusIdx(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setFocusIdx(languages.length - 1);
    }
  };

  return (
    <div className={`lang-switcher-container ${align === 'right' ? 'align-right' : ''}`}>
      <button
        className="lang-switcher-btn"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${tLabels.aria} · ${tLabels.current}: ${activeLang.name}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        onKeyDown={onKeyDown}
      >
        <svg className="globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18" />
        </svg>
        <span className="code">{activeLang.label}</span>
        <svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div
        className={`lang-switcher-menu ${open ? 'open' : ''}`}
        role="listbox"
        tabIndex="-1"
        onKeyDown={onMenuKey}
      >
        {languages.map((l, idx) => (
          <button
            key={l.code}
            className={`opt ${idx === focusIdx ? 'focus' : ''}`}
            type="button"
            role="option"
            aria-selected={l.code === locale}
            onClick={(e) => {
              e.stopPropagation();
              changeLocale(l.code);
              setOpen(false);
            }}
          >
            <span className="opt-code">{l.label}</span>
            <span className="opt-name">{l.name}</span>
            <svg className="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

// NÓMADE — fixed glass nav that turns solid on scroll
function Nav() {
  const { locale, changeLocale } = useI18n();
  const D = NOMADE[locale].nav;
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
  }, [D.links]);
  const go = (id) => {
    setOpen(false);
    if (id === "contacto") { scrollToId("footer"); return; }
    scrollToId(id);
  };
  return (
    <nav className={"nav " + (solid || open ? "solid" : "transparent")} aria-label={locale === 'en' ? "Main" : "Principal"}>
      <div className="nav-inner">
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label={locale === 'en' ? "NÓMADE — go to top" : "NÓMADE — ir al inicio"}>
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
          <LangSwitcher align="right" />
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
        <div className="nav-drawer-lang">
          <LangSwitcher />
        </div>
        <Button variant="primary" onClick={() => go("formulario")}>{D.cta}</Button>
      </div>
    </nav>
  );
}

export { Nav };
