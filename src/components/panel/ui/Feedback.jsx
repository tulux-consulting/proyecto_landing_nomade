import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon.jsx';

export function Empty({ icon, title, children }) {
  return (
    <div className="empty">
      <span className="empty-ic"><Icon name={icon || "inbox"} /></span>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

export function showToast(msg) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent("bo-toast", { detail: msg }));
  }
}

export function ToastHost() {
  const [msg, setMsg] = useState(null);
  const t = useRef(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const on = (e) => { setMsg(e.detail); clearTimeout(t.current); t.current = setTimeout(() => setMsg(null), 3200); };
    window.addEventListener("bo-toast", on);
    return () => window.removeEventListener("bo-toast", on);
  }, []);
  if (!msg) return null;
  return <div className="bo-toast" role="status" aria-live="polite"><Icon name="check" />{msg}</div>;
}

export function Spinner({ message, onDark = false, size = "md", inline = false }) {
  const spinnerClass = `spinner ${onDark ? 'on-dark' : ''} spinner-${size}`;
  if (inline) {
    return (
      <span className="spinner-inline">
        <span className={spinnerClass} />
        {message && <span className="spinner-message" style={{ color: 'inherit' }}>{message}</span>}
      </span>
    );
  }
  return (
    <div className="spinner-container">
      <span className={spinnerClass} />
      {message && <p className="spinner-message" style={{ color: onDark ? 'var(--fg-on-dark-2)' : 'var(--fg3)' }}>{message}</p>}
    </div>
  );
}

