import React from 'react';
import { lucideIcon } from '../../../lib/lucide.js';

export function Icon({ name, className, style }) {
  const Glyph = lucideIcon(name);
  return (
    <span className={"ic" + (className ? " " + className : "")} style={style} aria-hidden="true">
      <Glyph strokeWidth={1.5} />
    </span>
  );
}

export function useLucide() {
  // no-op: Icon self-renders its glyph
}
