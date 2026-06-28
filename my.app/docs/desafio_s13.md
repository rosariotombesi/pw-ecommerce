# Desafio Semana 13 - Mercado Pago Sandbox

## Setup

Agregar estas variables en `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key
MERCADO_PAGO_ACCESS_TOKEN=TEST-tu-access-token
```

`MERCADO_PAGO_ACCESS_TOKEN` es privado y solo se usa en API Routes.
Si seguis una diapositiva que lo nombra como `MERCADOPAGO_ACCESS_TOKEN`,
el proyecto también lo acepta, pero se recomienda usar `MERCADO_PAGO_ACCESS_TOKEN`.

## Flujo Implementado

1. El usuario crea una orden desde el carrito.
2. Entra a `/checkout?ordenId=ID`.
3. El boton llama a `POST /api/pagos/crear-preferencia`.
4. El backend valida usuario, orden pendiente e ítems.
5. El backend crea una preferencia real en Mercado Pago Sandbox.
6. El frontend redirige al `init_point` de Mercado Pago.
7. Mercado Pago vuelve a:
   - `/pago-completado`
   - `/pago-fallido`
   - `/pago-pendiente`

## API Routes

- `POST /api/pagos/crear-preferencia`: crea preferencia en Mercado Pago.
- `GET /api/pagos/webhook`: verifica que el webhook esta activo.
- `POST /api/pagos/webhook`: preparado para recibir notificaciones de pago.

## Tarjetas de Prueba

- Aprobada: `4111 1111 1111 1111`, titular `APRO`.
- Rechazada: `4111 1111 1111 1112`, titular `OTHE`.
- Pendiente: `4111 1111 1111 1113`, titular `PENDING`.

Usar vencimiento futuro y CVV `123`. Si una diapositiva muestra `11/25`,
reemplazarlo por una fecha futura porque noviembre de 2025 ya vencio.

## Pruebas Realizadas

Las pruebas se hicieron desde la app desplegada en Vercel, usando Mercado Pago
Sandbox y verificando luego el estado de la orden en Supabase.

| Caso | Titular | Resultado en Mercado Pago | Pagina de retorno | Orden | Estado en Supabase |
| --- | --- | --- | --- | --- | --- |
| Pago aprobado | `APRO` | `approved` | `/pago-completado` | `#13` | `pagada` |
| Pago rechazado | `OTHE` | `rejected` | `/pago-fallido` | `#14` | `pendiente` |
| Pago pendiente | `CONT` | `in_process` | `/pago-pendiente` | `#15` | `pendiente` |

Conclusiones:

- El pago aprobado marca la orden como `pagada`.
- El pago rechazado no marca la orden como pagada.
- El pago pendiente queda como `pendiente` hasta que Mercado Pago confirme el resultado.
- Las páginas de resultado reciben correctamente `payment_id`, `external_reference`
  y `status` desde Mercado Pago.

## Nota Sobre Webhooks Locales

Mercado Pago no puede llamar a `localhost` desde internet. Para probar el webhook
en local hace falta exponer el proyecto con una URL pública, por ejemplo ngrok.
Hasta entonces, el usuario ve la página de resultado y el admin puede verificar
el estado desde el reporte.
