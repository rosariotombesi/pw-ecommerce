import {
  errorResponse,
  obtenerUsuario,
  successResponse,
  validarCantidad,
} from "../../lib/apiHelpers";
import { adaptarProducto } from "../../lib/productos";

function adaptarItemCarrito(item) {
  return {
    ...adaptarProducto(item.productos),
    cantidad: item.cantidad,
  };
}

async function obtenerCarrito(supabase, usuarioId) {
  return supabase
    .from("carrito")
    .select("cantidad, productos(*)")
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
      const cantidad = Number(req.body?.cantidad ?? 1);

      if (!Number.isInteger(productoId) || !validarCantidad(cantidad)) {
        return errorResponse(res, 400, "Producto o cantidad invalida", "INVALID_CART_ITEM");
      }

      const { data: producto, error: productoError } = await supabase
        .from("productos")
        .select("id, stock")
        .eq("id", productoId)
        .single();

      if (productoError || !producto) {
        return errorResponse(res, 404, "Producto no encontrado", "PRODUCT_NOT_FOUND");
      }

      const { data: existente, error: existenteError } = await supabase
        .from("carrito")
        .select("cantidad")
        .eq("usuario_id", user.id)
        .eq("producto_id", productoId)
        .maybeSingle();

      if (existenteError) {
        return errorResponse(res, 500, existenteError.message, "CART_READ_ERROR");
      }

      const nuevaCantidad = (existente?.cantidad || 0) + cantidad;

      if (Number(producto.stock) < nuevaCantidad) {
        return errorResponse(res, 400, "Stock insuficiente", "INSUFFICIENT_STOCK");
      }

      const { error } = await supabase.from("carrito").upsert(
        {
          usuario_id: user.id,
          producto_id: productoId,
          cantidad: nuevaCantidad,
        },
        {
          onConflict: "usuario_id,producto_id",
        }
      );

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
      const productoId = Number(req.body?.producto_id);

      if (!Number.isInteger(productoId)) {
        return errorResponse(res, 400, "Producto invalido", "INVALID_PRODUCT");
      }

      const { data: existente, error: existenteError } = await supabase
        .from("carrito")
        .select("cantidad")
        .eq("usuario_id", user.id)
        .eq("producto_id", productoId)
        .maybeSingle();

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
              .eq("producto_id", productoId)
          : await supabase
              .from("carrito")
              .delete()
              .eq("usuario_id", user.id)
              .eq("producto_id", productoId);

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
    return errorResponse(res, 405, "Metodo no permitido", "METHOD_NOT_ALLOWED");
  } catch (error) {
    return errorResponse(res, 500, "Error al procesar carrito", "SERVER_ERROR");
  }
}
