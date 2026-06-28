"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

function valorValido(valor) {
  return valor && valor !== "null" ? valor : null;
}

export default function PagoPendienteClient() {
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
    "in_process";

  return (
    <section className="payment-status payment-status-pending">
      <h1>Pago pendiente</h1>
      <p>
        El pago quedó en proceso de confirmación. Algunas operaciones pueden
        tardar en validarse.
      </p>
      <div className="payment-status-data">
        {paymentId ? <p>Pago: {paymentId}</p> : null}
        {ordenId ? <p>Orden: #{ordenId}</p> : null}
        <p>Estado: {estado}</p>
      </div>
      <div className="payment-status-actions">
        {ordenId ? <Link href={`/ordenes/${ordenId}`}>Ver orden</Link> : null}
        <Link href="/ordenes">Volver a mis órdenes</Link>
      </div>
    </section>
  );
}
