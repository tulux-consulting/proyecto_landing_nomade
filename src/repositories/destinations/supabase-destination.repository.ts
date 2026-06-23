import { BO } from '../../lib/store.js';
import { Destino } from './destination.types';
import { createClient } from '../../lib/supabase/client';

const getSupabase = () => createClient();

function mapFromDb(row: any): Destino {
  if (!row) return null as any;
  return {
    id: row.id,
    fecha: row.created_at || row.fecha,
    nombre: row.name || '',
    complejo: row.complejo || '',
    ubicacion: row.ubicacion || '',
    estado: row.status === 'published' ? 'Disponible' : 'No disponible',
    descripcion: row.description || '',
    imagen: row.cover_image_url || '',
    fotos: row.photos || [],
    reserva: row.reservation_url || '',
    archivado: row.archivado || false
  };
}

function mapToDb(payload: Partial<Destino>): any {
  const out: any = {};
  if (payload.id) out.id = payload.id;
  if (payload.nombre) {
    out.name = payload.nombre;
    out.city = payload.nombre;
  }
  if (payload.complejo !== undefined) out.complejo = payload.complejo;
  if (payload.ubicacion !== undefined) {
    out.ubicacion = payload.ubicacion;
    const parts = payload.ubicacion.split('·');
    if (parts.length > 0) {
      out.region = parts[0].trim();
    }
  }
  if (payload.estado) {
    out.status = payload.estado === 'Disponible' ? 'published' : 'draft';
  }
  if (payload.descripcion !== undefined) out.description = payload.descripcion;
  if (payload.imagen !== undefined) out.cover_image_url = payload.imagen;
  if (payload.fotos !== undefined) out.photos = payload.fotos;
  if (payload.reserva !== undefined) out.reservation_url = payload.reserva;
  if (payload.archivado !== undefined) out.archivado = payload.archivado;
  return out;
}

export const SupabaseDestinosRepository = {
  async getAll(): Promise<Destino[]> {
    const { data, error } = await getSupabase().from('destinos').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    const mapped = (data || []).map(mapFromDb);
    BO.write('destinos', mapped);
    return mapped;
  },

  async getPublished(): Promise<Destino[]> {
    const { data, error } = await getSupabase()
      .from('destinos')
      .select('*')
      .eq('status', 'published')
      .eq('archivado', false)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapFromDb);
  },

  async getById(id: string): Promise<Destino | null> {
    const { data, error } = await getSupabase().from('destinos').select('*').eq('id', id).single();
    if (error) throw error;
    return data ? mapFromDb(data) : null;
  },

  async create(payload: Partial<Destino>): Promise<Destino> {
    const dbPayload = mapToDb(payload);
    const { data, error } = await getSupabase().from('destinos').insert([dbPayload]).select().single();
    if (error) throw error;
    const created = mapFromDb(data);
    const current = BO.all('destinos');
    BO.write('destinos', [created, ...current]);
    return created;
  },

  async update(id: string, patch: Partial<Destino>): Promise<Destino> {
    const dbPatch = mapToDb(patch);
    const { data, error } = await getSupabase().from('destinos').update(dbPatch).eq('id', id).select().single();
    if (error) throw error;
    const updated = mapFromDb(data);
    const current = BO.all('destinos').map((r: any) => r.id === id ? updated : r);
    BO.write('destinos', current);
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await getSupabase().from('destinos').delete().eq('id', id);
    if (error) throw error;
    const current = BO.all('destinos').filter((r: any) => r.id !== id);
    BO.write('destinos', current);
    return true;
  }
};
