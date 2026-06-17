import React, { useState, useEffect } from 'react';
import { BO } from '../../lib/store.js';
import { UserRepository } from '../../repositories/index.ts';
import { Icon, useLucide, useStore, Btn, ModuleHead, FField, Modal, DataTable, Confirm, Spinner, Badge } from './ui.jsx';
import { initials } from './Shell.jsx';

// ============================================================
// NÓMADE — Módulo Ajustes (Usuarios).
// Administra usuarios autorizados a acceder al Backoffice.
// ============================================================

// ---------------- Form de usuario ----------------
function UserForm({ rec, onClose, onSave }) {
  const blank = { full_name: "", username: "", email: "", password: "", role: "user", is_active: true };
  const [v, setV] = useState(rec ? { ...rec, password: "" } : blank);
  const [err, setErr] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const set = (k) => (e) => { setV((s) => ({ ...s, [k]: e.target.value })); setErr((x) => ({ ...x, [k]: undefined })); };

  const save = async () => {
    const e = {};
    if (!v.full_name.trim()) e.full_name = "Ingresá un nombre.";

    const usernameTrim = v.username.trim();
    if (!usernameTrim) {
      e.username = "Ingresá un usuario.";
    } else if (usernameTrim.includes(" ")) {
      e.username = "El usuario no puede contener espacios.";
    } else if (!/^[a-zA-Z0-9._-]+$/.test(usernameTrim)) {
      e.username = "Caracteres permitidos: letras, números, puntos, guiones y guiones bajos.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Email inválido.";
    if (!v.role) e.role = "Elegí un rol.";
    if (!rec && (!v.password || v.password.length < 6)) e.password = "La contraseña debe tener al menos 6 caracteres.";

    if (Object.keys(e).length) { setErr(e); return; }

    setSubmitting(true);
    try {
      await onSave(v);
    } catch (err) {
      setErr({ email: err.message || "Error al guardar usuario" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal kicker={rec ? "Editar usuario" : "Nuevo usuario"} title={rec ? rec.full_name : "Crear usuario"}
      subtitle={rec ? "Modificá la información básica del usuario." : "Creá una cuenta para el personal del Backoffice."}
      onClose={onClose}
      footer={<React.Fragment><Btn variant="ghost" onClick={onClose} disabled={submitting}>Cancelar</Btn><Btn variant="primary" icon="check" onClick={save} disabled={submitting}>{submitting ? "Guardando..." : (rec ? "Guardar cambios" : "Crear usuario")}</Btn></React.Fragment>}>
      <div className="f-grid">
        <FField label="Nombre y Apellido" required error={err.full_name}>
          <input value={v.full_name} onChange={set("full_name")} placeholder="Ej. Juan Perez" disabled={submitting} />
        </FField>
        <FField label="Usuario (Username)" required error={err.username} hint="Único, sin espacios. Permite letras, números, puntos y guiones.">
          <input value={v.username} onChange={set("username")} placeholder="Ej. juan.perez" disabled={submitting} />
        </FField>
        <FField label="Email" required error={err.email}>
          <input type="email" value={v.email} onChange={set("email")} placeholder="persona@nomade.com" disabled={submitting || !!rec} />
        </FField>
        <FField label="Rol" required error={err.role}>
          <select value={v.role} onChange={set("role")} disabled={submitting}>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </FField>
        {!rec && (
          <FField label="Contraseña temporal" required error={err.password}>
            <input type="password" value={v.password} onChange={set("password")} placeholder="Mínimo 6 caracteres" disabled={submitting} />
          </FField>
        )}
      </div>
    </Modal>
  );
}

// ---------------- Módulo Ajustes ----------------
function Ajustes({ onToast }) {
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
      onToast("Error al cargar los usuarios.");
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
          is_active: v.is_active
        });
        onToast("Usuario actualizado.");
      } else {
        await UserRepository.create({
          full_name: v.full_name,
          username: v.username,
          email: v.email,
          password: v.password,
          role: v.role,
          is_active: true
        });
        onToast("Usuario creado.");
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
      onToast(u.is_active ? "Usuario desactivado." : "Usuario activado.");
      fetchUsers();
    } catch (err) {
      onToast("Error al cambiar estado del usuario.");
    }
  };

  const doDeleteUser = async () => {
    try {
      await UserRepository.delete(delUser);
      onToast("Usuario eliminado.");
      setDelUser(null);
      fetchUsers();
    } catch (err) {
      onToast("Error al eliminar usuario.");
    }
  };

  const userRec = editUser ? users.find((u) => u.id === editUser) : null;
  const delUserRec = delUser ? users.find((u) => u.id === delUser) : null;

  const userCols = [
    {
      key: "nombre", label: "Usuario", render: (u) => (
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
      key: "rol", label: "Rol", render: (u) => (
        <Badge status={u.role === "admin" ? "Administrador" : "Usuario"} />
      )
    },
    { key: "activo", label: "Estado", render: (u) => <span className={"badge " + (u.is_active ? "badge-on" : "badge-off")}>{u.is_active ? "Activo" : "Inactivo"}</span> },
    {
      key: "acc", label: "", width: "150px", align: "right", render: (u) => (
        <span style={{ display: "inline-flex", gap: 6, justifyContent: "flex-end" }} onClick={(e) => e.stopPropagation()}>
          <button className="btn-bo btn-ghost-bo icon-btn" title={u.is_active ? "Desactivar" : "Activar"} onClick={(e) => toggleActivo(u, e)}><Icon name={u.is_active ? "user-x" : "user-check"} /></button>
          <button className="btn-bo btn-ghost-bo icon-btn" title="Editar" onClick={() => setEditUser(u.id)}><Icon name="pencil" /></button>
          <button className="btn-bo btn-ghost-bo icon-btn icon-btn-danger" title="Eliminar" onClick={() => setDelUser(u.id)}><Icon name="trash-2" /></button>
        </span>
      )
    }
  ];

  if (loading) {
    return <Spinner message="Cargando ajustes..." />;
  }

  return (
    <div className="main-inner">
      <ModuleHead eyebrow="Módulo" title="Ajustes"
        desc="Administración de cuentas autorizadas para acceder al panel de administración de NÓMADE." />

      <div className="toolbar" style={{ marginTop: 12 }}>
        <h2 style={{ fontFamily: "var(--serif-display)", fontWeight: 500, fontSize: 20, margin: 0, color: "var(--fg1)" }}>Usuarios del panel</h2>
        <div className="toolbar-spacer"></div>
        <Btn variant="primary" icon="user-plus" onClick={() => setEditUser(null)}>Crear usuario</Btn>
      </div>

      <div className="panel-card">
        <DataTable columns={userCols} rows={users} onRow={(u) => setEditUser(u.id)} />
      </div>

      {editUser !== undefined && <UserForm rec={userRec} onClose={() => setEditUser(undefined)} onSave={saveUser} />}

      {delUserRec && (
        <Confirm danger title="Eliminar usuario" confirmLabel="Eliminar"
          message={"Vas a eliminar a " + delUserRec.full_name + " (@" + delUserRec.username + "). Perderá permanentemente el acceso al panel."}
          onConfirm={doDeleteUser} onClose={() => setDelUser(null)} />
      )}
    </div>
  );
}

export { Ajustes };
