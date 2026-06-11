'use client';

import React from 'react';
import { BO } from '../../../lib/store.js';
import { Partners } from '../../../components/panel/Partners.jsx';
import { NoAccess } from '../../../components/panel/Shell.jsx';
import { showToast } from '../../../components/panel/ui.jsx';

export default function PartnersPage() {
  const user = BO.currentUser();
  const hasAccess = user.permisos.includes('partners');

  if (!hasAccess) {
    return <NoAccess />;
  }

  return <Partners onToast={showToast} />;
}
