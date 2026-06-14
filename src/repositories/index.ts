import { BO } from '../lib/store.js';
import { NOMADE } from '../data/content.js';
import { Postulacion, Partner, Destino, Huesped, LandingContent } from '../types/index';
import { createClient } from '../lib/supabase/client';

// ============================================================================
// NÓMADE — Capa de Repositorios (Repository Pattern in TypeScript)
// ============================================================================

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
  if (payload.notas) out.notas = payload.notas;
  if (payload.fotos) out.fotos = payload.fotos;

  const pAny: any = payload;
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
    out.legal_notas = payload.legal.restricciones || payload.legal.observaciones;
  } else {
    if (pAny.titulo) out.titulo = pAny.titulo;
    if (pAny.usoSuelo) out.uso_suelo = pAny.usoSuelo;
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

export const PartnersRepository = {
  async getAll(): Promise<Partner[]> {
    if (USE_SUPABASE) {
      const { data, error } = await getSupabase().from('partners').select('*').order('fecha', { ascending: false });
      if (error) throw error;
      return data as Partner[];
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
      return data as Partner;
    }
    return BO.insert('partners', payload) as Partner;
  },

  async update(id: string, patch: Partial<Partner>): Promise<Partner> {
    if (USE_SUPABASE) {
      const { data, error } = await getSupabase().from('partners').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return data as Partner;
    }
    return BO.update('partners', id, patch) as Partner;
  },

  async delete(id: string): Promise<boolean> {
    if (USE_SUPABASE) {
      const { error } = await getSupabase().from('partners').delete().eq('id', id);
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
      const { data, error } = await getSupabase().from('destinos').select('*').order('fecha', { ascending: false });
      if (error) throw error;
      return data as Destino[];
    }
    return BO.all('destinos') as Destino[];
  },

  async getById(id: string): Promise<Destino | null> {
    if (USE_SUPABASE) {
      const { data, error } = await getSupabase().from('destinos').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Destino;
    }
    return BO.get('destinos', id) as Destino | null;
  },

  async create(payload: Partial<Destino>): Promise<Destino> {
    if (USE_SUPABASE) {
      const { data, error } = await getSupabase().from('destinos').insert([payload]).select().single();
      if (error) throw error;
      return data as Destino;
    }
    return BO.insert('destinos', payload) as Destino;
  },

  async update(id: string, patch: Partial<Destino>): Promise<Destino> {
    if (USE_SUPABASE) {
      const { data, error } = await getSupabase().from('destinos').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return data as Destino;
    }
    return BO.update('destinos', id, patch) as Destino;
  },

  async delete(id: string): Promise<boolean> {
    if (USE_SUPABASE) {
      const { error } = await getSupabase().from('destinos').delete().eq('id', id);
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
      const { data, error } = await getSupabase().from('huespedes').select('*').order('fecha', { ascending: false });
      if (error) throw error;
      return data as Huesped[];
    }
    return BO.all('huespedes') as Huesped[];
  },

  async create(payload: Partial<Huesped>): Promise<Huesped> {
    if (USE_SUPABASE) {
      const { data, error } = await getSupabase().from('huespedes').insert([payload]).select().single();
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
      const { data, error } = await getSupabase().from('contenido').select('documento').eq('id', 'landing').single();
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
      const { data, error } = await getSupabase().from('contenido').upsert({ id: 'landing', documento }).select().single();
      if (error) throw error;
      return data.documento as LandingContent;
    }
    BO.setDoc('contenido', documento);
    return documento;
  }
};
