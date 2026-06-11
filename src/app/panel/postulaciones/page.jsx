'use client';

import React from 'react';
import { BO } from '../../../lib/store.js';
import { Postulaciones } from '../../../components/panel/Postulaciones.jsx';
import { NoAccess } from '../../../components/panel/Shell.jsx';
import { showToast } from '../../../components/panel/ui.jsx';

export default function PostulacionesPage() {
  const user = BO.currentUser();
  const hasAccess = user.permisos.includes('postulaciones');

  if (!hasAccess) {
    return <NoAccess />;
  }

  return <Postulaciones onToast={showToast} />;
}
