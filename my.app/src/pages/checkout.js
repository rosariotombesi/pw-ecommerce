import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { fetchApi } from "../lib/apiClient";

function CheckoutPage() {
  const router = useRouter();
  const [orden, setOrden] = useState(null);
  const [preferencia, setPreferencia] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const cargarOrden = async () => {
      try {
        const ordenId = router.query.ordenId || router.query.orden_id;
        const data = await fetchApi(`/api/ordenes/${ordenId}`);
        setOrden(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarOrden();
  }, [router.isReady, router.query.ordenId, router.query.orden_id]);

  const prepararPago = async () => {
    setProcesando(true);
    setError("");
    setPreferencia(null);

    try {
      const data = await fetchApi("/api/pagos/crear-preferencia", {
        method: "POST",
        body: JSON.stringify({
          orden_id: orden.id,
        }),
      });
      setPreferencia(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) {
    return <p className="empty-state">Cargando checkout...</p>;
  }

  if (error && !orden) {
    return <p className="empty-state">{error}</p>;
  }

  if (!orden) {
    return <p className="empty-state">No encontramos la orden.</p>;
  }

  return (
    <section className="checkout-page" aria-labelledby="checkout-title">
      <Link href={`/ordenes/${orden.id}`} className="back-link">
        Volver a la orden
      </Link>

      <div className="section-heading">
        <h1 id="checkout-title">Checkout</h1>
        <p>Orden #{orden.id} pendiente de pago.</p>
      </div>

      <div className="checkout-layout">
        <section className="checkout-summary" aria-labelledby="resumen-title">
          <h2 id="resumen-title">Resumen</h2>
          {orden.items.map((item) => (
            <div className="checkout-row" key={item.id}>
              <span>
                {item.nombre} x{item.cantidad}
              </span>
              <strong>${item.subtotal.toLocaleString("es-AR")}</strong>
            </div>
          ))}
          <p className="checkout-total">
            Total: ${orden.total.toLocaleString("es-AR")}
          </p>
        </section>

        <section className="checkout-payment" aria-labelledby="pago-title">
          <h2 id="pago-title">Metodo de pago</h2>
          <div className="payment-methods">
            <label>
              <input type="radio" checked readOnly />
              Mercado Pago
            </label>
            <label className="payment-method-disabled">
              <input type="radio" disabled />
              Transferencia bancaria proximamente
            </label>
          </div>
          <p className="checkout-security">
            Tus datos se procesan mediante la pasarela segura de Mercado Pago
            en modo sandbox.
          </p>
          <button
            type="button"
            onClick={prepararPago}
            disabled={procesando || orden.estado !== "pendiente"}
          >
            {procesando ? "Redirigiendo..." : "Pagar con Mercado Pago"}
          </button>
          {error ? <p className="auth-message">{error}</p> : null}
          {preferencia ? (
            <div className="payment-result">
              <p>{preferencia.message}</p>
              <p>Preferencia: {preferencia.preferenceId}</p>
              <p>Referencia externa: {preferencia.externalReference}</p>
              <p>Pagador: {preferencia.payer.email}</p>
              {preferencia.paymentUrl ? (
                <a href={preferencia.paymentUrl}>Abrir Mercado Pago</a>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </section>
  );
}

export default CheckoutPage;
