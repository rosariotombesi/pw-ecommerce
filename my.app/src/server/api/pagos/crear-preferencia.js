import { errorResponse, obtenerUsuario, successResponse } from "../../../lib/apiHelpers";
import {
  crearPreferenciaMercadoPago,
  getAppUrl,
  tieneMercadoPagoConfigurado,
} from "../../../lib/mercadoPago";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return errorResponse(res, 405, "Método no permitido", "METHOD_NOT_ALLOWED");
  }

  try {
    const { supabase, user } = await obtenerUsuario(req);

    if (!user) {
      return errorResponse(res, 401, "No autenticado", "UNAUTHORIZED");
    }

    const ordenId = Number(req.body?.orden_id);

    if (!Number.isInteger(ordenId)) {
      return errorResponse(res, 400, "Orden inválida", "INVALID_ORDER");
    }

    const { data: orden, error: ordenError } = await supabase
      .from("ordenes")
      .select("*")
      .eq("id", ordenId)
      .eq("usuario_id", user.id)
      .single();

    if (ordenError || !orden) {
      return errorResponse(res, 404, "Orden no encontrada", "ORDER_NOT_FOUND");
    }

    if (orden.estado !== "pendiente") {
      return errorResponse(
        res,
        400,
        "La orden no está pendiente de pago",
        "ORDER_NOT_PENDING"
      );
    }

    if (!tieneMercadoPagoConfigurado()) {
      return errorResponse(
        res,
        500,
        "Falta configurar MERCADO_PAGO_ACCESS_TOKEN",
        "MERCADO_PAGO_NOT_CONFIGURED"
      );
    }

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("orden_id", ordenId)
      .order("id", { ascending: true });

    if (itemsError) {
      return errorResponse(res, 500, itemsError.message, "ORDER_ITEMS_READ_ERROR");
    }

    if (!items.length) {
      return errorResponse(res, 400, "La orden no tiene ítems", "EMPTY_ORDER");
    }

    const appUrl = getAppUrl(req);
    const itemsMercadoPago = items.map((item) => ({
      id: String(item.producto_id),
      title: item.variante_nombre
        ? `${item.nombre} - ${item.variante_nombre}`
        : item.nombre,
      description: [item.color, item.tamanio, `Cantidad: ${item.cantidad}`]
        .filter(Boolean)
        .join(" | "),
      quantity: item.cantidad,
      unit_price: Number(item.precio),
      currency_id: "ARS",
    }));

    const preferenciaPayload = {
      items: itemsMercadoPago,
      back_urls: {
        success: `${appUrl}/pago-completado?orden_id=${orden.id}`,
        failure: `${appUrl}/pago-fallido?orden_id=${orden.id}`,
        pending: `${appUrl}/pago-pendiente?orden_id=${orden.id}`,
      },
      external_reference: String(orden.id),
      notification_url: `${appUrl}/api/webhooks/mercado-pago`,
      metadata: {
        orden_id: orden.id,
        usuario_id: user.id,
      },
    };

    if (!appUrl.includes("localhost") && !appUrl.includes("127.0.0.1")) {
      preferenciaPayload.auto_return = "approved";
    }

    const preferencia = await crearPreferenciaMercadoPago(preferenciaPayload);

    await supabase
      .from("ordenes")
      .update({
        metodo_pago: "mercado_pago",
        referencia_pago: preferencia.id,
      })
      .eq("id", orden.id)
      .eq("usuario_id", user.id);

    return successResponse(res, {
      ordenId: orden.id,
      preferenceId: preferencia.id,
      externalReference: String(orden.id),
      payer: {
        email: user.email,
      },
      items: itemsMercadoPago,
      total: Number(orden.total),
      estado: orden.estado,
      initPoint: preferencia.init_point || preferencia.sandbox_init_point,
      sandboxInitPoint: preferencia.sandbox_init_point,
      productionInitPoint: preferencia.init_point,
      paymentUrl: preferencia.init_point || preferencia.sandbox_init_point,
      webhookUrl: `${appUrl}/api/webhooks/mercado-pago`,
      message: "Preferencia creada. Redirigiendo a Mercado Pago.",
    });
  } catch (error) {
    return errorResponse(res, 500, error.message || "Error al preparar pago", "PAYMENT_ERROR");
  }
}
