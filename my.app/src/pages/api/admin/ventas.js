import {
  crearSupabaseAdmin,
  errorResponse,
  esAdmin,
  obtenerUsuario,
  successResponse,
} from "../../../lib/apiHelpers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return errorResponse(res, 405, "Metodo no permitido", "METHOD_NOT_ALLOWED");
  }

  try {
    const { supabase, user } = await obtenerUsuario(req);

    if (!user) {
      return errorResponse(res, 401, "No autenticado", "UNAUTHORIZED");
    }

    if (!(await esAdmin(supabase, user))) {
      return errorResponse(res, 403, "No autorizado", "FORBIDDEN");
    }

    const db = crearSupabaseAdmin(req);

    const { data: ordenes, error: ordenesError } = await db
      .from("ordenes")
      .select("id, total, estado, creado_en")
      .order("id", { ascending: false });

    if (ordenesError) {
      return errorResponse(res, 500, ordenesError.message, "SALES_READ_ERROR");
    }

    const { data: items, error: itemsError } = await db
      .from("order_items")
      .select("orden_id, nombre, cantidad, subtotal");

    if (itemsError) {
      return errorResponse(res, 500, itemsError.message, "SALES_ITEMS_READ_ERROR");
    }

    const totalVendido = ordenes.reduce(
      (sum, orden) => sum + Number(orden.total),
      0
    );
    const totalConDetalle = items.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0
    );
    const ordenesConDetalle = new Set(items.map((item) => item.orden_id)).size;

    const productos = items.reduce((acc, item) => {
      const actual = acc[item.nombre] || {
        nombre: item.nombre,
        cantidad: 0,
        total: 0,
      };

      actual.cantidad += item.cantidad;
      actual.total += Number(item.subtotal);
      acc[item.nombre] = actual;

      return acc;
    }, {});

    return successResponse(res, {
      totalOrdenes: ordenes.length,
      totalVendido,
      totalConDetalle,
      ordenesConDetalle,
      ordenes: ordenes.map((orden) => ({
        id: orden.id,
        total: Number(orden.total),
        estado: orden.estado,
        fecha: orden.creado_en,
      })),
      productos: Object.values(productos).sort((a, b) => b.total - a.total),
    });
  } catch (error) {
    return errorResponse(res, 500, "Error al obtener reporte", "SERVER_ERROR");
  }
}
