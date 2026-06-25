import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi } from "../../lib/apiClient";

function OrdenesPage() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarOrdenes = async () => {
      try {
        const data = await fetchApi("/api/ordenes");
        setOrdenes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarOrdenes();
  }, []);

  if (cargando) {
    return <p className="empty-state">Cargando ordenes...</p>;
  }

  if (error) {
    return <p className="empty-state">{error}</p>;
  }

  return (
    <section className="orders-page" aria-labelledby="ordenes-title">
      <div className="section-heading">
        <h1 id="ordenes-title">Mis ordenes</h1>
        <p>Historial de compras realizadas desde tu cuenta.</p>
      </div>

      {ordenes.length > 0 ? (
        <div className="orders-list">
          {ordenes.map((orden) => (
            <article className="order-card" key={orden.id}>
              <div>
                <h2>Orden #{orden.id}</h2>
                <p>Estado: {orden.estado}</p>
                {orden.fecha ? (
                  <p>
                    Fecha:{" "}
                    {new Date(orden.fecha).toLocaleDateString("es-AR")}
                  </p>
                ) : null}
              </div>
              <div className="order-card-actions">
                <strong>${orden.total.toLocaleString("es-AR")}</strong>
                <Link href={`/ordenes/${orden.id}`}>Ver detalle</Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>Todavia no tenes ordenes.</p>
          <Link href="/#productos">Volver al catalogo</Link>
        </div>
      )}
    </section>
  );
}

export default OrdenesPage;
