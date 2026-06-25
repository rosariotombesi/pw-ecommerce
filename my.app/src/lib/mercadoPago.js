import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

function getAccessToken() {
  return (
    process.env.MERCADO_PAGO_ACCESS_TOKEN ||
    process.env.MERCADOPAGO_ACCESS_TOKEN
  );
}

export function crearMercadoPagoCliente() {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Falta configurar MERCADO_PAGO_ACCESS_TOKEN");
  }

  return new MercadoPagoConfig({
    accessToken,
  });
}

export function getAppUrl(req) {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  const origin = req.headers.origin;

  if (origin) {
    return origin.replace(/\/$/, "");
  }

  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host || "localhost:3000";

  return `${protocol}://${host}`.replace(/\/$/, "");
}

export function tieneMercadoPagoConfigurado() {
  return Boolean(getAccessToken());
}

export async function crearPreferenciaMercadoPago(preferencia) {
  const client = crearMercadoPagoCliente();
  const preference = new Preference(client);

  return preference.create({
    body: preferencia,
  });
}

export async function obtenerPagoMercadoPago(paymentId) {
  const client = crearMercadoPagoCliente();
  const payment = new Payment(client);

  return payment.get({
    id: paymentId,
  });
}
