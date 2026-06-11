import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// Design-system tokens first, then surface stylesheets.
import './styles/tokens.css';
import './styles/site.css';
import './styles/landing.css';
import './styles/partner-modal.css';
import './styles/panel.css';
import './styles/bo.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Suspense covers lucide-react's lazily-loaded icon glyphs. */}
      <Suspense fallback={null}>
        <App />
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);
