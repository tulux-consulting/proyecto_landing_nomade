'use client';

// NÓMADE — Acceso interno (Next.js route "/panel/login").
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { panelIsAuthed, panelLogin, panelResetPassword } from '../../../lib/auth.js';

function EyeIcon({ off }) {
  return off ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 18" /><path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" />
      <path d="M9.4 5.2A9.5 9.5 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-2.2 3.1" />
      <path d="M6.1 6.1A17 17 0 0 0 2 12s3.5 7 10 7a9.3 9.3 0 0 0 3-.5" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function PanelLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (panelIsAuthed()) {
      router.replace("/panel");
    }
  }, [router]);

  const submit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!email.trim() || !pass) {
      setError("Por favor, completá todos los campos.");
      return;
    }
    
    const isEmail = email.includes('@');
    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Por favor, ingresá un correo electrónico válido.");
        return;
      }
    } else {
      const usernameRegex = /^[a-zA-Z0-9._-]+$/;
      if (!usernameRegex.test(email)) {
        setError("El usuario ingresado contiene caracteres inválidos o espacios.");
        return;
      }
    }

    setLoading(true);
    setError("");
    setResetSuccess("");
    
    try {
      const ok = await panelLogin(email, pass);
      if (ok) {
        router.replace("/panel");
      } else {
        setError("Usuario o contraseña incorrectos, o no tenés permisos suficientes.");
        setPass("");
      }
    } catch (err) {
      setError("Ocurrió un error inesperado al intentar iniciar sesión.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError("Ingresá tu usuario o email para solicitar la recuperación.");
      return;
    }
    setLoading(true);
    setError("");
    setResetSuccess("");
    try {
      const res = await panelResetPassword(email);
      if (res.success) {
        setResetSuccess(`Se ha enviado un correo de recuperación a ${res.email}.`);
      } else {
        setError(res.error || "No se pudo enviar el correo de recuperación.");
      }
    } catch (err) {
      setError("Error al procesar la solicitud.");
    } finally {
      setLoading(false);
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
              <span>{error}</span>
            </p>
          )}

          {resetSuccess && (
            <p className="access-success" style={{ color: '#10b981', display: 'flex', gap: 6, alignItems: 'center', fontSize: 13.5, background: 'rgba(16, 185, 129, 0.1)', padding: '10px 12px', borderRadius: 6, margin: '0 0 16px' }} role="status">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><circle cx="12" cy="12" r="9" /><path d="m9 12 2 2 4-4" /></svg>
              <span>{resetSuccess}</span>
            </p>
          )}

          <div className="access-field">
            <label htmlFor="email">Usuario o Email</label>
            <div className="access-input-wrap">
              <input id="email" name="email" type="text" placeholder="Tu usuario o email" autoComplete="username"
                autoCapitalize="none" spellCheck="false" required disabled={loading}
                value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} />
            </div>
          </div>

          <div className="access-field">
            <label htmlFor="clave">Contraseña</label>
            <div className="access-input-wrap">
              <input id="clave" name="clave" type={show ? "text" : "password"} placeholder="Tu contraseña"
                autoComplete="current-password" required disabled={loading}
                value={pass} onChange={(e) => { setPass(e.target.value); setError(""); }} />
              <button type="button" className="access-toggle" onClick={() => setShow((s) => !s)}
                aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={show} disabled={loading}>
                <EyeIcon off={show} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -8, marginBottom: 12 }}>
            <button type="button" className="btn-text" style={{ fontSize: 12.5, textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', color: 'var(--fg3)', padding: 0 }}
              onClick={handleResetPassword} disabled={loading}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button type="submit" className="access-btn" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
            {!loading && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
            )}
          </button>
        </form>

        <p className="access-foot">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
          Conexión privada · uso exclusivo del equipo NÓMADE
        </p>
      </section>
    </main>
  );
}
