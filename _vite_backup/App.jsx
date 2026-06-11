// NÓMADE — top-level router.
//   /              → public marketing landing
//   /panel/login   → backoffice login
//   /panel/*       → backoffice (session-guarded)
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import PanelLogin from './pages/PanelLogin.jsx';
import PanelApp from './pages/PanelApp.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/panel/login" element={<PanelLogin />} />
      <Route path="/panel/*" element={<PanelApp />} />
    </Routes>
  );
}
