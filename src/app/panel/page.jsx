'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BO } from '../../lib/store.js';
import { Dashboard } from '../../components/panel/Dashboard.jsx';

export default function PanelDashboardPage() {
  const router = useRouter();
  const user = BO.currentUser();

  const handleGo = (route) => {
    router.push(route);
  };

  return <Dashboard user={user} onGo={handleGo} />;
}
