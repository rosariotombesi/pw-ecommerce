import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { fetchApi } from "../../lib/apiClient";

function OrdenDetallePage() {
  const router = useRouter();
  const [orden, setOrden] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const cargarOrden = async () => {
      try {
        const data = await fetchApi(`/api/ordenes/${router.query.id}`);
        setOrden(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarOrden();
  }, [router.isReady, router.query.id]);

  if (cargando) {
    return <p className="empty-state">Cargando detalle...</p>;
  }

  if (error) {
    return <p className="empty-state">{error}</p>;
  }

  if (!orden) {
    return <p className="empty-state">No encontramos la orden.</p>;
  }

  return (
    <section className="order-detail" aria-labelledby="orden-title">
      <Link href="/ordenes" className="back-link">
        Volver a mis ordenes
      </Link>

      <div className="section-heading">
        <h1 id="orden-title">Orden #{orden.id}</h1>
        <p>Estado: {orden.estado}</p>
        {orden.fecha ? (
          <p>Fecha: {new Date(orden.fecha).toLocaleDateString("es-AR")}</p>
        ) : null}
      </div>

      {orden.items.length > 0 ? (
        <div className="order-items">
          {orden.items.map((item) => (
            <article className="order-item" key={item.id}>
              <div>
                <h2>{item.nombre}</h2>
                <p>Cantidad: {item.cantidad}</p>
                <p>Precio unitario: ${item.precio.toLocaleString("es-AR")}</p>
              </div>
              <strong>${item.subtotal.toLocaleString("es-AR")}</strong>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-state">
          Esta orden no tiene items guardados. Las ordenes anteriores a la tabla
          order_items pueden verse sin detalle.
        </p>
      )}

      <p className="order-detail-total">
        Total: ${orden.total.toLocaleString("es-AR")}
      </p>

      {orden.estado === "pendiente" ? (
        <div className="detail-actions">
          <Link href={`/checkout?ordenId=${orden.id}`} className="checkout-link">
            Ir a checkout
          </Link>
        </div>
      ) : null}
    </section>
  );
}

export default OrdenDetallePage;
