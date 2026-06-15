import { BO } from '../../lib/store.js';
import { Destino } from '../../types/index';

export const DestinosRepository = {
  async getAll(): Promise<Destino[]> {
    return BO.all('destinos') as Destino[];
  },

  async getById(id: string): Promise<Destino | null> {
    return BO.get('destinos', id) as Destino | null;
  },

  async create(payload: Partial<Destino>): Promise<Destino> {
    return BO.insert('destinos', payload) as Destino;
  },

  async update(id: string, patch: Partial<Destino>): Promise<Destino> {
    return BO.update('destinos', id, patch) as Destino;
  },

  async delete(id: string): Promise<boolean> {
    BO.remove('destinos', id);
    return true;
  }
};
