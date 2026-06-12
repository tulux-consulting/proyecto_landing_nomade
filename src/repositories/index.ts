import { BO } from '../lib/store.js';
import { NOMADE } from '../data/content.js';
import { Postulacion, Partner, Destino, Huesped, LandingContent } from '../types/index';

// ============================================================================
// NÓMADE — Capa de Repositorios (Repository Pattern in TypeScript)
// ============================================================================

const USE_SUPABASE = process.env.NEXT_PUBLIC_DATA_SOURCE === 'supabase';

const supabase: any = {
  from: (table: string) => ({
    select: () => ({
      order: async () => ({ data: [] as any[], error: null }),
      eq: () => ({
        single: async () => ({ data: null, error: null })
      })
    }),
    insert: () => ({
      select: () => ({
        single: async () => ({ data: null, error: null })
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null })
        })
      })
    }),
    delete: () => ({
      eq: async () => ({ error: null })
    })
  })
};

export const PostulacionesRepository = {
  async getAll(): Promise<Postulacion[]> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('postulaciones').select('*').order('fecha', { ascending: false });
      if (error) throw error;
      return data as Postulacion[];
    }
    return BO.all('postulaciones') as Postulacion[];
  },

  async getById(id: string): Promise<Postulacion | null> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('postulaciones').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Postulacion;
    }
    return BO.get('postulaciones', id) as Postulacion | null;
  },

  async create(payload: Partial<Postulacion>): Promise<Postulacion> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('postulaciones').insert([payload]).select().single();
      if (error) throw error;
      return data as Postulacion;
    }
    return BO.insert('postulaciones', payload) as Postulacion;
  },

  async update(id: string, patch: Partial<Postulacion>): Promise<Postulacion> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('postulaciones').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return data as Postulacion;
    }
    return BO.update('postulaciones', id, patch) as Postulacion;
  },

  async delete(id: string): Promise<boolean> {
    if (USE_SUPABASE) {
      const { error } = await supabase.from('postulaciones').delete().eq('id', id);
      if (error) throw error;
      return true;
    }
    BO.remove('postulaciones', id);
    return true;
  },

  async addNote(id: string, text: string, author: string = 'admin'): Promise<Postulacion> {
    if (USE_SUPABASE) {
      const record = await this.getById(id);
      if (!record) throw new Error('Record not found');
      const newNote = { id: BO.uid('n'), texto: text, autor: author, fecha: new Date().toISOString() };
      const updatedNotes = [...(record.notas || []), newNote];
      return this.update(id, { notas: updatedNotes });
    }
    return BO.addNote('postulaciones', id, text, author) as Postulacion;
  }
};

export const PartnersRepository = {
  async getAll(): Promise<Partner[]> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('partners').select('*').order('fecha', { ascending: false });
      if (error) throw error;
      return data as Partner[];
    }
    return BO.all('partners') as Partner[];
  },

  async getById(id: string): Promise<Partner | null> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('partners').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Partner;
    }
    return BO.get('partners', id) as Partner | null;
  },

  async create(payload: Partial<Partner>): Promise<Partner> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('partners').insert([payload]).select().single();
      if (error) throw error;
      return data as Partner;
    }
    return BO.insert('partners', payload) as Partner;
  },

  async update(id: string, patch: Partial<Partner>): Promise<Partner> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('partners').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return data as Partner;
    }
    return BO.update('partners', id, patch) as Partner;
  },

  async delete(id: string): Promise<boolean> {
    if (USE_SUPABASE) {
      const { error } = await supabase.from('partners').delete().eq('id', id);
      if (error) throw error;
      return true;
    }
    BO.remove('partners', id);
    return true;
  }
};

export const DestinosRepository = {
  async getAll(): Promise<Destino[]> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('destinos').select('*').order('fecha', { ascending: false });
      if (error) throw error;
      return data as Destino[];
    }
    return BO.all('destinos') as Destino[];
  },

  async getById(id: string): Promise<Destino | null> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('destinos').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Destino;
    }
    return BO.get('destinos', id) as Destino | null;
  },

  async create(payload: Partial<Destino>): Promise<Destino> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('destinos').insert([payload]).select().single();
      if (error) throw error;
      return data as Destino;
    }
    return BO.insert('destinos', payload) as Destino;
  },

  async update(id: string, patch: Partial<Destino>): Promise<Destino> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('destinos').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return data as Destino;
    }
    return BO.update('destinos', id, patch) as Destino;
  },

  async delete(id: string): Promise<boolean> {
    if (USE_SUPABASE) {
      const { error } = await supabase.from('destinos').delete().eq('id', id);
      if (error) throw error;
      return true;
    }
    BO.remove('destinos', id);
    return true;
  }
};

export const HuespedesRepository = {
  async getAll(): Promise<Huesped[]> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('huespedes').select('*').order('fecha', { ascending: false });
      if (error) throw error;
      return data as Huesped[];
    }
    return BO.all('huespedes') as Huesped[];
  },

  async create(payload: Partial<Huesped>): Promise<Huesped> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('huespedes').insert([payload]).select().single();
      if (error) throw error;
      return data as Huesped;
    }
    return BO.insert('huespedes', payload) as Huesped;
  }
};

function getInitialContent(): LandingContent {
  const N = NOMADE as any;
  return {
    hero: {
      imagen: N.hero.imagen || N.hero.img || "",
      eyebrow: N.hero.eyebrow || "",
      titulo: N.hero.titulo || `${N.hero.h1a || ""} ${N.hero.h1b || ""}`.trim(),
      subtitulo: N.hero.subtitulo || `${N.hero.sub1 || ""} ${N.hero.sub2 || ""}`.trim(),
      lead: N.hero.lead || "",
      cta: N.hero.cta || ""
    },
    whatis: {
      eyebrow: N.whatis.eyebrow || "",
      h2: N.whatis.h2 || "",
      lead: N.whatis.lead || "",
      points: N.whatis.points || []
    },
    experience: {
      eyebrow: N.experience.eyebrow || "",
      h2: N.experience.h2 || "",
      lead: N.experience.lead || "",
      img: N.experience.img || "",
      pillars: N.experience.pillars || [],
      statement: N.experience.statement || []
    },
    split: {
      eyebrow: N.split.eyebrow || "",
      h2: N.split.h2 || "",
      lead: N.split.lead || "",
      options: [
        {
          kicker: N.split.left?.kicker || "",
          imagen: N.split.left?.img || "",
          h: N.split.left?.h || "",
          p: N.split.left?.p || "",
          cta: N.split.left?.cta || "",
          target: N.split.left?.target || ""
        },
        {
          kicker: N.split.right?.kicker || "",
          imagen: N.split.right?.img || "",
          h: N.split.right?.h || "",
          p: N.split.right?.p || "",
          cta: N.split.right?.cta || "",
          target: N.split.right?.target || ""
        }
      ]
    },
    destinations: {
      eyebrow: N.destinations.eyebrow || "",
      h2: N.destinations.h2 || "",
      lead: N.destinations.lead || "",
      types: N.destinations.types || [],
      note: N.destinations.note || "",
      mapEyebrow: N.destinations.mapEyebrow || "",
      mapH: N.destinations.mapH || "",
      mapLead: N.destinations.mapLead || "",
      disclaimer: N.destinations.disclaimer || "",
      terrain: N.destinations.terrain || "",
      regions: N.destinations.regions || {}
    },
    model: {
      eyebrow: N.model.eyebrow || "",
      h2: N.model.h2 || "",
      lead: N.model.lead || "",
      parts: N.model.parts || [],
      result: N.model.result || {}
    },
    landowners: {
      eyebrow: N.landowners.eyebrow || "",
      h2: N.landowners.h2 || "",
      lead: N.landowners.lead || "",
      img: N.landowners.img || "",
      qualifies: N.landowners.qualifies || { h: "", items: [] },
      disqualifies: N.landowners.disqualifies || { h: "", items: [] },
      benefits: N.landowners.benefits || [],
      cta: N.landowners.cta || ""
    },
    process: {
      eyebrow: N.process.eyebrow || "",
      h2: N.process.h2 || "",
      lead: N.process.lead || "",
      steps: N.process.steps || []
    },
    partners: {
      eyebrow: N.partners.eyebrow || "",
      h2: N.partners.h2 || "",
      lead: N.partners.lead || "",
      audiences: N.partners.audiences || [],
      value: N.partners.value || [],
      cta: N.partners.cta || ""
    },
    guests: {
      eyebrow: N.guests.eyebrow || "",
      h2: N.guests.h2 || "",
      lead: N.guests.lead || "",
      placeholder: N.guests.placeholder || "",
      cta: N.guests.cta || "",
      success: N.guests.success || "",
      note: N.guests.note || ""
    },
    footer: {
      tagline: "Una red de hospitalidad y bienestar. Experiencias extraordinarias, estándares consistentes, en ubicaciones cuidadosamente seleccionadas.",
      copyright: "© 2026 NÓMADE — todos los derechos reservados."
    }
  };
}

export const ContenidoRepository = {
  async get(): Promise<LandingContent> {
    let doc: any = null;
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('contenido').select('documento').eq('id', 'landing').single();
      if (!error && data) {
        doc = data.documento;
      }
    } else {
      doc = BO.getDoc('contenido', null);
    }

    const defaults = getInitialContent();
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

  async update(documento: LandingContent): Promise<LandingContent> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('contenido').upsert({ id: 'landing', documento }).select().single();
      if (error) throw error;
      return data.documento as LandingContent;
    }
    BO.setDoc('contenido', documento);
    return documento;
  }
};
