import { createClient } from './supabase/client';

export function panelIsAuthed() {
  if (typeof window === 'undefined') return false;
  try {
    const keys = Object.keys(localStorage);
    return keys.some(key => key.startsWith('sb-') && key.endsWith('-auth-token'));
  } catch (e) {
    return false;
  }
}

export async function panelLogin(email, password) {
  if (typeof window === 'undefined') return false;
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Error de autenticación:', error.message);
      return false;
    }
    
    return true;
  } catch (e) {
    console.error('Error de conexión:', e);
    return false;
  }
}

export async function clearPanelSession() {
  if (typeof window === 'undefined') return;
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch (e) {
    console.error('Error al cerrar sesión:', e);
  }
}
