-- 1. Habilitar RLS en profiles (por si acaso no está activado)
alter table public.profiles enable row level security;

-- 2. Eliminar políticas previas para evitar conflictos
drop policy if exists "Cualquier usuario autenticado puede leer perfiles" on public.profiles;
drop policy if exists "Solo administradores pueden actualizar perfiles" on public.profiles;

-- 3. Crear políticas RLS para profiles
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

-- 4. Crear funciones auxiliares para obtener el rol y verificar si es administrador
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
