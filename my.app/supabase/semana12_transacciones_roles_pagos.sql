alter table public.usuarios
add column if not exists rol varchar(50) not null default 'cliente';

create index if not exists idx_usuarios_rol
on public.usuarios(rol);

-- Ejecutar ajustando el email del administrador:
-- update public.usuarios set rol = 'admin' where email = 'tu-email@gmail.com';

create or replace function public.usuario_es_admin(p_user_id uuid)
returns boolean as $$
  select exists (
    select 1
    from public.usuarios
    where id = p_user_id
      and rol = 'admin'
  );
$$ language sql stable security definer set search_path = public;

grant execute on function public.usuario_es_admin(uuid)
to authenticated, service_role;

alter table public.ordenes
add column if not exists metodo_pago varchar(50),
add column if not exists referencia_pago varchar(255),
add column if not exists pagado_en timestamptz;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'estado_orden') then
    create type public.estado_orden as enum (
      'pendiente',
      'pagada',
      'confirmada',
      'enviada',
      'entregada',
      'cancelada'
    );
  end if;
end $$;

alter table public.ordenes
alter column estado drop default;

alter table public.ordenes
alter column estado type public.estado_orden
using estado::public.estado_orden;

alter table public.ordenes
alter column estado set default 'pendiente'::public.estado_orden;

create or replace function public.crear_orden_completa(
  p_usuario_id uuid,
  p_items jsonb,
  p_total numeric
)
returns table (
  orden_id bigint,
  success boolean,
  error_msg text
) as $$
declare
  v_orden_id bigint;
  v_item jsonb;
  v_producto record;
  v_producto_id integer;
  v_cantidad integer;
  v_precio numeric;
  v_total_calculado numeric := 0;
begin
  if p_usuario_id is null then
    raise exception 'Usuario inválido';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'El carrito está vacío';
  end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_producto_id := (v_item ->> 'producto_id')::integer;
    v_cantidad := (v_item ->> 'cantidad')::integer;

    if v_producto_id is null or v_cantidad is null or v_cantidad <= 0 then
      raise exception 'Ítem inválido';
    end if;

    select id, nombre, precio, stock
    into v_producto
    from public.productos
    where id = v_producto_id
    for update;

    if not found then
      raise exception 'Producto no encontrado';
    end if;

    if v_producto.stock < v_cantidad then
      raise exception 'Stock insuficiente para %', v_producto.nombre;
    end if;

    v_total_calculado := v_total_calculado + (v_producto.precio * v_cantidad);
  end loop;

  if v_total_calculado <> p_total then
    raise exception 'Total inválido';
  end if;

  insert into public.ordenes (usuario_id, total, estado)
  values (p_usuario_id, v_total_calculado, 'pendiente')
  returning id into v_orden_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_producto_id := (v_item ->> 'producto_id')::integer;
    v_cantidad := (v_item ->> 'cantidad')::integer;

    select id, nombre, precio, stock
    into v_producto
    from public.productos
    where id = v_producto_id
    for update;

    v_precio := v_producto.precio;

    insert into public.order_items (
      orden_id,
      producto_id,
      nombre,
      precio,
      cantidad,
      subtotal
    )
    values (
      v_orden_id,
      v_producto.id,
      v_producto.nombre,
      v_precio,
      v_cantidad,
      v_precio * v_cantidad
    );

    update public.productos
    set stock = stock - v_cantidad
    where id = v_producto.id;
  end loop;

  delete from public.carrito
  where usuario_id = p_usuario_id;

  return query select v_orden_id, true, null::text;
exception when others then
  return query select null::bigint, false, sqlerrm;
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function public.crear_orden_completa(uuid, jsonb, numeric)
to authenticated, service_role;

alter table public.usuarios enable row level security;
alter table public.ordenes enable row level security;
alter table public.order_items enable row level security;
alter table public.productos enable row level security;
alter table public.carrito enable row level security;

drop policy if exists "Usuarios ven su propio perfil" on public.usuarios;
drop policy if exists "Usuarios actualizan su propio perfil" on public.usuarios;
drop policy if exists "Usuarios insertan su propio perfil" on public.usuarios;
drop policy if exists "Admins ven todos los perfiles" on public.usuarios;
drop policy if exists "Admins actualizan perfiles" on public.usuarios;

create policy "Usuarios ven su propio perfil"
on public.usuarios
for select
to public
using (id = auth.uid() or public.usuario_es_admin(auth.uid()));

create policy "Usuarios insertan su propio perfil"
on public.usuarios
for insert
to public
with check (id = auth.uid());

create policy "Usuarios actualizan su propio perfil"
on public.usuarios
for update
to public
using (id = auth.uid())
with check (id = auth.uid());

create policy "Admins actualizan perfiles"
on public.usuarios
for update
to public
using (public.usuario_es_admin(auth.uid()))
with check (public.usuario_es_admin(auth.uid()));

create or replace function public.bloquear_escalada_rol()
returns trigger as $$
begin
  if new.rol is distinct from old.rol
    and auth.uid() is not null
    and not public.usuario_es_admin(auth.uid())
  then
    raise exception 'No autorizado para modificar rol';
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists bloquear_escalada_rol on public.usuarios;

create trigger bloquear_escalada_rol
before update on public.usuarios
for each row
execute function public.bloquear_escalada_rol();

drop policy if exists "Usuarios ven sus ordenes" on public.ordenes;
drop policy if exists "Clientes ven sus ordenes y admins todas" on public.ordenes;
drop policy if exists "Admins actualizan ordenes" on public.ordenes;

create policy "Clientes ven sus ordenes y admins todas"
on public.ordenes
for select
to public
using (
  usuario_id = auth.uid()
  or public.usuario_es_admin(auth.uid())
);

create policy "Admins actualizan ordenes"
on public.ordenes
for update
to public
using (public.usuario_es_admin(auth.uid()))
with check (public.usuario_es_admin(auth.uid()));

drop policy if exists "Usuarios ven items de sus ordenes" on public.order_items;
drop policy if exists "Clientes y admins ven detalles de orden" on public.order_items;

create policy "Clientes y admins ven detalles de orden"
on public.order_items
for select
to public
using (
  exists (
    select 1
    from public.ordenes
    where ordenes.id = order_items.orden_id
      and (
        ordenes.usuario_id = auth.uid()
        or public.usuario_es_admin(auth.uid())
      )
  )
);

drop policy if exists "Todos pueden ver productos" on public.productos;
drop policy if exists "Admins actualizan productos" on public.productos;
drop policy if exists "Admins insertan productos" on public.productos;
drop policy if exists "Admins eliminan productos" on public.productos;

create policy "Todos pueden ver productos"
on public.productos
for select
to public
using (true);

create policy "Admins actualizan productos"
on public.productos
for update
to public
using (public.usuario_es_admin(auth.uid()))
with check (public.usuario_es_admin(auth.uid()));

create policy "Admins insertan productos"
on public.productos
for insert
to public
with check (public.usuario_es_admin(auth.uid()));

create policy "Admins eliminan productos"
on public.productos
for delete
to public
using (public.usuario_es_admin(auth.uid()));
