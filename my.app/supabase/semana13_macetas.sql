update public.productos
set precio = 26000
where nombre in ('Maceta clasica', 'Maceta clásica');

update public.productos
set precio = 32000
where nombre = 'Maceta diamond';

update public.productos
set precio = 24000
where nombre = 'Maceta minimal';

update public.productos
set
  nombre = 'Maceta clásica',
  descripcion = 'Maceta simple disponible en verde, gris y blanco.',
  descripcion_larga = 'Maceta de línea simple para acompañar plantas de interior. En el detalle podés ver las opciones de color disponibles.',
  alt = 'Maceta clásica verde',
  riego = 'Incluye drenaje básico'
where nombre in ('Maceta clasica', 'Maceta clásica');

update public.productos
set
  descripcion = 'Maceta texturada de diseño simple, disponible en una única opción.',
  descripcion_larga = 'La maceta diamond suma textura sin recargar el ambiente. Es una opción limpia para plantas chicas o medianas.',
  riego = 'Incluye drenaje básico'
where nombre = 'Maceta diamond';

update public.productos
set
  descripcion = 'Maceta básica con opciones de tamaño y color.',
  descripcion_larga = 'La maceta minimal está pensada para combinar fácil con distintas plantas. En el detalle podés elegir tamaño chico, mediano o grande, y color blanco, negro o gris.',
  riego = 'Incluye drenaje básico'
where nombre = 'Maceta minimal';

insert into public.productos (
  nombre,
  descripcion,
  descripcion_larga,
  precio,
  stock,
  imagen_url,
  alt,
  categoria,
  luz,
  riego,
  tamanio,
  estado
)
select
  'Maceta clásica',
  'Maceta simple disponible en verde, gris y blanco.',
  'Maceta de línea simple para acompañar plantas de interior. En el detalle podés ver las opciones de color disponibles.',
  26000,
  18,
  '/macetaverde.jpg',
  'Maceta clásica verde',
  'Macetas',
  'Apta para interior',
  'Incluye drenaje básico',
  'Mediana',
  'Disponible'
where not exists (
  select 1 from public.productos where nombre in ('Maceta clásica', 'Maceta clasica')
);

insert into public.productos (
  nombre,
  descripcion,
  descripcion_larga,
  precio,
  stock,
  imagen_url,
  alt,
  categoria,
  luz,
  riego,
  tamanio,
  estado
)
select
  'Maceta diamond',
  'Maceta texturada de diseño simple, disponible en una única opción.',
  'La maceta diamond suma textura sin recargar el ambiente. Es una opción limpia para plantas chicas o medianas.',
  32000,
  14,
  '/macetadiamond.jpg',
  'Maceta diamond clara',
  'Macetas',
  'Apta para interior',
  'Incluye drenaje básico',
  'Mediana',
  'Disponible'
where not exists (
  select 1 from public.productos where nombre = 'Maceta diamond'
);

insert into public.productos (
  nombre,
  descripcion,
  descripcion_larga,
  precio,
  stock,
  imagen_url,
  alt,
  categoria,
  luz,
  riego,
  tamanio,
  estado
)
select
  'Maceta minimal',
  'Maceta básica con opciones de tamaño y color.',
  'La maceta minimal está pensada para combinar fácil con distintas plantas. En el detalle podés elegir tamaño chico, mediano o grande, y color blanco, negro o gris.',
  24000,
  16,
  '/macetanegra.jpg',
  'Maceta minimal negra',
  'Macetas',
  'Apta para interior',
  'Incluye drenaje básico',
  'Chica, mediana o grande',
  'Disponible'
where not exists (
  select 1 from public.productos where nombre = 'Maceta minimal'
);
