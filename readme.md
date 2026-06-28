# Verdant

Ecommerce de plantas y macetas desarrollado con Next.js App Router, Supabase y Mercado Pago Sandbox.

Demo en Vercel: https://pw-ecommerce-158s.vercel.app

## Funcionalidades

- Catálogo de plantas y macetas con páginas por categoría.
- Detalle de producto con variantes de color y tamaño para macetas.
- Carrito conectado a Supabase.
- Registro, login y sesión de usuario.
- Creación de órdenes con transacción SQL en Supabase.
- Historial y detalle de órdenes.
- Panel/reporte administrativo protegido por rol `admin`.
- Checkout con Mercado Pago Sandbox.
- Páginas de resultado para pago aprobado, rechazado y pendiente.
- Webhook preparado para recibir notificaciones de Mercado Pago.

## Stack

- Next.js 16 con App Router.
- React 19.
- Supabase Auth, PostgreSQL, RLS y RPC.
- Mercado Pago SDK.
- Vercel para deploy.

## Estructura del Proyecto

- `my.app/`: aplicación principal en Next.js.
- `my.app/src/app/`: rutas de la app, API routes y páginas con App Router.
- `my.app/src/components/`: componentes reutilizables.
- `my.app/src/server/`: lógica del backend compartida por las API routes.
- `my.app/src/lib/`: clientes y helpers de Supabase, Mercado Pago y fetch.
- `my.app/supabase/`: scripts SQL usados para crear tablas, políticas, funciones y datos de prueba.
- `my.app/docs/`: documentación de pruebas y evidencias de la cursada.

