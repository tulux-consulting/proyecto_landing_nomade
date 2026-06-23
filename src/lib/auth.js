import { createClient } from './supabase/client';

export function panelIsAuthed() {
  if (typeof window === 'undefined') return false;
  try {
    if (process.env.NEXT_PUBLIC_DATA_SOURCE === 'memory') {
      return localStorage.getItem('nomade_mock_auth') === 'true';
    }
    const keys = Object.keys(localStorage);
    return keys.some(key => key.startsWith('sb-') && key.endsWith('-auth-token'));
  } catch (e) {
    return false;
  }
}

export async function panelLogin(emailOrUsername, password) {
  if (typeof window === 'undefined') return false;
  try {
    let email = emailOrUsername.trim();

    if (process.env.NEXT_PUBLIC_DATA_SOURCE === 'memory') {
      const normalized = email.toLowerCase();
      const MEMORY_USERS = [
        { id: "usr_admin", email: "admin@nomade.com", username: "admin", password: "admin", nombre: "Administrador", role: "admin", is_active: true },
        { id: "usr_valeria", email: "valeria@nomade.com", username: "valeria.cano", password: "valeria", nombre: "Valeria Cano", role: "operations", is_active: true },
        { id: "usr_martin", email: "martin@nomade.com", username: "martin.reyes", password: "martin", nombre: "Martín Reyes", role: "marketing", is_active: true },
        { id: "usr_paula", email: "paula@nomade.com", username: "paula.gimenez", password: "paula", nombre: "Paula Giménez", role: "sales", is_active: false }
      ];
      
      const user = MEMORY_USERS.find(
        (u) => u.email === normalized || u.username === normalized
      );
      
      if (user && user.password === password) {
        localStorage.setItem('nomade_mock_auth', 'true');
        localStorage.setItem('nomade_bo_activeUser', user.id);
        
        const isAdmin = user.role === 'admin';
        const mockUser = {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          role: user.role,
          is_active: user.is_active,
          permisos: isAdmin
            ? ['dashboard', 'postulaciones', 'partners', 'huespedes', 'destinos', 'contenido', 'ajustes']
            : ['dashboard', 'postulaciones', 'partners', 'huespedes', 'destinos', 'contenido'],
          rolNombre: isAdmin ? 'Administrador' : 'Usuario'
        };
        localStorage.setItem('nomade_bo_sessionUser', JSON.stringify(mockUser));
        return true;
      }
      return false;
    }

    const supabase = createClient();
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
    let email = emailOrUsername.trim();

    if (process.env.NEXT_PUBLIC_DATA_SOURCE === 'memory') {
      return { success: true, email: email.includes('@') ? email : `${email}@nomade.com` };
    }

    const supabase = createClient();
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
  if (process.env.NEXT_PUBLIC_DATA_SOURCE === 'memory') {
    localStorage.removeItem('nomade_mock_auth');
    localStorage.removeItem('nomade_bo_activeUser');
    localStorage.removeItem('nomade_bo_sessionUser');
    return;
  }
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
