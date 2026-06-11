import { NextResponse } from 'next/server';

// ============================================================================
// NÓMADE — Route Handler para Autenticación Segura (Server-Side)
// ----------------------------------------------------------------------------
// Valida las credenciales en el servidor utilizando variables de entorno.
// Esto evita la exposición de contraseñas en texto plano en el bundle del cliente.
// ============================================================================

export async function POST(request: Request) {
  try {
    const { user, pass } = await request.json();

    const ADMIN_USER = process.env.ADMIN_USER || "admin";
    const ADMIN_PASS = process.env.ADMIN_PASS || "nomade2026"; // Fallback por defecto

    const ok = user.trim() === ADMIN_USER && pass === ADMIN_PASS;

    if (ok) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Credenciales inválidas' }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
