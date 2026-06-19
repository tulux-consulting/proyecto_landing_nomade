-- ============================================================================
-- AUTHENTICATION & AUTHORIZATION
-- ============================================================================

create extension if not exists citext;

-- profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  username citext not null unique check (username ~ '^[a-zA-Z0-9._-]+$'),
  email text not null,
  role text not null default 'user' check (role in ('admin', 'user')),
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indices
create index if not exists profiles_username_idx on public.profiles (username);

-- RLS Configuration
alter table public.profiles enable row level security;

-- Policies
drop policy if exists "Cualquier usuario autenticado puede leer perfiles" on public.profiles;
drop policy if exists "Solo administradores pueden actualizar perfiles" on public.profiles;
drop policy if exists "Solo administradores pueden gestionar perfiles" on public.profiles;

create policy "Cualquier usuario autenticado puede leer perfiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Solo administradores pueden gestionar perfiles"
  on public.profiles for all
  to authenticated
  using (public.is_admin());

-- Helper Functions
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active = true and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Username to email resolution for login
create or replace function public.get_email_by_username(p_username text)
returns text
security definer
as $$
declare
  v_email text;
begin
  select email into v_email from public.profiles
  where lower(username) = lower(p_username) and is_active = true;
  return v_email;
end;
$$ language plpgsql;

grant execute on function public.get_email_by_username(text) to anon, authenticated;


-- ============================================================================
-- APPLICATIONS (SOLICITUDES / POSTULACIONES)
-- ============================================================================

-- postulaciones table
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

-- RLS Configuration
alter table public.postulaciones enable row level security;

-- Policies
drop policy if exists "Administradores tienen control total" on public.postulaciones;
drop policy if exists "Visitantes públicos pueden insertar postulaciones" on public.postulaciones;

create policy "Usuarios autenticados tienen control total"
  on public.postulaciones for all
  to authenticated
  using (true)
  with check (true);

create policy "Visitantes públicos pueden insertar postulaciones"
  on public.postulaciones for insert
  to anon
  with check (true);

-- Permissions
revoke all on public.postulaciones from anon;
grant insert (
  nombre, apellido, email, telefono, relacion, provincia, localidad, coords, distancia,
  tamano, topografia, paisaje, aguas, vistas, entorno, acceso, estacionalidad, aeropuerto,
  servicios, construcciones, titulo, uso_suelo, legal_notas, actividades, atractivos, demanda,
  modelo, inversion, horizonte, comentarios, fotos
) on public.postulaciones to anon;

grant all on public.postulaciones to authenticated;

-- Storage Configuration & Policies for Postulaciones
create extension if not exists pgcrypto;

insert into storage.buckets (id, name, public)
values ('postulaciones', 'postulaciones', true)
on conflict (id) do nothing;

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

create policy "Usuarios autenticados pueden gestionar fotos"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'postulaciones'
  );


-- ============================================================================
-- PARTNERS
-- ============================================================================

-- partners table
create table if not exists public.partners (
  id uuid default gen_random_uuid() primary key,
  fecha timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Datos del Establecimiento
  nombre text not null,
  razon_social text,
  tipo text not null,
  fiscal text not null,
  provincia text not null,
  localidad text not null,
  telefono text not null,
  email text not null,
  web text,
  capacidad text,
  "anosOperando" integer,
  
  -- Administración y Auditoría
  estado text not null default 'Nuevo' check (estado in ('Nuevo', 'Pendiente de revisión', 'Contactado', 'En negociación', 'Aprobado', 'Rechazado')),
  archivado boolean not null default false,
  descripcion text default '',
  notas jsonb default '[]'::jsonb,
  origen text default 'Formulario web'
);

-- RLS Configuration
alter table public.partners enable row level security;

-- Policies
drop policy if exists "Administradores tienen control total sobre partners" on public.partners;
drop policy if exists "Visitantes públicos pueden insertar partners" on public.partners;

create policy "Usuarios autenticados tienen control total sobre partners"
  on public.partners for all
  to authenticated
  using (true)
  with check (true);

create policy "Visitantes públicos pueden insertar partners"
  on public.partners for insert
  to anon
  with check (true);

-- Permissions
revoke all on public.partners from anon;
grant insert (
  nombre, razon_social, tipo, fiscal, provincia, localidad, telefono, email, web, capacidad,
  "anosOperando", estado, archivado, descripcion, notas, origen
) on public.partners to anon;

grant all on public.partners to authenticated;

-- Indices
create index if not exists partners_estado_archivado_idx on public.partners(estado, archivado);
create index if not exists partners_email_idx on public.partners(email);


-- ============================================================================
-- GUEST WAITLIST (LISTA DE HUÉSPEDES)
-- ============================================================================

-- guest_waitlist table
create table if not exists public.guest_waitlist (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  country text not null default 'Argentina',
  region text not null default 'Buenos Aires',
  city text not null default 'CABA',
  device_type text not null check (device_type in ('Móvil', 'Escritorio', 'Tablet')),
  operating_system text not null,
  browser text not null,
  status text not null default 'Nuevo' check (status in ('Nuevo', 'Contactado', 'Archivado')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  admin_notes text default ''
);

-- RLS Configuration
alter table public.guest_waitlist enable row level security;

-- Policies
drop policy if exists "Administradores tienen control total sobre guest_waitlist" on public.guest_waitlist;
drop policy if exists "Visitantes públicos pueden insertar guest_waitlist" on public.guest_waitlist;

create policy "Usuarios autenticados tienen control total sobre guest_waitlist"
  on public.guest_waitlist for all
  to authenticated
  using (true)
  with check (true);

create policy "Visitantes públicos pueden insertar guest_waitlist"
  on public.guest_waitlist for insert
  to anon
  with check (true);

-- Permissions
revoke all on public.guest_waitlist from anon;
grant insert (
  email, country, region, city, device_type, operating_system, browser, status, admin_notes
) on public.guest_waitlist to anon;

grant all on public.guest_waitlist to authenticated;

-- Indices
create index if not exists guest_waitlist_email_idx on public.guest_waitlist(email);
create index if not exists guest_waitlist_country_region_idx on public.guest_waitlist(country, region);


-- ============================================================================
-- DESTINATIONS (DESTINOS)
-- ============================================================================

-- destinos table
create table if not exists public.destinos (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text,
  country text not null default 'Argentina',
  region text,
  city text,
  short_description text,
  description text,
  status text not null default 'draft' check (status in ('draft', 'pending_review', 'published', 'unavailable', 'archived')),
  reservation_url text,
  cover_image_url text,
  photos text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  source_type text check (source_type in ('postulacion', 'partner')),
  source_id uuid,
  
  -- Campos para compatibilidad y mapeo
  complejo text,
  archivado boolean not null default false,
  ubicacion text
);

-- RLS Configuration
alter table public.destinos enable row level security;

-- Policies
drop policy if exists "Cualquier persona puede ver destinos" on public.destinos;
drop policy if exists "Solo administradores pueden gestionar destinos" on public.destinos;

-- Cualquier persona (incluso no autenticados) puede consultar destinos para la landing
create policy "Cualquier persona puede ver destinos"
  on public.destinos for select
  to public
  using (true);

-- Solo administradores pueden insertar/actualizar/eliminar destinos
create policy "Usuarios autenticados pueden gestionar destinos"
  on public.destinos for all
  to authenticated
  using (true)
  with check (true);

-- Permissions
grant select on public.destinos to anon, authenticated;
grant all on public.destinos to authenticated;

-- Indices
create index if not exists destinos_status_idx on public.destinos(status);
create index if not exists destinos_archivado_idx on public.destinos(archivado);


-- ============================================================================
-- CONTENT MANAGEMENT (CMS)
-- ============================================================================

-- Table definition
create table if not exists public.contenido (
  id text primary key check (id = 'landing'),
  draft_content jsonb not null default '{}'::jsonb,
  published_content jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  last_published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  published_by uuid references auth.users(id) on delete set null
);

-- RLS Configuration
alter table public.contenido enable row level security;

-- Policies
drop policy if exists "Solo administradores pueden gestionar contenido" on public.contenido;

create policy "Usuarios autenticados pueden gestionar contenido"
  on public.contenido for all
  to authenticated
  using (true)
  with check (true);

-- Permissions
grant all on public.contenido to authenticated;

-- Public read view or function
create or replace function public.get_published_content()
returns jsonb
security definer
as $$
  select published_content from public.contenido where id = 'landing';
$$ language sql;

grant execute on function public.get_published_content() to anon, authenticated;
