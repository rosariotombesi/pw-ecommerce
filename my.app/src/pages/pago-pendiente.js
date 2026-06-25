import Link from "next/link";
import { useRouter } from "next/router";

function PagoPendientePage() {
  const router = useRouter();
  const ordenId = router.query.external_reference || router.query.orden_id;

  return (
    <section className="payment-status payment-status-pending">
      <h1>Pago pendiente</h1>
      <p>
        El pago quedo en proceso de confirmacion. Algunas operaciones pueden
        tardar en validarse.
      </p>
      <div className="payment-status-data">
        {router.query.payment_id ? <p>Pago: {router.query.payment_id}</p> : null}
        {ordenId ? <p>Orden: #{ordenId}</p> : null}
        {router.query.status ? <p>Estado: {router.query.status}</p> : null}
      </div>
      <div className="payment-status-actions">
        {ordenId ? <Link href={`/ordenes/${ordenId}`}>Ver orden</Link> : null}
        <Link href="/ordenes">Volver a mis ordenes</Link>
      </div>
    </section>
  );
}

export default PagoPendientePage;
