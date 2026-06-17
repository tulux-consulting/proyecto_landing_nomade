'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="access">
      <section className="access-card" role="dialog" aria-labelledby="notfound-title" style={{ maxWidth: '480px' }}>
        <div className="access-mark">
          <img src="/assets/brand/isotipo-forest.svg" alt="NÓMADE" />
          <p className="access-eyebrow" style={{ color: 'var(--moss)' }}>Error 404</p>
        </div>
        <h1 id="notfound-title" style={{ fontSize: '2rem', margin: '1rem 0' }}>Página no encontrada</h1>
        <p className="access-sub" style={{ marginBottom: '2rem' }}>
          Lo sentimos, la página que estás buscando no existe, ha sido eliminada o cambió de dirección.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <button 
            type="button" 
            className="access-btn" 
            onClick={() => router.push('/panel')}
            style={{ background: 'var(--moss)', borderColor: 'var(--moss)', color: '#fff' }}
          >
            Ir al Panel de Administración
          </button>

          <button 
            type="button" 
            className="access-btn" 
            onClick={() => router.push('/')}
            style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-h)' }}
          >
            Ir a la web pública
          </button>
        </div>

        <p className="access-foot" style={{ marginTop: '2rem' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          Si creés que esto es un error, por favor ponete en contacto con soporte.
        </p>
      </section>
    </main>
  );
}
