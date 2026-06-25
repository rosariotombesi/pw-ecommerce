import Link from "next/link";
import { useRouter } from "next/router";

function valorValido(valor) {
  return valor && valor !== "null" ? valor : null;
}

function PagoFallidoPage() {
  const router = useRouter();
  const ordenId = valorValido(router.query.external_reference) || valorValido(router.query.orden_id);
  const paymentId = valorValido(router.query.payment_id) || valorValido(router.query.collection_id);
  const estado = valorValido(router.query.status) || valorValido(router.query.collection_status) || "rejected";

  return (
    <section className="payment-status payment-status-failure">
      <h1>Pago fallido</h1>
      <p>
        Mercado Pago no pudo aprobar la operacion. Puede ser por fondos
        insuficientes, tarjeta rechazada o cancelacion del pago.
      </p>
      <div className="payment-status-data">
        {paymentId ? <p>Pago: {paymentId}</p> : <p>Pago no aprobado</p>}
        {ordenId ? <p>Orden: #{ordenId}</p> : null}
        <p>Estado: {estado}</p>
      </div>
      <div className="payment-status-actions">
        {ordenId ? <Link href={`/checkout?ordenId=${ordenId}`}>Reintentar pago</Link> : null}
        <Link href="/ordenes">Volver a mis ordenes</Link>
      </div>
    </section>
  );
}

export default PagoFallidoPage;
