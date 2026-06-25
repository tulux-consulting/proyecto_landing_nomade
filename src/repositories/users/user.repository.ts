import { BO } from '../../lib/store.js';
import { createClient } from '../../lib/supabase/client';
import { UserProfile } from './user.types';

const USE_SUPABASE = process.env.NEXT_PUBLIC_DATA_SOURCE === 'supabase';
const getSupabase = () => createClient();

export const UserRepository = {
  async getAll(): Promise<UserProfile[]> {
    if (USE_SUPABASE) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      BO.write('usuarios', data || []);
      return data || [];
    } else {
      // Local storage fallback, mapping old format to new
      const raw = BO.all('usuarios');
      return raw.map((u: any) => ({
        id: u.id,
        full_name: u.nombre || u.full_name || '',
        username: u.username || (u.nombre ? u.nombre.toLowerCase().replace(/\s+/g, '.') : ''),
        email: u.email || '',
        role: u.role || 'user',
        is_active: u.activo !== undefined ? u.activo : (u.is_active !== undefined ? u.is_active : true),
        preferred_language: u.preferred_language || 'es',
        created_at: u.fecha || u.created_at,
        updated_at: u.updated_at
      }));
    }
  },

  async getById(id: string): Promise<UserProfile | null> {
    if (USE_SUPABASE) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error(`Error fetching user ${id}:`, error);
        throw error;
      }
      return data;
    } else {
      const users = await this.getAll();
      return users.find(u => u.id === id) || null;
    }
  },

  async create(user: Omit<UserProfile, 'id'> & { password?: string }): Promise<UserProfile> {
    if (USE_SUPABASE) {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Error al crear el usuario');
      }

      const data = await response.json();
      return data.user;
    } else {
      // Local storage
      const newId = BO.uid('usr');
      const newUser: UserProfile = {
        id: newId,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        preferred_language: user.preferred_language || 'es',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Update local storage representation (keeping structure aligned)
      BO.insert('usuarios', {
        id: newId,
        nombre: user.full_name,
        email: user.email,
        username: user.username,
        role: user.role,
        activo: user.is_active,
        preferred_language: user.preferred_language || 'es',
        fecha: new Date().toISOString()
      });

      return newUser;
    }
  },

  async update(id: string, patch: Partial<Omit<UserProfile, 'id'>>): Promise<UserProfile> {
    if (USE_SUPABASE) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...patch,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating user ${id}:`, error);
        throw error;
      }
      return data;
    } else {
      const users = BO.all('usuarios');
      const rawUser = users.find((u: any) => u.id === id);
      if (!rawUser) throw new Error('Usuario no encontrado');

      const updatedRaw = {
        ...rawUser,
        nombre: patch.full_name !== undefined ? patch.full_name : rawUser.nombre,
        email: patch.email !== undefined ? patch.email : rawUser.email,
        username: patch.username !== undefined ? patch.username : rawUser.username,
        role: patch.role !== undefined ? patch.role : rawUser.role,
        activo: patch.is_active !== undefined ? patch.is_active : rawUser.activo,
        preferred_language: patch.preferred_language !== undefined ? patch.preferred_language : rawUser.preferred_language
      };

      BO.update('usuarios', id, updatedRaw);

      return {
        id,
        full_name: updatedRaw.nombre,
        email: updatedRaw.email,
        username: updatedRaw.username || '',
        role: updatedRaw.role || 'user',
        is_active: updatedRaw.activo,
        preferred_language: updatedRaw.preferred_language || 'es',
        created_at: updatedRaw.fecha,
        updated_at: new Date().toISOString()
      };
    }
  },

  async toggleActive(id: string, isActive: boolean): Promise<UserProfile> {
    return this.update(id, { is_active: isActive });
  },

  async delete(id: string): Promise<void> {
    if (USE_SUPABASE) {
      // Deactivate instead of hard deleting to prevent auth cascading unless requested,
      // or call route handler to delete user from Supabase Auth.
      // The requirement says: "Eliminar usuario: Perderá el acceso al panel."
      // Since it refers to "deleting" in UI, we can call a DELETE on /api/users to clean up both auth and profile,
      // or simply deactivate it. Let's support deletion via API route if Supabase, or from localStorage.
      const response = await fetch(`/api/users?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Error al eliminar el usuario');
      }
    } else {
      BO.remove('usuarios', id);
    }
  }
};
