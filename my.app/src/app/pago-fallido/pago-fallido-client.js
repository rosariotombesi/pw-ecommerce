"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

function valorValido(valor) {
  return valor && valor !== "null" ? valor : null;
}

export default function PagoFallidoClient() {
  const searchParams = useSearchParams();
  const ordenId =
    valorValido(searchParams.get("external_reference")) ||
    valorValido(searchParams.get("orden_id"));
  const paymentId =
    valorValido(searchParams.get("payment_id")) ||
    valorValido(searchParams.get("collection_id"));
  const estado =
    valorValido(searchParams.get("status")) ||
    valorValido(searchParams.get("collection_status")) ||
    "rejected";

  return (
    <section className="payment-status payment-status-failure">
      <h1>Pago fallido</h1>
      <p>
        Mercado Pago no pudo aprobar la operación. Puede ser por fondos
        insuficientes, tarjeta rechazada o cancelación del pago.
      </p>
      <div className="payment-status-data">
        {paymentId ? <p>Pago: {paymentId}</p> : <p>Pago no aprobado</p>}
        {ordenId ? <p>Orden: #{ordenId}</p> : null}
        <p>Estado: {estado}</p>
      </div>
      <div className="payment-status-actions">
        {ordenId ? (
          <Link href={`/checkout?ordenId=${ordenId}`}>Reintentar pago</Link>
        ) : null}
        <Link href="/ordenes">Volver a mis órdenes</Link>
      </div>
    </section>
  );
}
