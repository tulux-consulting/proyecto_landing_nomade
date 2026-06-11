import React from 'react';
import { Icon } from './Icon.jsx';

export function Btn({ variant, icon, iconRight, children, onClick, type, sm, title }) {
  const cls = "btn-bo " + (variant === "primary" ? "btn-primary-bo" : "btn-ghost-bo") + (sm ? " btn-sm" : "");
  return (
    <button className={cls} onClick={onClick} type={type || "button"} title={title}>
      {icon && <Icon name={icon} />}{children}{iconRight && <Icon name={iconRight} />}
    </button>
  );
}
