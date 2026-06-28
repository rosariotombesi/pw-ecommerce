"use client";

import ProductCard from "../components/ProductCard";
import { useAppContext } from "./AppProviders";

export default function HomePage() {
  const { productosCargando, productosFiltrados, agregarAlCarrito } =
    useAppContext();
  const plantas = productosFiltrados.filter((producto) =>
    producto.categoria?.toLowerCase().includes("planta")
  );
  const destacados = plantas.slice(0, 3);

  return (
    <>
      <section id="inicio" className="hero" aria-labelledby="bienvenida">
        <div className="hero-text">
          <p className="hero-eyebrow">Verdant Plant Store</p>
          <h1 id="bienvenida">Plantas y macetas para tu hogar</h1>
          <p>
            Descubrí una selección de plantas y macetas para transformar tus
            espacios.
          </p>
          <a className="catalog-link" href="/productos/plantas">
            Ver plantas
          </a>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="hero-art-panel hero-art-panel-blue">
            <img src="/Planta potus.jpg" alt="" />
          </div>
          <div className="hero-art-panel hero-art-panel-cream">
            <img src="/Planta monstera deliciosa.jpg" alt="" />
          </div>
        </div>
      </section>

      <section
        id="productos"
        className="products-section"
        aria-labelledby="titulo-productos"
      >
        <div className="section-heading">
          <h2 id="titulo-productos">Productos destacados</h2>
          <p>Seleccioná un producto para ver su ficha completa.</p>
        </div>

        {productosCargando ? (
          <p className="empty-state">Cargando productos...</p>
        ) : destacados.length > 0 ? (
          <div className="products-grid featured-grid">
            {destacados.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                onAgregar={agregarAlCarrito}
              />
            ))}
          </div>
        ) : (
          <p className="empty-state">
            No encontramos productos que coincidan con tu búsqueda.
          </p>
        )}
      </section>
    </>
  );
}
