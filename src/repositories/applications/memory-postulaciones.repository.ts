import { MemoryDb } from '../memory-db';
import { Postulacion } from './application.types';

export const MemoryPostulacionesRepository = {
  async getAll(): Promise<Postulacion[]> {
    return MemoryDb.all('postulaciones') as Postulacion[];
  },

  async getById(id: string): Promise<Postulacion | null> {
    return MemoryDb.get('postulaciones', id) as Postulacion | null;
  },

  async create(payload: Partial<Postulacion>): Promise<Postulacion> {
    const defaultFields: Partial<Postulacion> = {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      relacion: '',
      provincia: '',
      localidad: '',
      mapsLink: '',
      distanciaCiudad: '',
      tamano: '',
      modelo: '',
      topografia: '',
      paisaje: [],
      cuerpoAgua: '',
      vistas: '',
      vegetacion: '',
      accesoTipo: '',
      accesoDisp: '',
      aeropuerto: '',
      servicios: [],
      construcciones: '',
      archivado: false,
      estado: 'Nuevo',
      comentarios: '',
      notas: [],
      fotos: [],
      legal: { titulo: '', usoSuelo: '', restricciones: '', observaciones: '' },
      turismo: { actividades: [], atractivos: '', demanda: '' },
      participacion: { modelo: '', inversion: '', horizonte: '' }
    };
    
    // Deep merge to ensure nested objects are not overridden by empty payloads
    const mergedPayload = {
      ...defaultFields,
      ...payload,
      legal: { ...defaultFields.legal, ...payload.legal },
      turismo: { ...defaultFields.turismo, ...payload.turismo },
      participacion: { ...defaultFields.participacion, ...payload.participacion }
    };

    return MemoryDb.insert('postulaciones', mergedPayload) as Postulacion;
  },

  async update(id: string, patch: Partial<Postulacion>): Promise<Postulacion> {
    // If the patch contains nested objects, merge them.
    const current = MemoryDb.get('postulaciones', id);
    if (!current) throw new Error('Postulacion not found');

    const mergedPatch = {
      ...patch,
      legal: patch.legal ? { ...current.legal, ...patch.legal } : current.legal,
      turismo: patch.turismo ? { ...current.turismo, ...patch.turismo } : current.turismo,
      participacion: patch.participacion ? { ...current.participacion, ...patch.participacion } : current.participacion
    };

    return MemoryDb.update('postulaciones', id, mergedPatch) as Postulacion;
  },

  async delete(id: string): Promise<boolean> {
    MemoryDb.remove('postulaciones', id);
    return true;
  },

  async addNote(id: string, text: string, author: string = 'admin'): Promise<Postulacion> {
    const record = await this.getById(id);
    if (!record) throw new Error('Record not found');
    const newNote = {
      id: 'n_' + Math.random().toString(36).slice(2, 9),
      texto: text,
      autor: author,
      fecha: new Date().toISOString()
    };
    const updatedNotes = [...(record.notas || []), newNote];
    return this.update(id, { notas: updatedNotes });
  }
};
