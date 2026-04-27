import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import productos from "../../data/productos";

function ProductoPage({ agregarAlCarrito }) {
  const router = useRouter();
  const producto = productos.find((item) => item.id === router.query.id);

  if (!producto) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{producto.nombre} | Verdant</title>
      </Head>

      <section className="product-detail" aria-labelledby="detalle-producto">
        <Link href="/" className="back-link">
          Volver a productos
        </Link>

        <div className="product-detail-layout">
          <img
            src={producto.imagen}
            alt={producto.alt}
            className="product-detail-image"
          />

          <div className="product-detail-content">
            <p className="detail-category">{producto.categoria}</p>
            <h1 id="detalle-producto">{producto.nombre}</h1>
            <p className="price detail-price">
              ${producto.precio.toLocaleString("es-AR")}
            </p>
            <p>{producto.descripcionLarga}</p>

            <div className="detail-specs">
              <p>
                <strong>Luz:</strong> {producto.luz}
              </p>
              <p>
                <strong>Riego:</strong> {producto.riego}
              </p>
              <p>
                <strong>Tamanio:</strong> {producto.tamanio}
              </p>
              <p>
                <strong>Estado:</strong> {producto.stock}
              </p>
            </div>

            <div className="detail-actions">
              <button type="button" onClick={() => agregarAlCarrito(producto)}>
                Agregar al carrito
              </button>
              <button type="button" className="secondary-button">
                Comprar ahora
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductoPage;
