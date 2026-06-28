update public.productos
set precio = 42000
where nombre = 'Monstera deliciosa';

update public.productos
set
  precio = 52000,
  descripcion_larga = 'El Ficus aporta altura, presencia y un verde profundo. Es una opción muy buscada para sumar volumen en rincones y entradas, con mantenimiento simple.',
  riego = 'Cada 7 a 10 días',
  estado = 'Últimas unidades'
where nombre = 'Ficus';

update public.productos
set
  precio = 32000,
  descripcion_larga = 'El Potus es una planta versátil, ideal para estantes, escritorios o muebles altos. Se adapta muy bien a distintos ambientes y es perfecta para empezar.'
where nombre = 'Potus';

update public.productos
set precio = 36000
where nombre = 'Pilea peperomioides';

update public.productos
set precio = 41000
where nombre = 'Philodendron Brasil';

update public.productos
set precio = 46000
where nombre = 'Calathea';

update public.productos
set precio = 52000
where nombre = 'Zamioculca';

update public.productos
set precio = 39000
where nombre = 'Sanseviera';

update public.productos
set
  descripcion_larga = 'La Pilea peperomioides suma una forma gráfica y liviana al espacio. Prefiere luz indirecta y riegos moderados.',
  riego = 'Cada 7 a 10 días'
where nombre = 'Pilea peperomioides';

update public.productos
set
  descripcion_larga = 'La Calathea se destaca por sus hojas dibujadas y tonos profundos. Prefiere ambientes húmedos y luz filtrada.'
where nombre = 'Calathea';

update public.productos
set
  descripcion_larga = 'La Zamioculca tolera muy bien interiores y riegos espaciados. Es una opción elegante para entradas y oficinas.',
  riego = 'Cada 15 días'
where nombre = 'Zamioculca';

update public.productos
set riego = 'Cada 15 a 20 días'
where nombre = 'Sanseviera';

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
  'Pilea peperomioides',
  'Planta compacta de hojas redondas, ideal para escritorios y rincones luminosos.',
  'La Pilea peperomioides suma una forma gráfica y liviana al espacio. Prefiere luz indirecta y riegos moderados.',
  36000,
  12,
  '/Pilea peperomioides.jpg',
  'Pilea peperomioides en maceta',
  'Plantas',
  'Luz indirecta brillante',
  'Cada 7 a 10 días',
  'Maceta de 14 cm',
  'Disponible'
where not exists (
  select 1 from public.productos where nombre = 'Pilea peperomioides'
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
  'Philodendron Brasil',
  'Philodendron colgante con hojas verdes y amarillas de mucho contraste.',
  'El Philodendron Brasil es resistente y decorativo. Funciona muy bien en estantes, bibliotecas y macetas colgantes.',
  41000,
  10,
  '/Philodendron Brasil.jpg',
  'Philodendron Brasil en maceta negra',
  'Plantas',
  'Luz media indirecta',
  'Cuando se seca la capa superior',
  'Maceta de 16 cm',
  'Disponible'
where not exists (
  select 1 from public.productos where nombre = 'Philodendron Brasil'
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
  'Calathea',
  'Planta de hojas estampadas, perfecta para sumar textura y color.',
  'La Calathea se destaca por sus hojas dibujadas y tonos profundos. Prefiere ambientes húmedos y luz filtrada.',
  46000,
  8,
  '/Calathea.jpg',
  'Calathea en maceta blanca',
  'Plantas',
  'Luz indirecta filtrada',
  'Riego frecuente y moderado',
  'Maceta de 16 cm',
  'Disponible'
where not exists (
  select 1 from public.productos where nombre = 'Calathea'
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
  'Zamioculca',
  'Planta resistente de hojas brillantes, ideal para bajo mantenimiento.',
  'La Zamioculca tolera muy bien interiores y riegos espaciados. Es una opción elegante para entradas y oficinas.',
  52000,
  9,
  '/Zamioculca.jpg',
  'Zamioculca en maceta blanca',
  'Plantas',
  'Luz baja a media',
  'Cada 15 días',
  'Maceta de 18 cm',
  'Disponible'
where not exists (
  select 1 from public.productos where nombre = 'Zamioculca'
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
  'Sanseviera',
  'Planta vertical y resistente, ideal para espacios modernos.',
  'La Sanseviera es una planta noble y estructural. Necesita poco riego y se adapta a distintos niveles de luz.',
  39000,
  11,
  '/Sanseviera.jpg',
  'Sanseviera en maceta clara',
  'Plantas',
  'Luz baja a brillante indirecta',
  'Cada 15 a 20 días',
  'Maceta de 15 cm',
  'Disponible'
where not exists (
  select 1 from public.productos where nombre = 'Sanseviera'
);
