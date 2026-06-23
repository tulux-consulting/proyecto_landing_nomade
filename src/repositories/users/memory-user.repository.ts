import { MemoryDb } from '../memory-db';
import { UserProfile } from './user.types';

export const MemoryUserRepository = {
  async getAll(): Promise<UserProfile[]> {
    const raw = MemoryDb.all('usuarios');
    return raw.map((u: any) => ({
      id: u.id,
      full_name: u.full_name || u.nombre || '',
      username: u.username || (u.nombre ? u.nombre.toLowerCase().replace(/\s+/g, '.') : ''),
      email: u.email || '',
      role: u.role || 'user',
      is_active: u.is_active !== undefined ? u.is_active : (u.activo !== undefined ? u.activo : true),
      created_at: u.created_at || u.fecha,
      updated_at: u.updated_at
    }));
  },

  async getById(id: string): Promise<UserProfile | null> {
    const users = await this.getAll();
    return users.find(u => u.id === id) || null;
  },

  async create(user: Omit<UserProfile, 'id'> & { password?: string }): Promise<UserProfile> {
    const defaultFields = {
      nombre: user.full_name || '',
      full_name: user.full_name || '',
      username: user.username || '',
      email: user.email || '',
      role: user.role || 'user',
      activo: user.is_active !== undefined ? user.is_active : true,
      is_active: user.is_active !== undefined ? user.is_active : true
    };
    const created = MemoryDb.insert('usuarios', defaultFields);
    return {
      id: created.id,
      full_name: created.full_name || created.nombre || '',
      username: created.username || '',
      email: created.email || '',
      role: created.role || 'user',
      is_active: created.is_active !== undefined ? created.is_active : created.activo,
      created_at: created.created_at || created.fecha,
      updated_at: created.updated_at
    };
  },

  async update(id: string, patch: Partial<Omit<UserProfile, 'id'>>): Promise<UserProfile> {
    const current = MemoryDb.get('usuarios', id);
    if (!current) throw new Error('User not found');

    const mappedPatch: any = { ...patch };
    if (patch.full_name !== undefined) {
      mappedPatch.nombre = patch.full_name;
    }
    if (patch.is_active !== undefined) {
      mappedPatch.activo = patch.is_active;
    }

    const updated = MemoryDb.update('usuarios', id, mappedPatch);
    return {
      id: updated.id,
      full_name: updated.full_name || updated.nombre || '',
      username: updated.username || '',
      email: updated.email || '',
      role: updated.role || 'user',
      is_active: updated.is_active !== undefined ? updated.is_active : updated.activo,
      created_at: updated.created_at || updated.fecha,
      updated_at: updated.updated_at
    };
  },

  async toggleActive(id: string, isActive: boolean): Promise<UserProfile> {
    return this.update(id, { is_active: isActive });
  },

  async delete(id: string): Promise<void> {
    MemoryDb.remove('usuarios', id);
  }
};
