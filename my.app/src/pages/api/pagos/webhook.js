import { crearSupabaseAdmin, errorResponse, successResponse } from "../../../lib/apiHelpers";
import { obtenerPagoMercadoPago, tieneMercadoPagoConfigurado } from "../../../lib/mercadoPago";

function obtenerPaymentId(req) {
  return (
    req.query["data.id"] ||
    req.query.id ||
    req.query.payment_id ||
    req.body?.data?.id ||
    req.body?.id ||
    req.body?.payment_id ||
    null
  );
}

function obtenerOrdenIdDesdePago(pago) {
  return pago.external_reference || pago.metadata?.orden_id || null;
}

export default async function handler(req, res) {
  if (!["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST");
    return errorResponse(res, 405, "Metodo no permitido", "METHOD_NOT_ALLOWED");
  }

  if (req.method === "GET") {
    return successResponse(res, {
      ok: true,
      message: "Webhook de Mercado Pago activo",
    });
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

    const paymentId = obtenerPaymentId(req);

    if (!paymentId) {
      return successResponse(res, {
        received: true,
        message: "Notificacion recibida sin payment_id",
      });
    }

    const pago = await obtenerPagoMercadoPago(paymentId);
    const ordenId = obtenerOrdenIdDesdePago(pago);

    if (!ordenId) {
      return successResponse(res, {
        received: true,
        paymentId,
        message: "Pago sin external_reference",
      });
    }

    if (pago.status === "approved") {
      const supabase = crearSupabaseAdmin(req);

      await supabase
        .from("ordenes")
        .update({
          estado: "pagada",
          metodo_pago: "mercado_pago",
          referencia_pago: String(paymentId),
          pagado_en: new Date().toISOString(),
        })
        .eq("id", Number(ordenId));
    }

    return successResponse(res, {
      received: true,
      paymentId,
      ordenId: Number(ordenId),
      status: pago.status,
    });
  } catch (error) {
    return errorResponse(
      res,
      500,
      error.message || "Error al procesar webhook",
      "WEBHOOK_ERROR"
    );
  }
}
