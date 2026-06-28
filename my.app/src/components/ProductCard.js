import Link from "next/link";

function ProductCard({ producto, onAgregar }) {
  const esMaceta = producto.categoria?.toLowerCase().includes("maceta");
  const esMacetaMinimal = producto.nombre?.toLowerCase().includes("minimal");
  const esPlanta = producto.categoria?.toLowerCase().includes("planta");
  const nombreClase = producto.nombre
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return (
    <article
      className={`product-card${esMaceta ? " product-card--maceta" : ""}${
        esMacetaMinimal ? " product-card--maceta-minimal" : ""
      }${esPlanta ? " product-card--planta" : ""}${
        nombreClase ? ` product-card--${nombreClase}` : ""
      }`}
    >
      <Link
        href={`/producto/${producto.id}`}
        className="product-card-link"
        aria-label={`Ver más información de ${producto.nombre}`}
      >
        <figure>
          <img src={producto.imagen} alt={producto.alt} />
        </figure>
        {producto.categoria ? (
          <p className="product-card-category">{producto.categoria}</p>
        ) : null}
        <h3>{producto.nombre}</h3>
        <p className="price">
          {producto.variantes?.length ? "Desde " : ""}$
          {producto.precio.toLocaleString("es-AR")}
        </p>
        <p>{producto.descripcion}</p>
        <span className="view-more">Ver más información</span>
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
