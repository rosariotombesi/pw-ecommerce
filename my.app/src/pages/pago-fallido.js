import Link from "next/link";
import { useRouter } from "next/router";

function PagoFallidoPage() {
  const router = useRouter();
  const ordenId = router.query.external_reference || router.query.orden_id;

  return (
    <section className="payment-status payment-status-failure">
      <h1>Pago fallido</h1>
      <p>
        Mercado Pago no pudo aprobar la operacion. Puede ser por fondos
        insuficientes, tarjeta rechazada o cancelacion del pago.
      </p>
      <div className="payment-status-data">
        {router.query.payment_id ? <p>Pago: {router.query.payment_id}</p> : null}
        {ordenId ? <p>Orden: #{ordenId}</p> : null}
        {router.query.status ? <p>Estado: {router.query.status}</p> : null}
      </div>
      <div className="payment-status-actions">
        {ordenId ? <Link href={`/checkout?ordenId=${ordenId}`}>Reintentar pago</Link> : null}
        <Link href="/ordenes">Volver a mis ordenes</Link>
      </div>
    </section>
  );
}

export default PagoFallidoPage;
