'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nomade_bo_resetting_password', 'true');
    }
    return () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nomade_bo_resetting_password');
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Por favor, completá todos los campos.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('nomade_bo_resetting_password');
        }
        await supabase.auth.signOut();
        setTimeout(() => {
          router.replace('/panel/login');
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al intentar cambiar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="access">
      <section className="access-card" role="dialog" aria-labelledby="reset-title">
        <div className="access-mark">
          <img src="/assets/brand/isotipo-forest.svg" alt="NÓMADE" />
          <p className="access-eyebrow">Recuperar acceso</p>
        </div>
        <h1 id="reset-title">Nueva Contraseña</h1>
        <p className="access-sub">Ingresá tu nueva contraseña para volver a acceder al panel.</p>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p className="access-success" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: 6, fontSize: 14 }}>
              Contraseña restablecida con éxito. Redirigiendo al inicio de sesión...
            </p>
          </div>
        ) : (
          <form className="access-form" onSubmit={handleSubmit} autoComplete="off">
            {error && (
              <p className="access-error" role="alert">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                <span>{error}</span>
              </p>
            )}

            <div className="access-field">
              <label htmlFor="password">Nueva contraseña</label>
              <div className="access-input-wrap">
                <input id="password" name="password" type="password" placeholder="Mínimo 6 caracteres"
                  required disabled={loading} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <div className="access-field">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <div className="access-input-wrap">
                <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Repetir contraseña"
                  required disabled={loading} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="access-btn" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar contraseña"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
