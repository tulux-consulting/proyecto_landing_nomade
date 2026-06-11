'use client';

import React from 'react';
import { BO } from '../../../lib/store.js';
import { Contenido } from '../../../components/panel/Contenido.jsx';
import { NoAccess } from '../../../components/panel/Shell.jsx';
import { showToast } from '../../../components/panel/ui.jsx';

export default function ContenidoPage() {
  const user = BO.currentUser();
  const hasAccess = user.permisos.includes('contenido');

  if (!hasAccess) {
    return <NoAccess />;
  }

  return <Contenido onToast={showToast} />;
}
