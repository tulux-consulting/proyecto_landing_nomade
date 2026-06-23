import { resolveRepository } from '../factory';
import { SupabasePartnersRepository } from './supabase-partners.repository';
import { MemoryPartnersRepository } from './memory-partners.repository';
import { Partner } from './partner.types';

export interface IPartnersRepository {
  getAll(): Promise<Partner[]>;
  getById(id: string): Promise<Partner | null>;
  create(payload: Partial<Partner>): Promise<Partner>;
  update(id: string, patch: Partial<Partner>): Promise<Partner>;
  delete(id: string): Promise<boolean>;
  addNote(id: string, text: string, author?: string): Promise<Partner>;
}

export const PartnersRepository: IPartnersRepository = resolveRepository<IPartnersRepository>(
  SupabasePartnersRepository,
  MemoryPartnersRepository
);
