import {
  crearSupabaseAdmin,
  errorResponse,
  esAdmin,
  obtenerUsuario,
  successResponse,
} from "../../../lib/apiHelpers";

function adaptarOrden(orden, items) {
  return {
    id: orden.id,
    total: Number(orden.total),
    estado: orden.estado,
    fecha: orden.creado_en || orden.created_at || orden.fecha || null,
    items: items.map((item) => ({
      id: item.id,
      productoId: item.producto_id,
      nombre: item.nombre,
      precio: Number(item.precio),
      cantidad: item.cantidad,
      subtotal: Number(item.subtotal),
    })),
  };
}

export default async function handler(req, res) {
  if (!["GET", "PATCH"].includes(req.method)) {
    res.setHeader("Allow", "GET, PATCH");
    return errorResponse(res, 405, "Metodo no permitido", "METHOD_NOT_ALLOWED");
  }

  try {
    const ordenId = Number(req.query.id);

    if (!Number.isInteger(ordenId)) {
      return errorResponse(res, 400, "Orden invalida", "INVALID_ORDER");
    }

    const { supabase, user } = await obtenerUsuario(req);

    if (!user) {
      return errorResponse(res, 401, "No autenticado", "UNAUTHORIZED");
    }

    const admin = await esAdmin(supabase, user);

    if (req.method === "PATCH") {
      if (!admin) {
        return errorResponse(res, 403, "No autorizado", "FORBIDDEN");
      }

      const estadosValidos = [
        "pendiente",
        "pagada",
        "confirmada",
        "enviada",
        "entregada",
        "cancelada",
      ];
      const estado = req.body?.estado;

      if (!estadosValidos.includes(estado)) {
        return errorResponse(res, 400, "Estado invalido", "INVALID_STATUS");
      }

      const db = crearSupabaseAdmin(req);
      const { data: ordenActualizada, error: updateError } = await db
        .from("ordenes")
        .update({ estado })
        .eq("id", ordenId)
        .select("*")
        .single();

      if (updateError || !ordenActualizada) {
        return errorResponse(res, 404, "Orden no encontrada", "ORDER_NOT_FOUND");
      }

      return successResponse(res, adaptarOrden(ordenActualizada, []));
    }

    let ordenQuery = supabase
      .from("ordenes")
      .select("*")
      .eq("id", ordenId);

    if (!admin) {
      ordenQuery = ordenQuery.eq("usuario_id", user.id);
    }

    const { data: orden, error: ordenError } = await ordenQuery.single();

    if (ordenError || !orden) {
      return errorResponse(res, 404, "Orden no encontrada", "ORDER_NOT_FOUND");
    }

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("orden_id", ordenId)
      .order("id", { ascending: true });

    if (itemsError) {
      return errorResponse(res, 500, itemsError.message, "ORDER_ITEMS_READ_ERROR");
    }

    return successResponse(res, adaptarOrden(orden, items));
  } catch (error) {
    return errorResponse(res, 500, "Error al obtener detalle de orden", "SERVER_ERROR");
  }
}
