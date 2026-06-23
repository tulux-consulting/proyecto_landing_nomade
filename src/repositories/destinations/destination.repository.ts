import { resolveRepository } from '../factory';
import { SupabaseDestinosRepository } from './supabase-destination.repository';
import { MemoryDestinosRepository } from './memory-destination.repository';
import { Destino } from './destination.types';

export interface IDestinosRepository {
  getAll(): Promise<Destino[]>;
  getPublished(): Promise<Destino[]>;
  getById(id: string): Promise<Destino | null>;
  create(payload: Partial<Destino>): Promise<Destino>;
  update(id: string, patch: Partial<Destino>): Promise<Destino>;
  delete(id: string): Promise<boolean>;
}

export const DestinosRepository: IDestinosRepository = resolveRepository<IDestinosRepository>(
  SupabaseDestinosRepository,
  MemoryDestinosRepository
);
