import { resolveRepository } from '../factory';
import { SupabasePostulacionesRepository } from './supabase-postulaciones.repository';
import { MemoryPostulacionesRepository } from './memory-postulaciones.repository';
import { Postulacion } from './application.types';

export interface IPostulacionesRepository {
  getAll(): Promise<Postulacion[]>;
  getById(id: string): Promise<Postulacion | null>;
  create(payload: Partial<Postulacion>): Promise<Postulacion>;
  update(id: string, patch: Partial<Postulacion>): Promise<Postulacion>;
  delete(id: string): Promise<boolean>;
  addNote(id: string, text: string, author?: string): Promise<Postulacion>;
}

export const PostulacionesRepository: IPostulacionesRepository = resolveRepository<IPostulacionesRepository>(
  SupabasePostulacionesRepository,
  MemoryPostulacionesRepository
);
