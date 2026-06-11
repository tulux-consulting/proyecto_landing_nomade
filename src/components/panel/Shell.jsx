// ============================================================
// NÓMADE — Backoffice shell: sidebar + mobile topbar + permisos.
// Navegación con React Router (Link / pathname activo).
// ============================================================
import React from 'react';
import Link from 'next/link';
import { BO } from '../../lib/store.js';
import { Icon, useLucide, Empty } from './ui.jsx';

// pending counts per module (for sidebar + dashboard)
export function pendingCount(key) {
  if (key === "postulaciones" || key === "partners") {
    return BO.all(key).filter((r) => !r.archivado && (r.estado === "Nuevo" || r.estado === "Pendiente de revisión")).length;
  }
  return 0;
}
export function totalCount(col) { return BO.all(col).filter((r) => !r.archivado).length; }

export function initials(name) {
  return (name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export function Sidebar({ route, navOpen, onNav, user, onLogout }) {
  useLucide();
  const allowed = BO.MODULES.filter((m) => user.permisos.includes(m.key));
  return (
    <aside className="side">
      <Link className="side-brand" href="/panel" onClick={() => onNav()}>
        <img className="mark" src="/assets/brand/isotipo-ivory.svg" alt="" aria-hidden="true" />
        <img className="word" src="/assets/brand/wordmark-ivory.svg" alt="NÓMADE" />
      </Link>
      <nav className="side-nav" aria-label="Módulos">
        {allowed.map((m) => {
          const active = route === m.route || (m.route !== "/panel" && route.indexOf(m.route) === 0);
          const pend = pendingCount(m.key);
          return (
            <Link key={m.key} href={m.route} className={"side-link" + (active ? " active" : "")} onClick={() => onNav()} aria-current={active ? "page" : undefined}>
              <Icon name={m.icon} />
              {m.label}
              {pend > 0 && <span className="side-count">{pend}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="side-foot">
        <div className="side-user side-user--static">
          <span className="side-user-av">{initials(user.nombre)}</span>
          <span className="side-user-meta"><b>{user.nombre}</b><span>{user.rolNombre || user.rol || "—"}</span></span>
        </div>
        <button className="side-logout" onClick={onLogout}>
          <Icon name="log-out" />Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export function MobileTop({ onBurger }) {
  useLucide();
  return (
    <div className="m-top">
      <img src="/assets/brand/wordmark-ivory.svg" alt="NÓMADE" />
      <button className="m-burger" onClick={onBurger} aria-label="Menú"><Icon name="menu" /></button>
    </div>
  );
}

// permission-denied screen
export function NoAccess() {
  useLucide();
  return (
    <div className="main-inner">
      <Empty icon="lock" title="Sin acceso a este módulo">
        Tu usuario no tiene permisos para ver esta sección. Pedile a un administrador que lo habilite desde Ajustes.
      </Empty>
    </div>
  );
}
