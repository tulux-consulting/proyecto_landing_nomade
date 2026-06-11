import { BO } from '../lib/store.js';
import { Postulacion, Partner, Destino, Huesped } from '../types/index';

// ============================================================================
// NÓMADE — Capa de Repositorios (Repository Pattern in TypeScript)
// ----------------------------------------------------------------------------
// Esta capa abstrae el origen de datos (actualmente localStorage a través de BO)
// para permitir una migración fluida a Supabase.
// ============================================================================

const USE_SUPABASE = process.env.NEXT_PUBLIC_DATA_SOURCE === 'supabase';

// Mock del cliente Supabase (para referencia y tipado implícito)
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

export const ContenidoRepository = {
  async get(): Promise<any> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('contenido').select('documento').eq('id', 'landing').single();
      if (error) throw error;
      return data.documento;
    }
    return BO.getDoc('contenido', {});
  },

  async update(documento: any): Promise<any> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('contenido').upsert({ id: 'landing', documento }).select().single();
      if (error) throw error;
      return data.documento;
    }
    BO.setDoc('contenido', documento);
    return documento;
  }
};
