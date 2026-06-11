import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BO } from '../../lib/store.js';
import { Icon, useLucide, useStore, fmtDate, relDays, resolveImg, Badge, Tag, TagRow, ModuleHead, Search, Select, Btn, DataTable, Pagination, Empty, Drawer, DRow, DGroup, StatusChanger, Notes, Modal, FField, BarChart, showToast, ToastHost, DetailModal, DxCell, DxGrid, DxSection, PhotoGallery, ImageManager, Confirm, SearchableSelect, Toggle, useListController, STATUS_CLASS, STATUS_HUE } from './ui.jsx';
import { initials } from './Shell.jsx';

// ============================================================
// NÓMADE — Módulo Ajustes.
// Usuarios + ABM de Roles. Cada rol define qué módulos puede usar;
// los usuarios reciben un rol. Sistema escalable y fácil de administrar.
// ============================================================

// ---------------- Form de usuario ----------------
function UserForm({ rec, roles, onClose, onSave }) {
  const blank = { nombre: "", email: "", rolId: (roles[0] || {}).id || null, activo: true };
  const [v, setV] = useState(rec ? { ...rec } : blank);
  const [err, setErr] = useState({});
  const set = (k) => (e) => { setV((s) => ({ ...s, [k]: e.target.value })); setErr((x) => ({ ...x, [k]: undefined })); };

  const save = () => {
    const e = {};
    if (!v.nombre.trim()) e.nombre = "Ingresá un nombre.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Email inválido.";
    if (!v.rolId) e.rolId = "Elegí un rol.";
    if (Object.keys(e).length) { setErr(e); return; }
    onSave(v);
  };
  const rol = roles.find((r) => r.id === v.rolId);

  return (
    <Modal kicker={rec ? "Editar usuario" : "Nuevo usuario"} title={rec ? rec.nombre : "Crear usuario"}
      subtitle="Asigná un rol: define a qué módulos del panel puede acceder."
      onClose={onClose}
      footer={<React.Fragment><Btn variant="ghost" onClick={onClose}>Cancelar</Btn><Btn variant="primary" icon="check" onClick={save}>{rec ? "Guardar cambios" : "Crear usuario"}</Btn></React.Fragment>}>
      <div className="f-grid">
        <FField label="Nombre" required error={err.nombre}>
          <input value={v.nombre} onChange={set("nombre")} placeholder="Nombre y apellido" />
        </FField>
        <FField label="Email" required error={err.email}>
          <input type="email" value={v.email} onChange={set("email")} placeholder="persona@nomade.com" />
        </FField>
        <FField label="Rol" required error={err.rolId} full hint={rol ? rol.descripcion : "El rol determina los permisos del usuario."}>
          <select value={v.rolId || ""} onChange={set("rolId")}>
            {roles.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
          </select>
        </FField>
      </div>
      {rol && (
        <div className="dgroup" style={{ marginTop: 18 }}>
          <p className="dgroup-title">Acceso del rol “{rol.nombre}”</p>
          <div className="role-mods">
            {BO.MODULES.filter((m) => rol.modulos.includes(m.key)).map((m) => <Tag key={m.key}>{m.label}</Tag>)}
          </div>
        </div>
      )}
    </Modal>
  );
}

// ---------------- Form de rol ----------------
function RoleForm({ rec, onClose, onSave }) {
  const blank = { nombre: "", descripcion: "", modulos: ["dashboard"], sistema: false };
  const [v, setV] = useState(rec ? { ...rec, modulos: rec.modulos.slice() } : blank);
  const [err, setErr] = useState({});
  const set = (k) => (e) => { setV((s) => ({ ...s, [k]: e.target.value })); setErr((x) => ({ ...x, [k]: undefined })); };
  const toggleMod = (key) => {
    if (key === "dashboard" || v.sistema) return;
    setV((s) => ({ ...s, modulos: s.modulos.includes(key) ? s.modulos.filter((p) => p !== key) : s.modulos.concat([key]) }));
  };
  const save = () => {
    const e = {};
    if (!v.nombre.trim()) e.nombre = "Ingresá un nombre.";
    if (Object.keys(e).length) { setErr(e); return; }
    onSave({ ...v, modulos: v.modulos.includes("dashboard") ? v.modulos : ["dashboard"].concat(v.modulos) });
  };

  return (
    <Modal kicker={rec ? "Editar rol" : "Nuevo rol"} title={rec ? rec.nombre : "Crear rol"}
      subtitle={v.sistema ? "Rol del sistema: tiene acceso total y no puede modificarse." : "Definí el nombre y qué módulos del panel puede usar este rol."}
      onClose={onClose}
      footer={<React.Fragment><Btn variant="ghost" onClick={onClose}>Cancelar</Btn><Btn variant="primary" icon="check" onClick={save}>{rec ? "Guardar cambios" : "Crear rol"}</Btn></React.Fragment>}>
      <div className="f-grid">
        <FField label="Nombre del rol" required error={err.nombre} full>
          <input value={v.nombre} onChange={set("nombre")} placeholder="Ej.: Operaciones" disabled={v.sistema} />
        </FField>
        <FField label="Descripción" full hint="Breve descripción de para qué sirve este rol.">
          <textarea value={v.descripcion} onChange={set("descripcion")} rows="2" placeholder="¿Qué hace este rol?" disabled={v.sistema} />
        </FField>
      </div>
      <div className="dgroup" style={{ marginTop: 20 }}>
        <p className="dgroup-title">Módulos a los que accede</p>
        <div className="modsel">
          {BO.MODULES.map((m) => {
            const on = v.modulos.includes(m.key);
            const locked = m.key === "dashboard" || v.sistema;
            return (
              <button key={m.key} type="button" className={"modsel-row" + (on ? " on" : "") + (locked ? " locked" : "")} onClick={() => toggleMod(m.key)}>
                <Icon name={m.icon} className="mod-ic" />
                <span className="modsel-label">{m.label}{m.key === "dashboard" && <span className="muted" style={{ fontSize: 12, marginLeft: 6 }}>· siempre incluido</span>}</span>
                <span className="modsel-check"><Icon name="check" /></span>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

// ---------------- Módulo ----------------
function Ajustes({ onToast }) {
  useStore();
  useLucide();
  const [tab, setTab] = useState("usuarios");
  const users = BO.all("usuarios");
  const roles = BO.all("roles");
  const [editUser, setEditUser] = useState(undefined);
  const [delUser, setDelUser] = useState(null);
  const [editRole, setEditRole] = useState(undefined);
  const [delRole, setDelRole] = useState(null);

  const roleById = (id) => roles.find((r) => r.id === id);
  const usersInRole = (rid) => users.filter((u) => u.rolId === rid).length;

  // ---- usuarios ----
  const saveUser = (v) => {
    if (editUser) { BO.update("usuarios", editUser, v); onToast("Usuario actualizado."); }
    else { BO.insert("usuarios", v); onToast("Usuario creado."); }
    setEditUser(undefined);
  };
  const userRec = editUser ? BO.get("usuarios", editUser) : null;
  const delUserRec = delUser ? BO.get("usuarios", delUser) : null;
  const toggleActivo = (u, e) => { e.stopPropagation(); BO.update("usuarios", u.id, { activo: !u.activo }); onToast(u.activo ? "Usuario desactivado." : "Usuario activado."); };
  const doDeleteUser = () => { BO.remove("usuarios", delUser); onToast("Usuario eliminado."); setDelUser(null); };

  // ---- roles ----
  const saveRole = (v) => {
    if (editRole) { BO.update("roles", editRole, v); onToast("Rol actualizado."); }
    else { BO.insert("roles", v); onToast("Rol creado."); }
    setEditRole(undefined);
  };
  const roleRec = editRole ? BO.get("roles", editRole) : null;
  const delRoleRec = delRole ? BO.get("roles", delRole) : null;
  const doDeleteRole = () => { BO.remove("roles", delRole); onToast("Rol eliminado."); setDelRole(null); };

  const userCols = [
    { key: "nombre", label: "Usuario", render: (u) => (
      <span style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <span className="side-user-av" style={{ width: 34, height: 34, background: u.activo ? "var(--moss)" : "var(--stone)" }}>{initials(u.nombre)}</span>
        <span className="cell-name"><span className="td-strong">{u.nombre}</span><span className="td-sub">{u.email}</span></span>
      </span>
    ) },
    { key: "rol", label: "Rol", render: (u) => { const r = roleById(u.rolId); return r ? <Tag>{r.nombre}</Tag> : <span className="muted">Sin rol</span>; } },
    { key: "activo", label: "Estado", render: (u) => <span className={"badge " + (u.activo ? "badge-on" : "badge-off")}>{u.activo ? "Activo" : "Inactivo"}</span> },
    { key: "acc", label: "", width: "150px", align: "right", render: (u) => (
      <span style={{ display: "inline-flex", gap: 6, justifyContent: "flex-end" }} onClick={(e) => e.stopPropagation()}>
        <button className="btn-bo btn-ghost-bo icon-btn" title={u.activo ? "Desactivar" : "Activar"} onClick={(e) => toggleActivo(u, e)}><Icon name={u.activo ? "user-x" : "user-check"} /></button>
        <button className="btn-bo btn-ghost-bo icon-btn" title="Editar" onClick={() => setEditUser(u.id)}><Icon name="pencil" /></button>
        <button className="btn-bo btn-ghost-bo icon-btn icon-btn-danger" title="Eliminar" onClick={() => setDelUser(u.id)}><Icon name="trash-2" /></button>
      </span>
    ) }
  ];

  const roleCols = [
    { key: "nombre", label: "Rol", render: (r) => (
      <span className="cell-name">
        <span className="td-strong">{r.nombre}{r.sistema && <span className="role-sys" style={{ marginLeft: 8 }}>Sistema</span>}</span>
        {r.descripcion && <span className="td-sub">{r.descripcion}</span>}
      </span>
    ) },
    { key: "modulos", label: "Módulos", render: (r) => {
      const mods = BO.MODULES.filter((m) => r.modulos.includes(m.key) && m.key !== "dashboard");
      return mods.length
        ? <TagRow items={mods.map((m) => m.label)} max={4} />
        : <span className="muted" style={{ fontSize: 12.5 }}>Solo el panel de inicio</span>;
    } },
    { key: "usuarios", label: "Usuarios", render: (r) => { const c = usersInRole(r.id); return <span className="muted">{c} {c === 1 ? "usuario" : "usuarios"}</span>; } },
    { key: "acc", label: "", width: "110px", align: "right", render: (r) => {
      const count = usersInRole(r.id);
      return (
        <span style={{ display: "inline-flex", gap: 6, justifyContent: "flex-end" }} onClick={(e) => e.stopPropagation()}>
          <button className="btn-bo btn-ghost-bo icon-btn" title="Editar" onClick={() => setEditRole(r.id)}><Icon name="pencil" /></button>
          <button className="btn-bo btn-ghost-bo icon-btn icon-btn-danger" title={r.sistema ? "El rol del sistema no se puede eliminar" : (count ? "No se puede eliminar: tiene usuarios asignados" : "Eliminar")}
            disabled={r.sistema || count > 0} onClick={() => setDelRole(r.id)}><Icon name="trash-2" /></button>
        </span>
      );
    } }
  ];

  return (
    <div className="main-inner">
      <ModuleHead eyebrow="Módulo" title="Ajustes"
        desc="Usuarios y roles de acceso. Creá roles que definen qué módulos puede usar cada persona y asignalos a tus usuarios." />

      <div className="seg" style={{ marginBottom: 24 }}>
        <button className={"seg-btn" + (tab === "usuarios" ? " on" : "")} onClick={() => setTab("usuarios")}>
          <Icon name="users" />Usuarios<span className="seg-c">{users.length}</span>
        </button>
        <button className={"seg-btn" + (tab === "roles" ? " on" : "")} onClick={() => setTab("roles")}>
          <Icon name="shield" />Roles<span className="seg-c">{roles.length}</span>
        </button>
      </div>

      {tab === "usuarios" && (
        <React.Fragment>
          <div className="toolbar">
            <h2 style={{ fontFamily: "var(--serif-display)", fontWeight: 500, fontSize: 20, margin: 0, color: "var(--fg1)" }}>Usuarios del panel</h2>
            <div className="toolbar-spacer"></div>
            <Btn variant="primary" icon="user-plus" onClick={() => setEditUser(null)}>Crear usuario</Btn>
          </div>
          <div className="panel-card">
            <DataTable columns={userCols} rows={users} onRow={(u) => setEditUser(u.id)} />
          </div>
        </React.Fragment>
      )}

      {tab === "roles" && (
        <React.Fragment>
          <div className="toolbar">
            <h2 style={{ fontFamily: "var(--serif-display)", fontWeight: 500, fontSize: 20, margin: 0, color: "var(--fg1)" }}>Roles</h2>
            <div className="toolbar-spacer"></div>
            <Btn variant="primary" icon="plus" onClick={() => setEditRole(null)}>Crear rol</Btn>
          </div>
          <div className="panel-card">
            <DataTable columns={roleCols} rows={roles} onRow={(r) => setEditRole(r.id)} />
          </div>
          <div className="bo-note" style={{ marginTop: 24 }}>
            <Icon name="info" />
            <p>Los roles hacen el sistema escalable: cambiás el acceso de un rol y todos sus usuarios se actualizan al instante. El rol <b>Administrador</b> siempre tiene acceso total.</p>
          </div>
        </React.Fragment>
      )}

      {editUser !== undefined && <UserForm rec={userRec} roles={roles} onClose={() => setEditUser(undefined)} onSave={saveUser} />}
      {delUserRec && (
        <Confirm danger title="Eliminar usuario" confirmLabel="Eliminar"
          message={"Vas a eliminar a " + delUserRec.nombre + " (" + delUserRec.email + "). Perderá el acceso al panel."}
          onConfirm={doDeleteUser} onClose={() => setDelUser(null)} />
      )}
      {editRole !== undefined && <RoleForm rec={roleRec} onClose={() => setEditRole(undefined)} onSave={saveRole} />}
      {delRoleRec && (
        <Confirm danger title="Eliminar rol" confirmLabel="Eliminar"
          message={"Vas a eliminar el rol “" + delRoleRec.nombre + "”. Esta acción no se puede deshacer."}
          onConfirm={doDeleteRole} onClose={() => setDelRole(null)} />
      )}
    </div>
  );
}

export { Ajustes };
