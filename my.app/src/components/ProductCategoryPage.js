"use client";

import ProductCard from "./ProductCard";
import { useAppContext } from "../app/AppProviders";

function ProductCategoryPage({
  titulo,
  bajada,
  categoria,
  emptyMessage,
  eyebrow,
}) {
  const { productosCargando, productosFiltrados, agregarAlCarrito } =
    useAppContext();

  const productos = productosFiltrados.filter((producto) =>
    producto.categoria?.toLowerCase().includes(categoria)
  );

  return (
    <section className="catalog-page" aria-labelledby="catalog-title">
      <div className="catalog-page-heading">
        <p>{eyebrow}</p>
        <h1 id="catalog-title">{titulo}</h1>
        <span>{bajada}</span>
      </div>

      {productosCargando ? (
        <p className="empty-state">Cargando productos...</p>
      ) : productos.length > 0 ? (
        <div className="products-grid catalog-grid">
          {productos.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              onAgregar={agregarAlCarrito}
            />
          ))}
        </div>
      ) : (
        <p className="empty-state">{emptyMessage}</p>
      )}
    </section>
  );
}

export default ProductCategoryPage;
