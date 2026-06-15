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
