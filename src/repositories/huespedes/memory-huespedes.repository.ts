import { MemoryDb } from '../memory-db';
import { Huesped } from './huesped.types';

export const MemoryHuespedesRepository = {
  async getAll(): Promise<Huesped[]> {
    return MemoryDb.all('huespedes') as Huesped[];
  },

  async create(payload: Partial<Huesped>): Promise<Huesped> {
    const defaultFields: Partial<Huesped> = {
      email: '',
      pais: '',
      provincia: '',
      ciudad: '',
      dispositivo: 'Escritorio',
      so: '',
      navegador: '',
      estado: 'Nuevo',
      admin_notes: ''
    };
    return MemoryDb.insert('huespedes', { ...defaultFields, ...payload }) as Huesped;
  },

  async update(id: string, patch: Partial<Huesped>): Promise<Huesped> {
    return MemoryDb.update('huespedes', id, patch) as Huesped;
  },

  async delete(id: string): Promise<boolean> {
    MemoryDb.remove('huespedes', id);
    return true;
  }
};
