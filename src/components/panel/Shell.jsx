// ============================================================
// NÓMADE — Backoffice shell: sidebar + mobile topbar + permisos.
// Navegación con React Router (Link / pathname activo).
// ============================================================
import React, { useState } from 'react';
import Link from 'next/link';
import { BO } from '../../lib/store.js';
import { Icon, useLucide, Empty, Modal, FField, Btn, showToast } from './ui.jsx';
import { useI18n } from '../../lib/i18n/i18nContext.jsx';

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
  const { locale, changeLocale, t } = useI18n();
  useLucide();
  const allowed = BO.MODULES.filter((m) => user.permisos.includes(m.key));
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError(t('users.form.errors.password'));
      return;
    }
    if (password.length < 6) {
      setError(t('users.form.errors.password'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('auth.reset.mismatch'));
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { updatePassword } = await import('../../lib/auth.js');
      await updatePassword(password);
      showToast(t('auth.reset.success'));
      setShowModal(false);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setError(err.message || t('auth.reset.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="side">
      <Link className="side-brand" href="/panel" onClick={() => onNav()}>
        <img className="mark" src="/assets/brand/isotipo-ivory.svg" alt="" aria-hidden="true" />
        <img className="word" src="/assets/brand/wordmark-ivory.svg" alt="NÓMADE" />
      </Link>
      <nav className="side-nav" aria-label={locale === 'en' ? "Modules" : "Módulos"}>
        {allowed.map((m) => {
          const active = route === m.route || (m.route !== "/panel" && route.indexOf(m.route) === 0);
          const pend = pendingCount(m.key);
          return (
            <Link key={m.key} href={m.route} className={"side-link" + (active ? " active" : "")} onClick={() => onNav()} aria-current={active ? "page" : undefined}>
              <Icon name={m.icon} />
              {t('common.modules.' + m.key)}
              {pend > 0 && <span className="side-count">{pend}</span>}
            </Link>
          );
        })}
      </nav>
      
      <div className="side-nav-divider" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '12px 16px' }} />
      <div className="side-lang">
        <Icon name="languages" className="side-lang-icon" />
        <span className="side-lang-label">{t('users.form.preferredLanguage')}:</span>
        <select 
          value={locale} 
          onChange={(e) => changeLocale(e.target.value)} 
        >
          <option value="es">ES</option>
          <option value="en">EN</option>
        </select>
      </div>

      <div className="side-foot">
        <div className="side-user side-user--static">
          <span className="side-user-av">{initials(user.nombre)}</span>
          <span className="side-user-meta">
            <b>{user.nombre}</b>
            <span>{user.role === 'admin' ? t('common.roles.admin') : t('common.roles.user')}</span>
          </span>
        </div>
        <button className="side-logout" onClick={() => { setShowModal(true); setError(""); setPassword(""); setConfirmPassword(""); }}>
          <Icon name="key" />{t('auth.sidebar.changePassword')}
        </button>
        <button className="side-logout" onClick={onLogout}>
          <Icon name="log-out" />{t('auth.sidebar.logout')}
        </button>
      </div>

      {showModal && (
        <Modal 
          kicker={t('auth.reset.kicker')} 
          title={t('auth.reset.title')}
          subtitle={t('auth.reset.subtitle')}
          onClose={() => setShowModal(false)}
          footer={
            <React.Fragment>
              <Btn variant="ghost" onClick={() => setShowModal(false)} disabled={loading}>{t('common.actions.cancel')}</Btn>
              <Btn variant="primary" icon="check" onClick={handleUpdatePassword} disabled={loading}>
                {loading ? t('auth.reset.submitting') : t('auth.reset.submit')}
              </Btn>
            </React.Fragment>
          }
        >
          <form onSubmit={handleUpdatePassword} className="f-grid" style={{ gap: '1rem' }} autoComplete="off">
            {error && (
              <p className="access-error" role="alert" style={{ gridColumn: '1 / -1', margin: 0 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                <span>{error}</span>
              </p>
            )}
            
            <FField label={t('auth.reset.newPassword')} required>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder={t('users.form.passwordHint')} 
                disabled={loading} 
              />
            </FField>

            <FField label={t('auth.reset.confirmPassword')} required>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder={t('auth.reset.confirmPassword')} 
                disabled={loading} 
              />
            </FField>
          </form>
        </Modal>
      )}
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
