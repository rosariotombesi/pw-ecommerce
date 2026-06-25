import {
  crearSupabaseAdmin,
  errorResponse,
  esAdmin,
  obtenerUsuario,
  successResponse,
} from "../../../lib/apiHelpers";

function adaptarOrden(orden) {
  return {
    id: orden.id,
    total: Number(orden.total),
    estado: orden.estado,
    fecha: orden.creado_en || orden.created_at || orden.fecha || null,
  };
}

export default async function handler(req, res) {
  try {
    const { supabase, user } = await obtenerUsuario(req);

    if (!user) {
      return errorResponse(res, 401, "No autenticado", "UNAUTHORIZED");
    }

    if (req.method === "GET") {
      const admin = await esAdmin(supabase, user);
      let query = supabase
        .from("ordenes")
        .select("*")
        .order("id", { ascending: false });

      if (!admin) {
        query = query.eq("usuario_id", user.id);
      }

      const { data, error } = await query;

      if (error) {
        return errorResponse(res, 500, error.message, "ORDERS_READ_ERROR");
      }

      return successResponse(res, data.map(adaptarOrden));
    }

    if (req.method === "POST") {
      const { data: carritoItems, error: carritoError } = await supabase
        .from("carrito")
        .select("producto_id, cantidad, productos(id, nombre, precio, stock)")
        .eq("usuario_id", user.id);

      if (carritoError) {
        return errorResponse(res, 500, carritoError.message, "CART_READ_ERROR");
      }

      if (!carritoItems.length) {
        return errorResponse(res, 400, "El carrito esta vacio", "EMPTY_CART");
      }

      for (const item of carritoItems) {
        if (!item.productos || Number(item.productos.stock) < item.cantidad) {
          return errorResponse(res, 400, "Stock insuficiente", "INSUFFICIENT_STOCK");
        }
      }

      const total = carritoItems.reduce((sum, item) => {
        return sum + Number(item.productos.precio) * item.cantidad;
      }, 0);

      const db = crearSupabaseAdmin(req);
      const items = carritoItems.map((item) => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
      }));

      const { data: resultado, error: rpcError } = await db.rpc(
        "crear_orden_completa",
        {
          p_usuario_id: user.id,
          p_items: items,
          p_total: total,
        }
      );

      if (rpcError) {
        return errorResponse(res, 500, rpcError.message, "ORDER_RPC_ERROR");
      }

      const respuesta = resultado?.[0];

      if (!respuesta?.success) {
        return errorResponse(
          res,
          400,
          respuesta?.error_msg || "No se pudo crear la orden",
          "ORDER_TRANSACTION_ERROR"
        );
      }

      const { data: orden, error: ordenError } = await supabase
        .from("ordenes")
        .select("*")
        .eq("id", respuesta.orden_id)
        .eq("usuario_id", user.id)
        .single();

      if (ordenError) {
        return errorResponse(res, 500, ordenError.message, "ORDER_READ_ERROR");
      }

      return successResponse(res, adaptarOrden(orden), 201);
    }

    res.setHeader("Allow", "GET, POST");
    return errorResponse(res, 405, "Metodo no permitido", "METHOD_NOT_ALLOWED");
  } catch (error) {
    return errorResponse(res, 500, "Error al procesar ordenes", "SERVER_ERROR");
  }
}
