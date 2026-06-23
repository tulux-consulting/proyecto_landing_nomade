import { resolveRepository } from '../factory';
import { SupabaseHuespedesRepository } from './supabase-huespedes.repository';
import { MemoryHuespedesRepository } from './memory-huespedes.repository';
import { Huesped } from './huesped.types';

export interface IHuespedesRepository {
  getAll(): Promise<Huesped[]>;
  create(payload: Partial<Huesped>): Promise<Huesped>;
  update(id: string, patch: Partial<Huesped>): Promise<Huesped>;
  delete(id: string): Promise<boolean>;
}

export const HuespedesRepository: IHuespedesRepository = resolveRepository<IHuespedesRepository>(
  SupabaseHuespedesRepository,
  MemoryHuespedesRepository
);
