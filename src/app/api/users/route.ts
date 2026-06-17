import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '../../../lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client using Service Role Key
const getAdminClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceKey) {
    throw new Error('Supabase URL or Service Role Key is missing in environment variables.');
  }
  
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

// Helper to check if requester is an active admin user
async function authorizeRequest() {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) return false;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_active, role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || !profile.is_active || profile.role !== 'admin') {
      return false;
    }

    return true;
  } catch (e) {
    console.error('Authorization check failed:', e);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const authorized = await authorizeRequest();
    if (!authorized) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { full_name, username, email, password, role, is_active } = await request.json();

    if (!full_name || !username || !email || !password || !role) {
      return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 });
    }

    if (role !== 'admin' && role !== 'user') {
      return NextResponse.json({ error: 'Rol inválido' }, { status: 400 });
    }

    const adminClient = getAdminClient();

    // 1. Create user in Supabase Auth (auto-confirmed)
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError || !authData.user) {
      console.error('Supabase Auth user creation error:', authError);
      return NextResponse.json({ error: authError?.message || 'Error al crear credenciales de autenticación' }, { status: 400 });
    }

    // 2. Create the profile in the public profiles table
    const { data: profileData, error: profileError } = await adminClient
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name,
        username,
        email,
        role,
        is_active: is_active ?? true
      })
      .select()
      .single();

    if (profileError) {
      console.error('Supabase Profile creation error (rolling back auth user):', profileError);
      
      // Rollback Auth user creation if profile insert fails to maintain transactional consistency
      await adminClient.auth.admin.deleteUser(authData.user.id);
      
      return NextResponse.json({ error: profileError.message || 'Error al crear perfil de usuario' }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: profileData });
  } catch (e: any) {
    console.error('Error in user creation POST handler:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authorized = await authorizeRequest();
    if (!authorized) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'ID de usuario no proporcionado' }, { status: 400 });
    }

    const adminClient = getAdminClient();

    // Delete user from Supabase Auth (cascades delete to profiles table in schema)
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Supabase Auth user deletion error:', deleteError);
      return NextResponse.json({ error: deleteError.message || 'Error al eliminar usuario de auth' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Error in user deletion DELETE handler:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}
