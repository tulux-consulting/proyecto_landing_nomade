'use client';

import React from 'react';
import { BO } from '../../../lib/store.js';
import { Huespedes } from '../../../components/panel/Huespedes.jsx';
import { NoAccess } from '../../../components/panel/Shell.jsx';
import { showToast } from '../../../components/panel/ui.jsx';

export default function HuespedesPage() {
  const user = BO.currentUser();
  const hasAccess = user.permisos.includes('huespedes');

  if (!hasAccess) {
    return <NoAccess />;
  }

  return <Huespedes onToast={showToast} />;
}
