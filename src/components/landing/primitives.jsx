// NÓMADE — shared landing primitives (ESM).
// Icons are rendered with lucide-react's DynamicIcon, which accepts the same
// kebab-case names the original `data-lucide` attributes used (e.g. "arrow-right").
import React, { useEffect, useRef } from 'react';
import { lucideIcon } from '../../lib/lucide.js';

export function Icon({ name, className }) {
  const Glyph = lucideIcon(name);
  return <Glyph className={className} strokeWidth={1.5} aria-hidden="true" />;
}

// Kept for API compatibility with the original codebase — lucide-react renders
// its own glyphs, so there is nothing to re-run after commit.
export function useLucide() {}

export function Eyebrow({ children, onDark, noRule, center }) {
  return (
    <p className={"eyebrow" + (onDark ? " on-dark" : "") + (noRule ? " no-rule" : "") + (center ? " center" : "")}>
      {children}
    </p>
  );
}

export function Button({ variant = "primary", icon, children, onClick, type }) {
  const cls = variant === "text" ? "btn-text" : "btn btn-" + variant;
  return (
    <button className={cls} onClick={onClick} type={type || "button"}>
      {children}
      {icon && <Icon name={icon} />}
    </button>
  );
}

// Reveal-on-scroll: adds .in when the element enters the viewport
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { el.classList.add("in"); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { el.classList.add("in"); io.unobserve(el); } });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

// smooth-scroll to a section id, accounting for fixed nav
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 8, behavior: "smooth" });
}
