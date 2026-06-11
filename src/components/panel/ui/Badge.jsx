import React from 'react';

export const STATUS_CLASS = {
  "Nuevo": "badge-nuevo", "Pendiente de revisión": "badge-pendiente", "Contactado": "badge-contactado",
  "En negociación": "badge-negociacion", "Aprobado": "badge-aprobado", "Rechazado": "badge-rechazado",
  "Disponible": "badge-disponible", "No disponible": "badge-nodisponible"
};

export const STATUS_HUE = {
  "Nuevo": "#4f8aa6", "Pendiente de revisión": "#9a7b1c", "Contactado": "#3a64a0",
  "En negociación": "#97653a", "Aprobado": "#37794f", "Rechazado": "#a84b41",
  "Disponible": "#37794f", "No disponible": "#9c958a"
};

export function Badge({ status }) {
  return <span className={"badge " + (STATUS_CLASS[status] || "badge-pendiente")}>{status}</span>;
}

export function StatusChanger({ options, value, onChange }) {
  return (
    <div className="status-set">
      {options.map((o) => {
        const hue = STATUS_HUE[o] || "var(--stone)";
        const on = o === value;
        return (
          <button key={o} className={"status-opt" + (on ? " on" : "")} onClick={() => onChange(o)}
            style={on ? { background: hue, borderColor: hue } : null}>
            <span className="status-dot" style={{ background: on ? "rgba(246,243,238,.92)" : hue }}></span>{o}
          </button>
        );
      })}
    </div>
  );
}
