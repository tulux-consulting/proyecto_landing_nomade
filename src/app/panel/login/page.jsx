'use client';

// NÓMADE — Acceso interno (Next.js route "/panel/login").
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { panelIsAuthed, panelLogin } from '../../../lib/auth.js';

function EyeIcon({ off }) {
  return off ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 18" /><path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" />
      <path d="M9.4 5.2A9.5 9.5 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-2.2 3.1" />
      <path d="M6.1 6.1A17 17 0 0 0 2 12s3.5 7 10 7a9.3 9.3 0 0 0 3-.5" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function PanelLogin() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (panelIsAuthed()) {
      router.replace("/panel");
    }
  }, [router]);

  const submit = async (e) => {
    e.preventDefault();
    const ok = await panelLogin(user, pass);
    if (ok) {
      router.replace("/panel");
    } else {
      setError(true);
      setPass("");
    }
  };

  return (
    <main className="access">
      <section className="access-card" role="dialog" aria-labelledby="access-title">
        <div className="access-mark">
          <img src="/assets/brand/isotipo-forest.svg" alt="NÓMADE" />
          <p className="access-eyebrow">Acceso interno</p>
        </div>
        <h1 id="access-title">Panel NÓMADE</h1>
        <p className="access-sub">Área privada. Ingresá con tus credenciales para continuar.</p>

        <form className="access-form" onSubmit={submit} autoComplete="off" noValidate>
          {error && (
            <p className="access-error" role="alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
              <span>Usuario o contraseña incorrectos.</span>
            </p>
          )}

          <div className="access-field">
            <label htmlFor="usuario">Usuario</label>
            <div className="access-input-wrap">
              <input id="usuario" name="usuario" type="text" placeholder="Tu usuario" autoComplete="username"
                autoCapitalize="none" spellCheck="false" required
                value={user} onChange={(e) => { setUser(e.target.value); setError(false); }} />
            </div>
          </div>

          <div className="access-field">
            <label htmlFor="clave">Contraseña</label>
            <div className="access-input-wrap">
              <input id="clave" name="clave" type={show ? "text" : "password"} placeholder="Tu contraseña"
                autoComplete="current-password" required
                value={pass} onChange={(e) => { setPass(e.target.value); setError(false); }} />
              <button type="button" className="access-toggle" onClick={() => setShow((s) => !s)}
                aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={show}>
                <EyeIcon off={show} />
              </button>
            </div>
          </div>

          <button type="submit" className="access-btn">
            Ingresar
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
          </button>
        </form>

        <p className="access-foot">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
          Conexión privada · uso exclusivo del equipo NÓMADE
        </p>
      </section>
    </main>
  );
}
