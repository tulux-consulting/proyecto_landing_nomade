import { BO } from '../../lib/store.js';
import { Huesped } from './huesped.types';
import { createClient } from '../../lib/supabase/client';

const getSupabase = () => createClient();

const mapToApp = (db: any): Huesped => ({
  id: db.id,
  fecha: db.created_at,
  email: db.email,
  pais: db.country,
  provincia: db.region,
  ciudad: db.city,
  dispositivo: db.device_type,
  so: db.operating_system,
  navegador: db.browser,
  estado: db.status,
  admin_notes: db.admin_notes
});

const mapToDb = (app: Partial<Huesped>): any => {
  const db: any = {};
  if (app.email !== undefined) db.email = app.email;
  if (app.pais !== undefined) db.country = app.pais;
  if (app.provincia !== undefined) db.region = app.provincia;
  if (app.ciudad !== undefined) db.city = app.ciudad;
  if (app.dispositivo !== undefined) db.device_type = app.dispositivo;
  if (app.so !== undefined) db.operating_system = app.so;
  if (app.navegador !== undefined) db.browser = app.navegador;
  if (app.estado !== undefined) db.status = app.estado;
  if (app.admin_notes !== undefined) db.admin_notes = app.admin_notes;
  return db;
};

export const SupabaseHuespedesRepository = {
  async getAll(): Promise<Huesped[]> {
    const { data, error } = await getSupabase()
      .from('guest_waitlist')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    const mapped = (data || []).map(mapToApp);
    BO.write('huespedes', mapped);
    return mapped;
  },

  async create(payload: Partial<Huesped>): Promise<Huesped> {
    const dbPayload = mapToDb(payload);
    if (dbPayload.status === undefined) dbPayload.status = 'Nuevo';
    if (dbPayload.admin_notes === undefined) dbPayload.admin_notes = '';
    
    const supabase = getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const { data, error } = await supabase
        .from('guest_waitlist')
        .insert([dbPayload])
        .select()
        .single();
      
      if (error) throw error;
      const created = mapToApp(data);
      const current = BO.all('huespedes');
      BO.write('huespedes', [created, ...current]);
      return created;
    } else {
      const { error } = await supabase
        .from('guest_waitlist')
        .insert([dbPayload]);
      
      if (error) throw error;
      return { ...payload, id: 'temp-' + Date.now(), fecha: new Date().toISOString() } as Huesped;
    }
  },

  async update(id: string, patch: Partial<Huesped>): Promise<Huesped> {
    const dbPatch = mapToDb(patch);
    const { data, error } = await getSupabase()
      .from('guest_waitlist')
      .update(dbPatch)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    const updated = mapToApp(data);
    const current = BO.all('huespedes').map((r: any) => r.id === id ? updated : r);
    BO.write('huespedes', current);
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await getSupabase()
      .from('guest_waitlist')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    const current = BO.all('huespedes').filter((r: any) => r.id !== id);
    BO.write('huespedes', current);
    return true;
  }
};
