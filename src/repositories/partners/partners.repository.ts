import { BO } from '../../lib/store.js';
import { Partner } from './partner.types';
import { createClient } from '../../lib/supabase/client';

const USE_SUPABASE = process.env.NEXT_PUBLIC_DATA_SOURCE === 'supabase';
const getSupabase = () => createClient();

export const PartnersRepository = {
  async getAll(): Promise<Partner[]> {
    if (USE_SUPABASE) {
      const { data, error } = await getSupabase().from('partners').select('*').order('fecha', { ascending: false });
      if (error) throw error;
      const mapped = data || [];
      BO.write('partners', mapped);
      return mapped as Partner[];
    }
    return BO.all('partners') as Partner[];
  },

  async getById(id: string): Promise<Partner | null> {
    if (USE_SUPABASE) {
      const { data, error } = await getSupabase().from('partners').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Partner;
    }
    return BO.get('partners', id) as Partner | null;
  },

  async create(payload: Partial<Partner>): Promise<Partner> {
    if (USE_SUPABASE) {
      const { data, error } = await getSupabase().from('partners').insert([payload]).select().single();
      if (error) throw error;
      const created = data as Partner;
      const current = BO.all('partners');
      BO.write('partners', [created, ...current]);
      return created;
    }
    return BO.insert('partners', payload) as Partner;
  },

  async update(id: string, patch: Partial<Partner>): Promise<Partner> {
    if (USE_SUPABASE) {
      const { data, error } = await getSupabase().from('partners').update(patch).eq('id', id).select().single();
      if (error) throw error;
      const updated = data as Partner;
      const current = BO.all('partners').map((r: any) => r.id === id ? updated : r);
      BO.write('partners', current);
      return updated;
    }
    return BO.update('partners', id, patch) as Partner;
  },

  async delete(id: string): Promise<boolean> {
    if (USE_SUPABASE) {
      const { error } = await getSupabase().from('partners').delete().eq('id', id);
      if (error) throw error;
      const current = BO.all('partners').filter((r: any) => r.id !== id);
      BO.write('partners', current);
      return true;
    }
    BO.remove('partners', id);
    return true;
  },

  async addNote(id: string, text: string, author: string = 'admin'): Promise<Partner> {
    if (USE_SUPABASE) {
      const record = await this.getById(id);
      if (!record) throw new Error('Record not found');
      const newNote = { id: BO.uid('n'), texto: text, autor: author, fecha: new Date().toISOString() };
      const updatedNotes = [...(record.notas || []), newNote];
      return this.update(id, { notas: updatedNotes });
    }
    return BO.addNote('partners', id, text, author) as Partner;
  }
};
