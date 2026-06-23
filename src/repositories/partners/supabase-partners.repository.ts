import { BO } from '../../lib/store.js';
import { Partner } from './partner.types';
import { createClient } from '../../lib/supabase/client';

const getSupabase = () => createClient();

export const SupabasePartnersRepository = {
  async getAll(): Promise<Partner[]> {
    const { data, error } = await getSupabase().from('partners').select('*').order('fecha', { ascending: false });
    if (error) throw error;
    const mapped = data || [];
    BO.write('partners', mapped);
    return mapped as Partner[];
  },

  async getById(id: string): Promise<Partner | null> {
    const { data, error } = await getSupabase().from('partners').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Partner;
  },

  async create(payload: Partial<Partner>): Promise<Partner> {
    const supabase = getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const { data, error } = await supabase.from('partners').insert([payload]).select().single();
      if (error) throw error;
      const created = data as Partner;
      const current = BO.all('partners');
      BO.write('partners', [created, ...current]);
      return created;
    } else {
      const { error } = await supabase.from('partners').insert([payload]);
      if (error) throw error;
      return { ...payload, id: 'temp-' + Date.now(), fecha: new Date().toISOString() } as Partner;
    }
  },

  async update(id: string, patch: Partial<Partner>): Promise<Partner> {
    const { data, error } = await getSupabase().from('partners').update(patch).eq('id', id).select().single();
    if (error) throw error;
    const updated = data as Partner;
    const current = BO.all('partners').map((r: any) => r.id === id ? updated : r);
    BO.write('partners', current);
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await getSupabase().from('partners').delete().eq('id', id);
    if (error) throw error;
    const current = BO.all('partners').filter((r: any) => r.id !== id);
    BO.write('partners', current);
    return true;
  },

  async addNote(id: string, text: string, author: string = 'admin'): Promise<Partner> {
    const record = await this.getById(id);
    if (!record) throw new Error('Record not found');
    const newNote = { id: BO.uid('n'), texto: text, autor: author, fecha: new Date().toISOString() };
    const updatedNotes = [...(record.notas || []), newNote];
    return this.update(id, { notas: updatedNotes });
  }
};
