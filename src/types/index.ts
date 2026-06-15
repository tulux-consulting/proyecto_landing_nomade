export interface NotaInterna {
  id: string;
  texto: string;
  autor: string;
  fecha: string;
}

export interface DocumentoAdjunto {
  nombre: string;
  tipo: string;
}

export interface Postulacion {
  id: string;
  fecha: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  provincia: string;
  localidad: string;
  tamano: string;
  paisaje: string[];
  modelo: string;
  estado: string;
  archivado: boolean;
  comentarios?: string;
  notas: NotaInterna[];
  relacion?: string;
  mapsLink?: string;
  distanciaCiudad?: string;
  topografia?: string;
  cuerpoAgua?: string;
  vistas?: string;
  vegetacion?: string;
  accesoTipo?: string;
  accesoDisp?: string;
  servicios?: string[];
  construcciones?: string;
  aeropuerto?: string;
  legal?: {
    titulo: string;
    usoSuelo: string;
    restricciones: string;
    observaciones: string;
  };
  turismo?: {
    actividades: string[];
    atractivos: string;
    demanda: string;
  };
  participacion?: {
    modelo: string;
    inversion: string;
    horizonte: string;
  };
  fotos?: string[];
  documentos?: DocumentoAdjunto[];
}

export interface Partner {
  id: string;
  fecha: string;
  nombre: string;
  tipo: string;
  fiscal: string;
  provincia: string;
  localidad: string;
  telefono: string;
  email: string;
  web?: string;
  capacidad?: string;
  anosOperando?: number;
  estado: string;
  archivado: boolean;
  descripcion?: string;
  fotos?: string[];
  notas: NotaInterna[];
  origen?: string;
}

export interface Destino {
  id: string;
  fecha: string;
  nombre: string;
  complejo: string;
  ubicacion: string;
  estado: string;
  descripcion: string;
  imagen: string;
  fotos: string[];
  reserva: string;
  archivado: boolean;
}

export interface Huesped {
  id: string;
  fecha: string;
  email: string;
  pais: string;
  provincia: string;
  ciudad: string;
  navegador: string;
  so: string;
  dispositivo: string;
  estado?: string;
  admin_notes?: string;
}

// ============================================================================
// NÓMADE — Tipos del CMS de Contenido (LandingContent)
// ============================================================================

export interface HeroSection {
  imagen: string;
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  lead: string;
  cta: string;
}

export interface WhatIsPoint {
  icon: string;
  h: string;
  p: string;
}

export interface WhatIsSection {
  eyebrow: string;
  h2: string;
  lead: string;
  points: WhatIsPoint[];
}

export interface ExperiencePillar {
  icon: string;
  h: string;
  p: string;
}

export interface ExperienceSection {
  eyebrow: string;
  h2: string;
  lead: string;
  img: string;
  pillars: ExperiencePillar[];
  statement: string[];
}

export interface SplitPanel {
  kicker: string;
  img?: string;
  imagen?: string;
  h: string;
  p: string;
  cta: string;
  target: string;
}

export interface SplitSection {
  eyebrow: string;
  h2: string;
  lead: string;
  left?: SplitPanel;
  right?: SplitPanel;
  options: SplitPanel[];
}

export interface DestinationType {
  img: string;
  cap: string;
}

export interface DestinationRegion {
  geo: string;
  desc: string;
  photos: string[];
  book: string;
}

export interface DestinationsSection {
  eyebrow: string;
  h2: string;
  lead: string;
  types: DestinationType[];
  note: string;
  mapEyebrow: string;
  mapH: string;
  mapLead: string;
  disclaimer: string;
  terrain: string;
  regions: Record<string, DestinationRegion>;
}

export interface ModelPart {
  icon: string;
  h: string;
  p: string;
}

export interface ModelResult {
  h: string;
  p: string;
}

export interface ModelSection {
  eyebrow: string;
  h2: string;
  lead: string;
  parts: ModelPart[];
  result: ModelResult;
}

export interface LandownerQualify {
  h: string;
  items: string[];
}

export interface LandownerBenefit {
  icon: string;
  h: string;
  p: string;
}

export interface LandownersSection {
  eyebrow: string;
  h2: string;
  lead: string;
  img: string;
  qualifies: LandownerQualify;
  disqualifies: LandownerQualify;
  benefits: LandownerBenefit[];
  cta: string;
}

export interface ProcessStep {
  n: string;
  icon: string;
  h: string;
  p: string;
}

export interface ProcessSection {
  eyebrow: string;
  h2: string;
  lead: string;
  steps: ProcessStep[];
}

export interface PartnerAudience {
  icon: string;
  h: string;
}

export interface PartnerValue {
  h: string;
  p: string;
}

export interface PartnersSection {
  eyebrow: string;
  h2: string;
  lead: string;
  audiences: PartnerAudience[];
  value: PartnerValue[];
  cta: string;
}

export interface GuestsSection {
  eyebrow: string;
  h2: string;
  lead: string;
  placeholder: string;
  cta: string;
  success: string;
  note: string;
}

export interface FooterSection {
  tagline: string;
  copyright: string;
}

export interface LandingContent {
  hero: HeroSection;
  whatis: WhatIsSection;
  experience: ExperienceSection;
  split: SplitSection;
  destinations: DestinationsSection;
  model: ModelSection;
  landowners: LandownersSection;
  process: ProcessSection;
  partners: PartnersSection;
  guests: GuestsSection;
  footer: FooterSection;
}

