import { crearSupabaseAdmin, errorResponse, successResponse } from "../../../lib/apiHelpers";
import { obtenerPagoMercadoPago, tieneMercadoPagoConfigurado } from "../../../lib/mercadoPago";

function obtenerOrdenId(pago, body) {
  return (
    pago.external_reference ||
    pago.metadata?.orden_id ||
    body?.orden_id ||
    null
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return errorResponse(res, 405, "Metodo no permitido", "METHOD_NOT_ALLOWED");
  }

  try {
    if (!tieneMercadoPagoConfigurado()) {
      return errorResponse(
        res,
        500,
        "Falta configurar MERCADO_PAGO_ACCESS_TOKEN",
        "MERCADO_PAGO_NOT_CONFIGURED"
      );
    }

    const paymentId = req.body?.payment_id;

    if (!paymentId) {
      return errorResponse(res, 400, "Falta payment_id", "MISSING_PAYMENT_ID");
    }

    const pago = await obtenerPagoMercadoPago(paymentId);
    const ordenId = obtenerOrdenId(pago, req.body);

    if (!ordenId) {
      return errorResponse(res, 400, "Pago sin orden asociada", "MISSING_ORDER_ID");
    }

    if (pago.status !== "approved") {
      return successResponse(res, {
        paymentId,
        ordenId: Number(ordenId),
        estadoPago: pago.status,
        ordenActualizada: false,
      });
    }

    const supabase = crearSupabaseAdmin(req);
    const { data: orden, error } = await supabase
      .from("ordenes")
      .update({
        estado: "pagada",
        metodo_pago: "mercado_pago",
        referencia_pago: String(paymentId),
        pagado_en: new Date().toISOString(),
      })
      .eq("id", Number(ordenId))
      .select("*")
      .single();

    if (error) {
      return errorResponse(res, 500, error.message, "ORDER_UPDATE_ERROR");
    }

    return successResponse(res, {
      paymentId,
      ordenId: orden.id,
      estadoPago: pago.status,
      ordenActualizada: true,
    });
  } catch (error) {
    return errorResponse(
      res,
      500,
      error.message || "Error al confirmar pago",
      "PAYMENT_CONFIRMATION_ERROR"
    );
  }
}
