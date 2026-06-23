import { resolveRepository } from '../factory';
import { SupabaseContenidoRepository } from './supabase-contenido.repository';
import { MemoryContenidoRepository } from './memory-contenido.repository';
import { LandingContent } from './contenido.types';

export interface IContenidoRepository {
  getDraft(): Promise<LandingContent>;
  getPublished(): Promise<LandingContent>;
  updateDraft(documento: LandingContent): Promise<LandingContent>;
  publish(documento: LandingContent): Promise<LandingContent>;
  get(): Promise<LandingContent>;
  update(documento: LandingContent): Promise<LandingContent>;
}

export const ContenidoRepository: IContenidoRepository = resolveRepository<IContenidoRepository>(
  SupabaseContenidoRepository,
  MemoryContenidoRepository
);
