import { useEffect, useState } from "react";
import { fetchApi } from "../../lib/apiClient";

function AdminVentasPage() {
  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [actualizando, setActualizando] = useState(null);

  const estados = [
    "pendiente",
    "pagada",
    "confirmada",
    "enviada",
    "entregada",
    "cancelada",
  ];

  useEffect(() => {
    const cargarReporte = async () => {
      try {
        const data = await fetchApi("/api/admin/ventas");
        setReporte(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarReporte();
  }, []);

  const actualizarEstado = async (ordenId, estado) => {
    setActualizando(ordenId);
    setError("");

    try {
      const ordenActualizada = await fetchApi(`/api/ordenes/${ordenId}`, {
        method: "PATCH",
        body: JSON.stringify({ estado }),
      });

      setReporte((prevReporte) => ({
        ...prevReporte,
        ordenes: prevReporte.ordenes.map((orden) =>
          orden.id === ordenActualizada.id
            ? { ...orden, estado: ordenActualizada.estado }
            : orden
        ),
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setActualizando(null);
    }
  };

  if (cargando) {
    return <p className="empty-state">Cargando reporte...</p>;
  }

  if (error) {
    return <p className="empty-state">{error}</p>;
  }

  return (
    <section className="sales-report" aria-labelledby="ventas-title">
      <div className="section-heading">
        <h1 id="ventas-title">Reporte de ventas</h1>
        <p>Resumen administrativo de ordenes y productos vendidos.</p>
      </div>

      <div className="report-summary">
        <article>
          <span>Ordenes historicas</span>
          <strong>{reporte.totalOrdenes}</strong>
        </article>
        <article>
          <span>Total historico</span>
          <strong>${reporte.totalVendido.toLocaleString("es-AR")}</strong>
        </article>
        <article>
          <span>Ordenes con detalle</span>
          <strong>{reporte.ordenesConDetalle}</strong>
        </article>
        <article>
          <span>Total con detalle</span>
          <strong>${reporte.totalConDetalle.toLocaleString("es-AR")}</strong>
        </article>
      </div>

      <section aria-labelledby="productos-vendidos">
        <h2 id="productos-vendidos">Productos vendidos</h2>
        {reporte.totalOrdenes > reporte.ordenesConDetalle ? (
          <p className="report-note">
            El detalle por producto solo incluye ordenes creadas despues de
            agregar la tabla order_items.
          </p>
        ) : null}
        {reporte.productos.length > 0 ? (
          <div className="report-list">
            {reporte.productos.map((producto) => (
              <article className="report-row" key={producto.nombre}>
                <div>
                  <h3>{producto.nombre}</h3>
                  <p>Cantidad vendida: {producto.cantidad}</p>
                </div>
                <strong>${producto.total.toLocaleString("es-AR")}</strong>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-state">Todavia no hay productos vendidos.</p>
        )}
      </section>

      <section aria-labelledby="ordenes-admin">
        <h2 id="ordenes-admin">Ordenes</h2>
        <div className="report-list">
          {reporte.ordenes.map((orden) => (
            <article className="report-row" key={orden.id}>
              <div>
                <h3>Orden #{orden.id}</h3>
                <p>Total: ${orden.total.toLocaleString("es-AR")}</p>
                {orden.fecha ? (
                  <p>
                    Fecha: {new Date(orden.fecha).toLocaleDateString("es-AR")}
                  </p>
                ) : null}
              </div>
              <label className="status-control">
                Estado
                <select
                  value={orden.estado}
                  disabled={actualizando === orden.id}
                  onChange={(event) =>
                    actualizarEstado(orden.id, event.target.value)
                  }
                >
                  {estados.map((estado) => (
                    <option value={estado} key={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </label>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default AdminVentasPage;
