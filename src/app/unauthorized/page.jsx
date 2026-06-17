'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearPanelSession } from '../../lib/auth.js';

export default function UnauthorizedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('admin_required');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const r = params.get('reason');
      if (r) setReason(r);
    }
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await clearPanelSession();
      router.replace('/panel/login');
    } catch (e) {
      console.error('Error logging out:', e);
    } finally {
      setLoading(false);
    }
  };

  const isInactive = reason === 'inactive';

  return (
    <main className="access">
      <section className="access-card" role="dialog" aria-labelledby="unauthorized-title" style={{ maxWidth: '480px' }}>
        <div className="access-mark">
          <img src="/assets/brand/isotipo-forest.svg" alt="NÓMADE" />
          <p className="access-eyebrow" style={{ color: '#ea580c' }}>
            {isInactive ? "Cuenta suspendida" : "Acceso denegado"}
          </p>
        </div>
        <h1 id="unauthorized-title" style={{ fontSize: '2rem', margin: '1rem 0' }}>
          {isInactive ? "Usuario inactivo" : "No autorizado"}
        </h1>
        <p className="access-sub" style={{ marginBottom: '2rem' }}>
          {isInactive 
            ? "Tu cuenta de usuario ha sido desactivada por el administrador. Por favor, ponete en contacto con el equipo de soporte si creés que esto es un error."
            : "Tu cuenta no tiene los permisos necesarios (rol de Administrador) para acceder a esta sección."}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <button 
            type="button" 
            className="access-btn" 
            onClick={() => router.push('/')}
            style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-h)' }}
          >
            Ir a la web pública
          </button>

          <button 
            type="button" 
            className="access-btn" 
            onClick={handleLogout} 
            disabled={loading}
            style={{ background: '#ea580c', borderColor: '#ea580c', color: '#fff' }}
          >
            {loading ? "Cerrando sesión..." : "Cerrar sesión e ingresar con otra cuenta"}
          </button>
        </div>

        <p className="access-foot" style={{ marginTop: '2rem' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
          Conexión privada · uso exclusivo del equipo NÓMADE
        </p>
      </section>
    </main>
  );
}
