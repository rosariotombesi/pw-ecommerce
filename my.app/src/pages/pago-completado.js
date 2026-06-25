import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function PagoCompletadoPage() {
  const router = useRouter();
  const ordenId = router.query.external_reference || router.query.orden_id;
  const [estado, setEstado] = useState("confirmando");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const paymentId = router.query.payment_id;

    if (!paymentId) {
      setEstado("sin-payment-id");
      return;
    }

    const confirmarPago = async () => {
      try {
        const response = await fetch("/api/pagos/confirmar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payment_id: paymentId,
            orden_id: ordenId,
          }),
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "No se pudo confirmar el pago");
        }

        if (result.data?.ordenActualizada) {
          setEstado("confirmado");
          setMensaje("La orden fue marcada como pagada.");
        } else {
          setEstado("pendiente");
          setMensaje(`Mercado Pago informo estado: ${result.data?.estadoPago}`);
        }
      } catch (error) {
        setEstado("error");
        setMensaje(error.message);
      }
    };

    confirmarPago();
  }, [router.isReady, router.query.payment_id, ordenId]);

  return (
    <section className="payment-status payment-status-success">
      <h1>Pago completado</h1>
      <p>Mercado Pago informo que la operacion fue aprobada.</p>
      {estado === "confirmando" ? <p>Confirmando orden...</p> : null}
      {mensaje ? <p>{mensaje}</p> : null}
      <div className="payment-status-data">
        {router.query.payment_id ? <p>Pago: {router.query.payment_id}</p> : null}
        {ordenId ? <p>Orden: #{ordenId}</p> : null}
        {router.query.status ? <p>Estado: {router.query.status}</p> : null}
      </div>
      <div className="payment-status-actions">
        {ordenId ? <Link href={`/ordenes/${ordenId}`}>Ver orden</Link> : null}
        <Link href="/#productos">Seguir comprando</Link>
      </div>
    </section>
  );
}

export default PagoCompletadoPage;
