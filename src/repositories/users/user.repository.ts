import { resolveRepository } from '../factory';
import { SupabaseUserRepository } from './supabase-user.repository';
import { MemoryUserRepository } from './memory-user.repository';
import { UserProfile } from './user.types';

export interface IUserRepository {
  getAll(): Promise<UserProfile[]>;
  getById(id: string): Promise<UserProfile | null>;
  create(user: Omit<UserProfile, 'id'> & { password?: string }): Promise<UserProfile>;
  update(id: string, patch: Partial<Omit<UserProfile, 'id'>>): Promise<UserProfile>;
  toggleActive(id: string, isActive: boolean): Promise<UserProfile>;
  delete(id: string): Promise<void>;
}

export const UserRepository: IUserRepository = resolveRepository<IUserRepository>(
  SupabaseUserRepository,
  MemoryUserRepository
);
