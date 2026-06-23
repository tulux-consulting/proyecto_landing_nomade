import { MemoryDb } from '../memory-db';
import { Partner } from './partner.types';

export const MemoryPartnersRepository = {
  async getAll(): Promise<Partner[]> {
    return MemoryDb.all('partners') as Partner[];
  },

  async getById(id: string): Promise<Partner | null> {
    return MemoryDb.get('partners', id) as Partner | null;
  },

  async create(payload: Partial<Partner>): Promise<Partner> {
    const defaultFields: Partial<Partner> = {
      nombre: '',
      tipo: 'Otro',
      fiscal: '',
      provincia: '',
      localidad: '',
      telefono: '',
      email: '',
      web: '',
      capacidad: '',
      anosOperando: 0,
      estado: 'Nuevo',
      archivado: false,
      descripcion: '',
      notas: []
    };
    return MemoryDb.insert('partners', { ...defaultFields, ...payload }) as Partner;
  },

  async update(id: string, patch: Partial<Partner>): Promise<Partner> {
    return MemoryDb.update('partners', id, patch) as Partner;
  },

  async delete(id: string): Promise<boolean> {
    MemoryDb.remove('partners', id);
    return true;
  },

  async addNote(id: string, text: string, author: string = 'admin'): Promise<Partner> {
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
