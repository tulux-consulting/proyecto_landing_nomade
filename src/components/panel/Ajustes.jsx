import React, { useState, useEffect } from 'react';
import { BO } from '../../lib/store.js';
import { UserRepository } from '../../repositories/index.ts';
import { Icon, useLucide, useStore, Btn, ModuleHead, FField, Modal, DataTable, Confirm, Spinner, Badge, useListController, Pagination } from './ui.jsx';
import { initials } from './Shell.jsx';
import { useI18n } from '../../lib/i18n/i18nContext.jsx';

// ============================================================
// NÓMADE — Módulo Ajustes (Usuarios).
// Administra usuarios autorizados a acceder al Backoffice.
// ============================================================

// ---------------- Form de usuario ----------------
function UserForm({ rec, onClose, onSave }) {
  const { t } = useI18n();
  const blank = { full_name: "", username: "", email: "", password: "", role: "user", is_active: true, preferred_language: "es" };
  const [v, setV] = useState(rec ? { ...rec, password: "" } : blank);
  const [err, setErr] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const set = (k) => (e) => { setV((s) => ({ ...s, [k]: e.target.value })); setErr((x) => ({ ...x, [k]: undefined })); };

  const save = async () => {
    const e = {};
    if (!v.full_name.trim()) e.full_name = t('users.form.errors.name');

    const usernameTrim = v.username.trim();
    if (!usernameTrim) {
      e.username = t('users.form.errors.username');
    } else if (usernameTrim.includes(" ")) {
      e.username = t('users.form.errors.usernameSpaces');
    } else if (!/^[a-zA-Z0-9._-]+$/.test(usernameTrim)) {
      e.username = t('users.form.errors.usernameChars');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = t('users.form.errors.email');
    if (!v.role) e.role = t('users.form.errors.role');
    if (!rec && (!v.password || v.password.length < 6)) e.password = t('users.form.errors.password');

    if (Object.keys(e).length) { setErr(e); return; }

    setSubmitting(true);
    try {
      await onSave(v);
    } catch (err) {
      setErr({ email: err.message || t('common.errors.generic') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal kicker={rec ? t('users.form.edit') : t('users.form.new')} title={rec ? rec.full_name : t('users.form.new')}
      subtitle={rec ? t('users.form.edit') : t('users.form.new')}
      onClose={onClose}
      footer={<React.Fragment><Btn variant="ghost" onClick={onClose} disabled={submitting}>{t('users.form.cancel')}</Btn><Btn variant="primary" icon="check" onClick={save} disabled={submitting}>{submitting ? t('common.actions.saving') : (rec ? t('users.form.saveChanges') : t('users.form.save'))}</Btn></React.Fragment>}>
      <div className="f-grid">
        <FField label={t('users.form.name')} required error={err.full_name}>
          <input value={v.full_name} onChange={set("full_name")} placeholder="Ej. Juan Perez" disabled={submitting} />
        </FField>
        <FField label={t('users.form.username')} required error={err.username} hint={t('users.form.usernameHint')}>
          <input value={v.username} onChange={set("username")} placeholder="Ej. juan.perez" disabled={submitting} />
        </FField>
        <FField label={t('users.form.email')} required error={err.email}>
          <input type="email" value={v.email} onChange={set("email")} placeholder="persona@nomade.com" disabled={submitting || !!rec} />
        </FField>
        <FField label={t('users.form.role')} required error={err.role}>
          <select value={v.role} onChange={set("role")} disabled={submitting}>
            <option value="user">{t('common.roles.user')}</option>
            <option value="admin">{t('common.roles.admin')}</option>
          </select>
        </FField>
        <FField label={t('users.form.preferredLanguage')} required>
          <select value={v.preferred_language || "es"} onChange={set("preferred_language")} disabled={submitting}>
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </FField>
        {!rec && (
          <FField label={t('users.form.password')} required error={err.password}>
            <input type="password" value={v.password} onChange={set("password")} placeholder={t('users.form.passwordHint')} disabled={submitting} />
          </FField>
        )}
      </div>
    </Modal>
  );
}

// ---------------- Módulo Ajustes ----------------
function Ajustes({ onToast }) {
  const { t, locale } = useI18n();
  useStore();
  useLucide();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(undefined);
  const [delUser, setDelUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const list = await UserRepository.getAll();
      setUsers(list);
    } catch (e) {
      onToast(t('users.toasts.loadedError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const saveUser = async (v) => {
    try {
      if (editUser) {
        await UserRepository.update(editUser, {
          full_name: v.full_name,
          username: v.username,
          role: v.role,
          preferred_language: v.preferred_language,
          is_active: v.is_active
        });
        onToast(t('users.toasts.updated'));
      } else {
        await UserRepository.create({
          full_name: v.full_name,
          username: v.username,
          email: v.email,
          password: v.password,
          role: v.role,
          preferred_language: v.preferred_language || 'es',
          is_active: true
        });
        onToast(t('users.toasts.created'));
      }
      setEditUser(undefined);
      fetchUsers();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const toggleActivo = async (u, e) => {
    e.stopPropagation();
    try {
      await UserRepository.toggleActive(u.id, !u.is_active);
      onToast(u.is_active ? t('users.toasts.deactivated') : t('users.toasts.activated'));
      fetchUsers();
    } catch (err) {
      onToast(t('users.toasts.stateError'));
    }
  };

  const doDeleteUser = async () => {
    try {
      await UserRepository.delete(delUser);
      onToast(t('users.toasts.deleted'));
      setDelUser(null);
      fetchUsers();
    } catch (err) {
      onToast(t('users.toasts.deletedError'));
    }
  };

  const userRec = editUser ? users.find((u) => u.id === editUser) : null;
  const delUserRec = delUser ? users.find((u) => u.id === delUser) : null;

  const userCols = [
    {
      key: "nombre", label: t('users.table.user'), render: (u) => (
        <span style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <span className="side-user-av" style={{ width: 34, height: 34, background: u.is_active ? "var(--moss)" : "var(--stone)" }}>{initials(u.full_name)}</span>
          <span className="cell-name">
            <span className="td-strong">{u.full_name}</span>
            <span className="td-sub">@{u.username} · {u.email}</span>
          </span>
        </span>
      )
    },
    {
      key: "rol", label: t('users.table.role'), render: (u) => (
        <Badge status={u.role} />
      )
    },
    { key: "activo", label: t('users.table.state'), render: (u) => <span className={"badge " + (u.is_active ? "badge-on" : "badge-off")}>{u.is_active ? t('common.status.active') : t('common.status.inactive')}</span> },
    {
      key: "acc", label: "", width: "150px", align: "right", render: (u) => (
        <span style={{ display: "inline-flex", gap: 6, justifyContent: "flex-end" }} onClick={(e) => e.stopPropagation()}>
          <button className="btn-bo btn-ghost-bo icon-btn" title={u.is_active ? t('users.toasts.deactivateAction') : t('users.toasts.activateAction')} onClick={(e) => toggleActivo(u, e)}><Icon name={u.is_active ? "user-x" : "user-check"} /></button>
          <button className="btn-bo btn-ghost-bo icon-btn" title={t('common.actions.edit')} onClick={() => setEditUser(u.id)}><Icon name="pencil" /></button>
          <button className="btn-bo btn-ghost-bo icon-btn icon-btn-danger" title={t('common.actions.delete')} onClick={() => setDelUser(u.id)}><Icon name="trash-2" /></button>
        </span>
      )
    }
  ];

  const ctrl = useListController(users, {
    searchKeys: ["full_name", "username", "email"],
    perPage: 5
  });

  if (loading) {
    return <Spinner message={t('common.actions.loading')} />;
  }

  return (
    <div className="main-inner">
      <ModuleHead eyebrow={locale === 'en' ? "Module" : "Módulo"} title={t('users.title')}
        desc={t('users.desc')} />

      <div className="toolbar" style={{ marginTop: 12 }}>
        <h2 style={{ fontFamily: "var(--serif-display)", fontWeight: 500, fontSize: 20, margin: 0, color: "var(--fg1)" }}>{t('users.table.title')}</h2>
        <div className="toolbar-spacer"></div>
        <Btn variant="primary" icon="user-plus" onClick={() => setEditUser(null)}>{t('users.form.new')}</Btn>
      </div>

      <div className="panel-card">
        <DataTable columns={userCols} rows={ctrl.pageRows} onRow={(u) => setEditUser(u.id)} />
        <Pagination page={ctrl.page} pages={ctrl.pages} total={ctrl.total} perPage={ctrl.perPage} onPage={ctrl.setPage} />
      </div>

      {editUser !== undefined && <UserForm rec={userRec} onClose={() => setEditUser(undefined)} onSave={saveUser} />}

      {delUserRec && (
        <Confirm danger title={t('users.delete.title')} confirmLabel={t('users.delete.confirm')}
          message={t('users.delete.message', { name: delUserRec.full_name, username: delUserRec.username })}
          onConfirm={doDeleteUser} onClose={() => setDelUser(null)} />
      )}
    </div>
  );
}

export { Ajustes };
