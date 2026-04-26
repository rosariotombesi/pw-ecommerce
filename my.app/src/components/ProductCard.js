import { Link } from "react-router-dom";

function ProductCard({ producto, onAgregar }) {
  return (
    <article className="product-card">
      <Link
        to={`/producto/${producto.id}`}
        className="product-card-link"
        aria-label={`Ver mas informacion de ${producto.nombre}`}
      >
        <figure>
          <img src={producto.imagen} alt={producto.alt} />
        </figure>
        <h3>{producto.nombre}</h3>
        <p className="price">${producto.precio.toLocaleString("es-AR")}</p>
        <p>{producto.descripcion}</p>
        <span className="view-more">Ver mas informacion</span>
      </Link>

      <button
        type="button"
        onClick={() => onAgregar(producto)}
        aria-label={`Agregar ${producto.nombre} al carrito`}
      >
        Agregar al carrito
      </button>
    </article>
  );
}

export default ProductCard;
