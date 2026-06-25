import React, { useEffect } from 'react';
import { Icon } from './Icon.jsx';
import { Btn } from './Btn.jsx';
import { resolveImg } from './Helpers.jsx';
import { useI18n } from '../../../lib/i18n/i18nContext.jsx';

let openOverlaysCount = 0;

function lockScroll() {
  if (typeof window === 'undefined') return;
  openOverlaysCount++;
  if (openOverlaysCount === 1) {
    document.body.style.overflow = "hidden";
    document.body.classList.add("body-overlay-open");
  }
}

function unlockScroll() {
  if (typeof window === 'undefined') return;
  openOverlaysCount = Math.max(0, openOverlaysCount - 1);
  if (openOverlaysCount === 0) {
    document.body.style.overflow = "";
    document.body.classList.remove("body-overlay-open");
  }
}

export function Drawer({ kicker, title, meta, onClose, children, footer }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    lockScroll();
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [onClose]);
  return (
    <React.Fragment>
      <div className="drawer-scrim" onClick={onClose}></div>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={title}>
        <div className="drawer-head">
          <div className="drawer-head-text">
            {kicker && <p className="drawer-kicker">{kicker}</p>}
            <h2>{title}</h2>
            {meta && <div className="drawer-meta">{meta}</div>}
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Cerrar"><Icon name="x" /></button>
        </div>
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-foot">{footer}</div>}
      </aside>
    </React.Fragment>
  );
}

export function Modal({ kicker, title, subtitle, onClose, children, footer, wide }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    lockScroll();
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [onClose]);
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" style={wide ? { width: "min(760px,100%)" } : null} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            {kicker && <p className="drawer-kicker">{kicker}</p>}
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Cerrar"><Icon name="x" /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

export function Confirm({ title, message, confirmLabel, danger, icon, onConfirm, onClose }) {
  const { t } = useI18n();
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    lockScroll();
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [onClose]);
  return (
    <div className="confirm-scrim" onClick={onClose}>
      <div className="confirm" role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className={"confirm-ic" + (danger ? "" : " warn")}><Icon name={icon || (danger ? "trash-2" : "alert-triangle")} /></div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-foot">
          <Btn variant="ghost" onClick={onClose}>{t('common.actions.cancel')}</Btn>
          <button className={"btn-bo " + (danger ? "btn-danger-bo" : "btn-primary-bo")} onClick={onConfirm}>{confirmLabel || t('common.actions.confirm')}</button>
        </div>
      </div>
    </div>
  );
}

export function DetailModal({ kicker, title, cover, sub, tabs, active, onTab, onClose, footer, children }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    lockScroll();
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [onClose]);
  const img = cover ? resolveImg(cover) : "";
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal modal-xl" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <button className="dx-close" onClick={onClose} aria-label="Cerrar"><Icon name="x" /></button>
        <div className="modal-body">
          <div className={"dx-cover" + (img ? "" : " no-img")} style={img ? { backgroundImage: "url(" + img + ")" } : null}>
            <div className="dx-cover-meta">
              <div style={{ minWidth: 0 }}>
                {kicker && <p className="dx-kicker">{kicker}</p>}
                <h2>{title}</h2>
                {sub && <div className="dx-sub">{sub}</div>}
              </div>
            </div>
          </div>
          {tabs && tabs.length > 1 && (
            <div className="tabs" role="tablist">
              {tabs.map((t) => (
                <button key={t.key} className={"tab" + (t.key === active ? " on" : "")} role="tab" aria-selected={t.key === active} onClick={() => onTab(t.key)}>
                  {t.icon && <Icon name={t.icon} />}{t.label}
                  {t.count != null && <span className="tab-count">{t.count}</span>}
                </button>
              ))}
            </div>
          )}
          <div className="dx-panes">{children}</div>
        </div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}
