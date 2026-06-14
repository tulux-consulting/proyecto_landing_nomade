-- ============================================================
-- NÓMADE — Esquema de Base de Datos y Políticas de Seguridad
-- ============================================================

-- 1. Tabla de Perfiles (Manejada en la entrega anterior)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user' check (role in ('admin', 'editor', 'user')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- 2. Políticas RLS para profiles
drop policy if exists "Cualquier usuario autenticado puede leer perfiles" on public.profiles;
drop policy if exists "Solo administradores pueden actualizar perfiles" on public.profiles;

create policy "Cualquier usuario autenticado puede leer perfiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Solo administradores pueden actualizar perfiles"
  on public.profiles for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 3. Funciones auxiliares para obtener el rol y verificar administrador
create or replace function public.get_my_role()
returns text as $$
declare
  user_role text;
begin
  select role into user_role from public.profiles where id = auth.uid();
  return coalesce(user_role, 'user');
end;
$$ language plpgsql security definer;

create or replace function public.is_admin()
returns boolean as $$
begin
  return public.get_my_role() = 'admin';
end;
$$ language plpgsql security definer;


-- 4. Tabla de Postulaciones (applications)
create table if not exists public.postulaciones (
  id uuid default gen_random_uuid() primary key,
  fecha timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Datos Personales
  nombre text not null,
  apellido text not null,
  email text not null,
  telefono text not null,
  relacion text,

  -- Ubicación
  provincia text not null,
  localidad text not null,
  coords text,
  distancia text,

  -- Características del Terreno
  tamano text not null,
  topografia text,
  paisaje text[] default '{}',
  aguas text[] default '{}',
  vistas text,
  entorno text,
  acceso text,
  estacionalidad text,
  aeropuerto text,

  -- Servicios
  servicios text[] default '{}',
  construcciones text,

  -- Legales
  titulo text,
  uso_suelo text,
  legal_notas text,

  -- Turismo
  actividades text[] default '{}',
  atractivos text,
  demanda text,

  -- Modelo e inversión
  modelo text not null,
  inversion text,
  horizonte text,

  -- Administración y Auditoría
  estado text not null default 'Nuevo' check (estado in ('Nuevo', 'Pendiente de revisión', 'Contactado', 'En negociación', 'Aprobado', 'Rechazado')),
  archivado boolean not null default false,
  comentarios text,
  notas jsonb default '[]'::jsonb,
  fotos text[] default '{}',
  documentos jsonb default '[]'::jsonb,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null
);

-- Habilitar RLS en postulaciones
alter table public.postulaciones enable row level security;

-- 5. Políticas RLS para la tabla de postulaciones
drop policy if exists "Administradores tienen control total" on public.postulaciones;
drop policy if exists "Visitantes públicos pueden insertar postulaciones" on public.postulaciones;

create policy "Administradores tienen control total"
  on public.postulaciones for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Visitantes públicos pueden insertar postulaciones"
  on public.postulaciones for insert
  to anon
  with check (true);

-- 6. Limitar privilegios de inserción para usuarios anónimos (Seguridad de columnas)
revoke all on public.postulaciones from anon;
grant insert (
  nombre, apellido, email, telefono, relacion, provincia, localidad, coords, distancia,
  tamano, topografia, paisaje, aguas, vistas, entorno, acceso, estacionalidad, aeropuerto,
  servicios, construcciones, titulo, uso_suelo, legal_notas, actividades, atractivos, demanda,
  modelo, inversion, horizonte, comentarios, fotos
) on public.postulaciones to anon;

grant all on public.postulaciones to authenticated;


-- 7. Configuración de Supabase Storage para Fotos de Postulaciones
create extension if not exists pgcrypto;

insert into storage.buckets (id, name, public)
values ('postulaciones', 'postulaciones', true)
on conflict (id) do nothing;

-- Políticas de RLS en Storage para el bucket de postulaciones
drop policy if exists "Cualquier persona puede subir fotos" on storage.objects;
drop policy if exists "Cualquier persona puede ver fotos" on storage.objects;
drop policy if exists "Administradores pueden gestionar fotos" on storage.objects;

create policy "Cualquier persona puede subir fotos"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'postulaciones');

create policy "Cualquier persona puede ver fotos"
  on storage.objects for select
  to public
  using (bucket_id = 'postulaciones');

create policy "Administradores pueden gestionar fotos"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'postulaciones' 
    and exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );



