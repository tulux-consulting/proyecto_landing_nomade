import { BO } from '../../lib/store.js';
import { Postulacion } from '../../types/index';
import { createClient } from '../../lib/supabase/client';

const USE_SUPABASE = process.env.NEXT_PUBLIC_DATA_SOURCE === 'supabase';
const getSupabase = () => createClient();

// Mapear campos planos de la base de datos a estructura con objetos anidados esperada por la UI
function mapFromDb(row: any): Postulacion {
  if (!row) return null as any;
  return {
    id: row.id,
    fecha: row.fecha || row.created_at,
    nombre: row.nombre,
    apellido: row.apellido,
    email: row.email,
    telefono: row.telefono,
    relacion: row.relacion,
    provincia: row.provincia,
    localidad: row.localidad,
    mapsLink: row.coords || '',
    distanciaCiudad: row.distancia || '',
    tamano: row.tamano,
    modelo: row.modelo || '',
    topografia: row.topografia,
    paisaje: row.paisaje || [],
    cuerpoAgua: (row.aguas && row.aguas[0]) || '',
    vistas: row.vistas,
    vegetacion: row.entorno || '',
    accesoTipo: row.acceso || '',
    accesoDisp: row.estacionalidad || '',
    aeropuerto: row.aeropuerto,
    servicios: row.servicios || [],
    construcciones: row.construcciones,
    archivado: row.archivado || false,
    estado: row.estado || 'Nuevo',
    comentarios: row.comentarios || '',
    notas: row.notas || [],
    fotos: row.fotos || [],
    legal: {
      titulo: row.titulo || '',
      usoSuelo: row.uso_suelo || '',
      restricciones: row.legal_notas || '',
      observaciones: ''
    },
    turismo: {
      actividades: row.actividades || [],
      atractivos: row.atractivos || '',
      demanda: row.demanda || ''
    },
    participacion: {
      modelo: row.modelo || '',
      inversion: row.inversion || '',
      horizonte: row.horizonte || ''
    }
  };
}

// Mapear estructura de la UI a estructura de tabla plana para insertar/actualizar en DB
function mapToDb(payload: Partial<Postulacion>): any {
  const out: any = {};

  if (payload.id) out.id = payload.id;
  if (payload.nombre) out.nombre = payload.nombre;
  if (payload.apellido) out.apellido = payload.apellido;
  if (payload.email) out.email = payload.email;
  if (payload.telefono) out.telefono = payload.telefono;
  if (payload.relacion) out.relacion = payload.relacion;
  if (payload.provincia) out.provincia = payload.provincia;
  if (payload.localidad) out.localidad = payload.localidad;
  if (payload.tamano) out.tamano = payload.tamano;
  if (payload.topografia) out.topografia = payload.topografia;
  if (payload.paisaje) out.paisaje = payload.paisaje;
  if (payload.vistas) out.vistas = payload.vistas;
  if (payload.aeropuerto) out.aeropuerto = payload.aeropuerto;
  if (payload.servicios) out.servicios = payload.servicios;
  if (payload.construcciones) out.construcciones = payload.construcciones;
  if (payload.estado) out.estado = payload.estado;
  if (payload.archivado !== undefined) out.archivado = payload.archivado;
  if (payload.comentarios) out.comentarios = payload.comentarios;
  const pAny: any = payload;
  if (pAny.notes) out.notas = pAny.notes; // compatibility
  if (payload.notas) out.notas = payload.notas;
  if (payload.fotos) out.fotos = payload.fotos;
  if (pAny.coords) out.coords = pAny.coords;
  if (pAny.mapsLink) out.coords = pAny.mapsLink;
  if (pAny.distancia) out.distancia = pAny.distancia;
  if (pAny.distanciaCiudad) out.distancia = pAny.distanciaCiudad;

  if (pAny.aguas) out.aguas = pAny.aguas;
  if (pAny.cuerpoAgua) out.aguas = [pAny.cuerpoAgua];

  if (pAny.entorno) out.entorno = pAny.entorno;
  if (pAny.vegetacion) out.entorno = pAny.vegetacion;

  if (pAny.acceso) out.acceso = pAny.acceso;
  if (pAny.accesoTipo) out.acceso = pAny.accesoTipo;

  if (pAny.estacionalidad) out.estacionalidad = pAny.estacionalidad;
  if (pAny.accesoDisp) out.estacionalidad = pAny.accesoDisp;

  if (payload.legal) {
    out.titulo = payload.legal.titulo;
    out.uso_suelo = payload.legal.usoSuelo;
    out.legal_notes = payload.legal.restricciones || payload.legal.observaciones; // compatibility
    out.legal_notas = payload.legal.restricciones || payload.legal.observaciones;
  } else {
    if (pAny.titulo) out.titulo = pAny.titulo;
    if (pAny.usoSuelo) out.uso_suelo = pAny.usoSuelo;
    if (pAny.legalNotes) out.legal_notas = pAny.legalNotes;
    if (pAny.legalNotas) out.legal_notas = pAny.legalNotas;
  }

  if (payload.turismo) {
    out.actividades = payload.turismo.actividades;
    out.atractivos = payload.turismo.atractivos;
    out.demanda = payload.turismo.demanda;
  } else {
    if (pAny.actividades) out.actividades = pAny.actividades;
    if (pAny.atractivos) out.atractivos = pAny.atractivos;
    if (pAny.demanda) out.demanda = pAny.demanda;
  }

  if (payload.participacion) {
    out.modelo = payload.participacion.modelo;
    out.inversion = payload.participacion.inversion;
    out.horizonte = payload.participacion.horizonte;
  } else {
    if (pAny.modelo) out.modelo = pAny.modelo;
    if (pAny.inversion) out.inversion = pAny.inversion;
    if (pAny.horizonte) out.horizonte = pAny.horizonte;
  }

  return out;
}

export const PostulacionesRepository = {
  async getAll(): Promise<Postulacion[]> {
    if (USE_SUPABASE) {
      const { data, error } = await getSupabase().from('postulaciones').select('*').order('fecha', { ascending: false });
      if (error) throw error;
      const mapped = (data || []).map(mapFromDb);
      BO.write('postulaciones', mapped);
      return mapped;
    }
    return BO.all('postulaciones') as Postulacion[];
  },

  async getById(id: string): Promise<Postulacion | null> {
    if (USE_SUPABASE) {
      const { data, error } = await getSupabase().from('postulaciones').select('*').eq('id', id).single();
      if (error) throw error;
      return data ? mapFromDb(data) : null;
    }
    return BO.get('postulaciones', id) as Postulacion | null;
  },

  async create(payload: Partial<Postulacion>): Promise<Postulacion> {
    if (USE_SUPABASE) {
      const dbPayload = mapToDb(payload);
      const { data, error } = await getSupabase().from('postulaciones').insert([dbPayload]).select().single();
      if (error) throw error;
      const created = mapFromDb(data);
      const current = BO.all('postulaciones');
      BO.write('postulaciones', [created, ...current]);
      return created;
    }
    return BO.insert('postulaciones', payload) as Postulacion;
  },

  async update(id: string, patch: Partial<Postulacion>): Promise<Postulacion> {
    if (USE_SUPABASE) {
      const dbPatch = mapToDb(patch);
      const { data, error } = await getSupabase().from('postulaciones').update(dbPatch).eq('id', id).select().single();
      if (error) throw error;
      const updated = mapFromDb(data);
      const current = BO.all('postulaciones').map((r: any) => r.id === id ? updated : r);
      BO.write('postulaciones', current);
      return updated;
    }
    return BO.update('postulaciones', id, patch) as Postulacion;
  },

  async delete(id: string): Promise<boolean> {
    if (USE_SUPABASE) {
      const { error } = await getSupabase().from('postulaciones').delete().eq('id', id);
      if (error) throw error;
      const current = BO.all('postulaciones').filter((r: any) => r.id !== id);
      BO.write('postulaciones', current);
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
