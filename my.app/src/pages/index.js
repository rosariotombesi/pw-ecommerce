import ProductCard from "../components/ProductCard";

function HomePage({ productosFiltrados, agregarAlCarrito }) {
  return (
    <>
      <section id="inicio" className="hero" aria-labelledby="bienvenida">
        <img
          src="/Imagen principal.jpg"
          alt="Plantas decorativas para el hogar"
          className="hero-image"
        />

        <div className="hero-text">
          <h1 id="bienvenida">Plantas y macetas para tu hogar</h1>
          <p>
            Descubri una seleccion de plantas y macetas para transformar tus
            espacios.
          </p>
          <a className="catalog-link" href="#productos">
            Ver catalogo
          </a>
        </div>
      </section>

      <section
        id="productos"
        className="products-section"
        aria-labelledby="titulo-productos"
      >
        <div className="section-heading">
          <h2 id="titulo-productos">Productos destacados</h2>
          <p>Selecciona un producto para ver su ficha completa.</p>
        </div>

        {productosFiltrados.length > 0 ? (
          <div className="products-grid">
            {productosFiltrados.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                onAgregar={agregarAlCarrito}
              />
            ))}
          </div>
        ) : (
          <p className="empty-state">
            No encontramos productos que coincidan con tu busqueda.
          </p>
        )}
      </section>
    </>
  );
}

export default HomePage;
