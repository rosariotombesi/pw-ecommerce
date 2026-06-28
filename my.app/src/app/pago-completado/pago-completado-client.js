"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PagoCompletadoClient() {
  const searchParams = useSearchParams();
  const ordenId =
    searchParams.get("external_reference") || searchParams.get("orden_id");
  const paymentId = searchParams.get("payment_id");
  const status = searchParams.get("status");
  const [estado, setEstado] = useState("confirmando");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
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
          setMensaje(`Mercado Pago informó estado: ${result.data?.estadoPago}`);
        }
      } catch (error) {
        setEstado("error");
        setMensaje(error.message);
      }
    };

    confirmarPago();
  }, [paymentId, ordenId]);

  return (
    <section className="payment-status payment-status-success">
      <h1>Pago completado</h1>
      <p>Mercado Pago informó que la operación fue aprobada.</p>
      {estado === "confirmando" ? <p>Confirmando orden...</p> : null}
      {mensaje ? <p>{mensaje}</p> : null}
      <div className="payment-status-data">
        {paymentId ? <p>Pago: {paymentId}</p> : null}
        {ordenId ? <p>Orden: #{ordenId}</p> : null}
        {status ? <p>Estado: {status}</p> : null}
      </div>
      <div className="payment-status-actions">
        {ordenId ? <Link href={`/ordenes/${ordenId}`}>Ver orden</Link> : null}
        <Link href="/#productos">Seguir comprando</Link>
      </div>
    </section>
  );
}
