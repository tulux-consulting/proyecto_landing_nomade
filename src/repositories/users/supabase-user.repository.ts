import { BO } from '../../lib/store.js';
import { createClient } from '../../lib/supabase/client';
import { UserProfile } from './user.types';

const getSupabase = () => createClient();

export const SupabaseUserRepository = {
  async getAll(): Promise<UserProfile[]> {
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
  },

  async getById(id: string): Promise<UserProfile | null> {
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
  },

  async create(user: Omit<UserProfile, 'id'> & { password?: string }): Promise<UserProfile> {
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
  },

  async update(id: string, patch: Partial<Omit<UserProfile, 'id'>>): Promise<UserProfile> {
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
  },

  async toggleActive(id: string, isActive: boolean): Promise<UserProfile> {
    return this.update(id, { is_active: isActive });
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`/api/users?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Error al eliminar el usuario');
    }
  }
};
