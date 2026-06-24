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

export async function panelLogin(emailOrUsername, password) {
  if (typeof window === 'undefined') return false;
  try {
    const supabase = createClient();
    let email = emailOrUsername.trim();

    // Check if input is a username instead of email
    if (!email.includes('@')) {
      const { data: resolvedEmail, error: rpcError } = await supabase.rpc('get_email_by_username', { p_username: email });
      if (rpcError || !resolvedEmail) {
        console.error('No se pudo resolver el username:', rpcError?.message || 'Usuario no encontrado o inactivo.');
        return false;
      }
      email = resolvedEmail;
    }

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

export async function panelResetPassword(emailOrUsername) {
  if (typeof window === 'undefined') return { success: false, error: 'Acción no permitida' };
  try {
    const supabase = createClient();
    let email = emailOrUsername.trim();

    if (!email.includes('@')) {
      const { data: resolvedEmail, error: rpcError } = await supabase.rpc('get_email_by_username', { p_username: email });
      if (rpcError || !resolvedEmail) {
        return { success: false, error: 'Usuario no encontrado o inactivo.' };
      }
      email = resolvedEmail;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/panel/reset-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, email };
  } catch (e) {
    console.error('Error al solicitar restablecimiento:', e);
    return { success: false, error: 'Error de conexión.' };
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

export async function updatePassword(newPassword) {
  if (typeof window === 'undefined') return false;
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
  return true;
}
