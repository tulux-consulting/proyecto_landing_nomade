import { MemoryDb } from '../memory-db';
import { Destino } from './destination.types';

export const MemoryDestinosRepository = {
  async getAll(): Promise<Destino[]> {
    return MemoryDb.all('destinos') as Destino[];
  },

  async getPublished(): Promise<Destino[]> {
    return (MemoryDb.all('destinos') as Destino[]).filter(
      d => d.estado === 'Disponible' && !d.archivado
    );
  },

  async getById(id: string): Promise<Destino | null> {
    return MemoryDb.get('destinos', id) as Destino | null;
  },

  async create(payload: Partial<Destino>): Promise<Destino> {
    const defaultFields: Partial<Destino> = {
      nombre: '',
      complejo: '',
      ubicacion: '',
      estado: 'No disponible',
      descripcion: '',
      imagen: '',
      fotos: [],
      reserva: '',
      archivado: false
    };
    return MemoryDb.insert('destinos', { ...defaultFields, ...payload }) as Destino;
  },

  async update(id: string, patch: Partial<Destino>): Promise<Destino> {
    return MemoryDb.update('destinos', id, patch) as Destino;
  },

  async delete(id: string): Promise<boolean> {
    MemoryDb.remove('destinos', id);
    return true;
  }
};
