# Verdant App

Aplicación principal del ecommerce Verdant. Usa Next.js con App Router, Supabase y Mercado Pago Sandbox.

## Scripts

- `npm run dev`: inicia el entorno de desarrollo.
- `npm run build`: genera el build de producción.
- `npm start`: levanta la app compilada.

## Rutas Principales

- `/`: inicio con productos destacados.
- `/productos/plantas`: catálogo completo de plantas.
- `/productos/macetas`: catálogo completo de macetas.
- `/producto/[id]`: detalle de producto y variantes.
- `/checkout?ordenId=ID`: checkout con Mercado Pago.
- `/ordenes`: historial de compras del usuario.
- `/admin/ventas`: reporte administrativo para usuarios con rol `admin`.

## API Routes

Las API routes viven en `src/app/api` y delegan la lógica en `src/server/api`.

- `GET /api/productos`
- `GET /api/ordenes`
- `POST /api/ordenes`
- `GET /api/ordenes/[id]`
- `POST /api/carrito`
- `POST /api/pagos/crear-preferencia`
- `POST /api/pagos/confirmar`
- `POST /api/webhooks/mercado-pago`

## Base de Datos

La carpeta `supabase/` conserva los scripts SQL usados durante la cursada:

- creación de `order_items`;
- transacciones con `crear_orden_completa`;
- roles y políticas RLS;
- campos de pago;
- productos nuevos;
- variantes de macetas.

Aunque ya estén ejecutados en Supabase, se dejan versionados para documentar cómo se armó la base.

## Deploy en Vercel

El proyecto de Vercel debe usar:

- Root Directory: `my.app`
- Build Command: `npm run build`
- Output: gestionado automáticamente por Next.js.

Las variables de entorno se cargan en Vercel desde Project Settings > Environment Variables.
