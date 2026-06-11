'use client';

import React from 'react';
import { BO } from '../../../lib/store.js';
import { Destinos } from '../../../components/panel/Destinos.jsx';
import { NoAccess } from '../../../components/panel/Shell.jsx';
import { showToast } from '../../../components/panel/ui.jsx';

export default function DestinosPage() {
  const user = BO.currentUser();
  const hasAccess = user.permisos.includes('destinos');

  if (!hasAccess) {
    return <NoAccess />;
  }

  return <Destinos onToast={showToast} />;
}
