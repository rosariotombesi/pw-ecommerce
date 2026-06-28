import {
  errorResponse,
  obtenerUsuario,
  successResponse,
  validarCantidad,
} from "../../lib/apiHelpers";
import { adaptarProducto } from "../../lib/productos";

function adaptarItemCarrito(item) {
  const producto = adaptarProducto(item.productos);
  const variante = item.producto_variantes;
  const varianteDescripcion = variante
    ? [variante.color, variante.tamanio].filter(Boolean).join(" | ")
    : "";

  return {
    ...producto,
    cartItemId: item.id,
    varianteId: variante?.id || null,
    nombre: variante ? `${producto.nombre} - ${variante.nombre}` : producto.nombre,
    precio: variante ? Number(variante.precio) : producto.precio,
    stock: variante ? Number(variante.stock) : producto.stock,
    imagen: variante?.imagen_url || producto.imagen,
    varianteDescripcion,
    cantidad: item.cantidad,
  };
}

async function obtenerCarrito(supabase, usuarioId) {
  return supabase
    .from("carrito")
    .select("id, cantidad, producto_variante_id, productos(*), producto_variantes(*)")
    .eq("usuario_id", usuarioId)
    .order("id", { ascending: true });
}

export default async function handler(req, res) {
  try {
    const { supabase, user } = await obtenerUsuario(req);

    if (!user) {
      return errorResponse(res, 401, "No autenticado", "UNAUTHORIZED");
    }

    if (req.method === "GET") {
      const { data, error } = await obtenerCarrito(supabase, user.id);

      if (error) {
        return errorResponse(res, 500, error.message, "CART_READ_ERROR");
      }

      return successResponse(res, data.map(adaptarItemCarrito));
    }

    if (req.method === "POST") {
      const productoId = Number(req.body?.producto_id);
      const varianteId = req.body?.producto_variante_id
        ? Number(req.body.producto_variante_id)
        : null;
      const cantidad = Number(req.body?.cantidad ?? 1);

      if (
        !Number.isInteger(productoId) ||
        (varianteId !== null && !Number.isInteger(varianteId)) ||
        !validarCantidad(cantidad)
      ) {
        return errorResponse(res, 400, "Producto o cantidad inválida", "INVALID_CART_ITEM");
      }

      const productoQuery = varianteId
        ? supabase
            .from("producto_variantes")
            .select("id, producto_id, stock, estado")
            .eq("id", varianteId)
            .eq("producto_id", productoId)
            .single()
        : supabase
            .from("productos")
            .select("id, stock")
            .eq("id", productoId)
            .single();

      const { data: producto, error: productoError } = await productoQuery;

      if (productoError || !producto) {
        return errorResponse(res, 404, "Producto no encontrado", "PRODUCT_NOT_FOUND");
      }

      if (producto.estado && producto.estado !== "Disponible") {
        return errorResponse(res, 400, "Variante no disponible", "VARIANT_NOT_AVAILABLE");
      }

      let existenteQuery = supabase
        .from("carrito")
        .select("id, cantidad")
        .eq("usuario_id", user.id)
        .eq("producto_id", productoId);

      existenteQuery = varianteId
        ? existenteQuery.eq("producto_variante_id", varianteId)
        : existenteQuery.is("producto_variante_id", null);

      const { data: existente, error: existenteError } = await existenteQuery.maybeSingle();

      if (existenteError) {
        return errorResponse(res, 500, existenteError.message, "CART_READ_ERROR");
      }

      const nuevaCantidad = (existente?.cantidad || 0) + cantidad;

      if (Number(producto.stock) < nuevaCantidad) {
        return errorResponse(res, 400, "Stock insuficiente", "INSUFFICIENT_STOCK");
      }

      const { error } = existente
        ? await supabase
            .from("carrito")
            .update({ cantidad: nuevaCantidad })
            .eq("id", existente.id)
            .eq("usuario_id", user.id)
        : await supabase.from("carrito").insert({
            usuario_id: user.id,
            producto_id: productoId,
            producto_variante_id: varianteId,
            cantidad: nuevaCantidad,
          });

      if (error) {
        return errorResponse(res, 500, error.message, "CART_WRITE_ERROR");
      }

      const { data, error: carritoError } = await obtenerCarrito(supabase, user.id);

      if (carritoError) {
        return errorResponse(res, 500, carritoError.message, "CART_READ_ERROR");
      }

      return successResponse(res, data.map(adaptarItemCarrito), 201);
    }

    if (req.method === "DELETE") {
      const carritoId = Number(req.body?.carrito_id);
      const productoId = Number(req.body?.producto_id);
      const varianteId = req.body?.producto_variante_id
        ? Number(req.body.producto_variante_id)
        : null;

      if (!Number.isInteger(carritoId) && !Number.isInteger(productoId)) {
        return errorResponse(res, 400, "Producto inválido", "INVALID_PRODUCT");
      }

      let deleteQuery = supabase
        .from("carrito")
        .select("id, cantidad")
        .eq("usuario_id", user.id);

      if (Number.isInteger(carritoId)) {
        deleteQuery = deleteQuery.eq("id", carritoId);
      } else {
        deleteQuery = deleteQuery.eq("producto_id", productoId);
        deleteQuery = varianteId
          ? deleteQuery.eq("producto_variante_id", varianteId)
          : deleteQuery.is("producto_variante_id", null);
      }

      const { data: existente, error: existenteError } = await deleteQuery.maybeSingle();

      if (existenteError) {
        return errorResponse(res, 500, existenteError.message, "CART_READ_ERROR");
      }

      if (!existente) {
        return errorResponse(res, 404, "Producto no encontrado en el carrito", "CART_ITEM_NOT_FOUND");
      }

      const { error } =
        existente.cantidad > 1
          ? await supabase
              .from("carrito")
              .update({ cantidad: existente.cantidad - 1 })
              .eq("usuario_id", user.id)
              .eq("id", existente.id)
          : await supabase
              .from("carrito")
              .delete()
              .eq("usuario_id", user.id)
              .eq("id", existente.id);

      if (error) {
        return errorResponse(res, 500, error.message, "CART_DELETE_ERROR");
      }

      const { data, error: carritoError } = await obtenerCarrito(supabase, user.id);

      if (carritoError) {
        return errorResponse(res, 500, carritoError.message, "CART_READ_ERROR");
      }

      return successResponse(res, data.map(adaptarItemCarrito));
    }

    res.setHeader("Allow", "GET, POST, DELETE");
    return errorResponse(res, 405, "Método no permitido", "METHOD_NOT_ALLOWED");
  } catch (error) {
    return errorResponse(res, 500, "Error al procesar carrito", "SERVER_ERROR");
  }
}
