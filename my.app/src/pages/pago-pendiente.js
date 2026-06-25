import Link from "next/link";
import { useRouter } from "next/router";

function valorValido(valor) {
  return valor && valor !== "null" ? valor : null;
}

function PagoPendientePage() {
  const router = useRouter();
  const ordenId = valorValido(router.query.external_reference) || valorValido(router.query.orden_id);
  const paymentId = valorValido(router.query.payment_id) || valorValido(router.query.collection_id);
  const estado = valorValido(router.query.status) || valorValido(router.query.collection_status) || "in_process";

  return (
    <section className="payment-status payment-status-pending">
      <h1>Pago pendiente</h1>
      <p>
        El pago quedo en proceso de confirmacion. Algunas operaciones pueden
        tardar en validarse.
      </p>
      <div className="payment-status-data">
        {paymentId ? <p>Pago: {paymentId}</p> : null}
        {ordenId ? <p>Orden: #{ordenId}</p> : null}
        <p>Estado: {estado}</p>
      </div>
      <div className="payment-status-actions">
        {ordenId ? <Link href={`/ordenes/${ordenId}`}>Ver orden</Link> : null}
        <Link href="/ordenes">Volver a mis ordenes</Link>
      </div>
    </section>
  );
}

export default PagoPendientePage;
