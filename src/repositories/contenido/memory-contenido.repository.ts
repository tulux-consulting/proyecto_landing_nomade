import { MemoryDb } from '../memory-db';
import { getInitialContent } from './supabase-contenido.repository';
import { LandingContent } from './contenido.types';

export const MemoryContenidoRepository = {
  async getDraft(): Promise<LandingContent> {
    const defaults = getInitialContent();
    const doc = MemoryDb.getDoc('contenido_draft', null);
    if (!doc) return defaults;

    // Deep merge to ensure all keys exist
    return {
      hero: { ...defaults.hero, ...doc.hero },
      whatis: { ...defaults.whatis, ...doc.whatis },
      experience: { ...defaults.experience, ...doc.experience },
      split: { ...defaults.split, ...doc.split },
      destinations: { ...defaults.destinations, ...doc.destinations },
      model: { ...defaults.model, ...doc.model },
      landowners: { ...defaults.landowners, ...doc.landowners },
      process: { ...defaults.process, ...doc.process },
      partners: { ...defaults.partners, ...doc.partners },
      guests: { ...defaults.guests, ...doc.guests },
      footer: { ...defaults.footer, ...doc.footer }
    };
  },

  async getPublished(): Promise<LandingContent> {
    const defaults = getInitialContent();
    const doc = MemoryDb.getDoc('contenido_published', null);
    if (!doc) return defaults;

    // Deep merge to ensure all keys exist
    return {
      hero: { ...defaults.hero, ...doc.hero },
      whatis: { ...defaults.whatis, ...doc.whatis },
      experience: { ...defaults.experience, ...doc.experience },
      split: { ...defaults.split, ...doc.split },
      destinations: { ...defaults.destinations, ...doc.destinations },
      model: { ...defaults.model, ...doc.model },
      landowners: { ...defaults.landowners, ...doc.landowners },
      process: { ...defaults.process, ...doc.process },
      partners: { ...defaults.partners, ...doc.partners },
      guests: { ...defaults.guests, ...doc.guests },
      footer: { ...defaults.footer, ...doc.footer }
    };
  },

  async updateDraft(documento: LandingContent): Promise<LandingContent> {
    MemoryDb.setDoc('contenido_draft', documento);
    return documento;
  },

  async publish(documento: LandingContent): Promise<LandingContent> {
    MemoryDb.setDoc('contenido_draft', documento);
    MemoryDb.setDoc('contenido_published', documento);
    return documento;
  },

  async get(): Promise<LandingContent> {
    return this.getDraft();
  },

  async update(documento: LandingContent): Promise<LandingContent> {
    return this.publish(documento);
  }
};
