# Testing API Routes

Estas pruebas sirven para verificar que las API Routes validan datos en servidor.

## Obtener un token

La forma más simple es iniciar sesión en la web, abrir DevTools > Network,
crear una orden o cargar órdenes y usar "Copy as cURL" sobre la request.

También podés copiar el valor del header:

```text
Authorization: Bearer TU_ACCESS_TOKEN
```

## Probar sin login

Debe responder `401 No autenticado`.

```powershell
curl -i http://localhost:3000/api/ordenes
```

## Ver productos

Debe responder `200 OK`.

```powershell
curl -i http://localhost:3000/api/productos
```

## Agregar al carrito

Debe responder `201 Created` si el token es válido y hay stock.

```powershell
curl -i -X POST http://localhost:3000/api/carrito `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer TU_ACCESS_TOKEN" `
  -d "{\"producto_id\":1,\"cantidad\":1}"
```

## Intentar cantidad inválida

Debe responder `400 Bad Request`.

```powershell
curl -i -X POST http://localhost:3000/api/carrito `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer TU_ACCESS_TOKEN" `
  -d "{\"producto_id\":1,\"cantidad\":999}"
```

## Crear orden

Debe responder `201 Created`, crear la orden, guardar `order_items`, descontar
stock y vaciar carrito.

```powershell
curl -i -X POST http://localhost:3000/api/ordenes `
  -H "Authorization: Bearer TU_ACCESS_TOKEN"
```

## Ver historial

Debe responder solo las órdenes del usuario autenticado.

```powershell
curl -i http://localhost:3000/api/ordenes `
  -H "Authorization: Bearer TU_ACCESS_TOKEN"
```

## Ver detalle

```powershell
curl -i http://localhost:3000/api/ordenes/1 `
  -H "Authorization: Bearer TU_ACCESS_TOKEN"
```

## Reporte admin

Requiere que el email del usuario esté en `SUPABASE_ADMIN_EMAILS`.

```powershell
curl -i http://localhost:3000/api/admin/ventas `
  -H "Authorization: Bearer TU_ACCESS_TOKEN"
```
