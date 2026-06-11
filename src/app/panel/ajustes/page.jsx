'use client';

import React from 'react';
import { BO } from '../../../lib/store.js';
import { Ajustes } from '../../../components/panel/Ajustes.jsx';
import { NoAccess } from '../../../components/panel/Shell.jsx';
import { showToast } from '../../../components/panel/ui.jsx';

export default function AjustesPage() {
  const user = BO.currentUser();
  const hasAccess = user.permisos.includes('ajustes');

  if (!hasAccess) {
    return <NoAccess />;
  }

  return <Ajustes onToast={showToast} />;
}
