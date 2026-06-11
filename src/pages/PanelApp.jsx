// ============================================================
// NÓMADE — Backoffice app shell (route "/panel/*").
// Guard de sesión + sidebar + rutas reales por módulo.
// ============================================================
import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { BO } from '../lib/store.js';
import { panelIsAuthed, clearPanelSession } from '../lib/auth.js';
import { useStore, showToast, ToastHost } from '../components/panel/ui.jsx';
import { Sidebar, MobileTop, NoAccess } from '../components/panel/Shell.jsx';
import { Dashboard } from '../components/panel/Dashboard.jsx';
import { Postulaciones } from '../components/panel/Postulaciones.jsx';
import { Partners } from '../components/panel/Partners.jsx';
import { Huespedes } from '../components/panel/Huespedes.jsx';
import { Destinos } from '../components/panel/Destinos.jsx';
import { Contenido } from '../components/panel/Contenido.jsx';
import { Ajustes } from '../components/panel/Ajustes.jsx';

// Permission gate: render the module only if the active user can access it.
function Guard({ user, moduleKey, children }) {
  return user.permisos.includes(moduleKey) ? children : <NoAccess />;
}

export default function PanelApp() {
  useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  if (!panelIsAuthed()) return <Navigate to="/panel/login" replace />;

  const user = BO.currentUser();
  const onToast = (m) => showToast(m);
  const go = (r) => { navigate(r); setNavOpen(false); };
  const closeNav = () => setNavOpen(false);
  const onLogout = () => { clearPanelSession(); navigate("/panel/login", { replace: true }); };

  return (
    <div className={"app" + (navOpen ? " nav-open" : "")}>
      <div className="side-scrim" onClick={closeNav}></div>
      <Sidebar route={location.pathname} navOpen={navOpen} onNav={closeNav} user={user} onLogout={onLogout} />
      <div className="main">
        <MobileTop onBurger={() => setNavOpen(true)} />
        <Routes>
          <Route index element={<Guard user={user} moduleKey="dashboard"><Dashboard user={user} onGo={go} /></Guard>} />
          <Route path="postulaciones" element={<Guard user={user} moduleKey="postulaciones"><Postulaciones onToast={onToast} /></Guard>} />
          <Route path="partners" element={<Guard user={user} moduleKey="partners"><Partners onToast={onToast} /></Guard>} />
          <Route path="huespedes" element={<Guard user={user} moduleKey="huespedes"><Huespedes onToast={onToast} /></Guard>} />
          <Route path="destinos" element={<Guard user={user} moduleKey="destinos"><Destinos onToast={onToast} /></Guard>} />
          <Route path="contenido" element={<Guard user={user} moduleKey="contenido"><Contenido onToast={onToast} /></Guard>} />
          <Route path="ajustes" element={<Guard user={user} moduleKey="ajustes"><Ajustes onToast={onToast} /></Guard>} />
          <Route path="*" element={<Navigate to="/panel" replace />} />
        </Routes>
      </div>
      <ToastHost />
    </div>
  );
}
