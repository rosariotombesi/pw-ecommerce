import ProductoDetalle from "./producto-detalle";

export default async function ProductoPage({ params }) {
  const { id } = await params;

  return <ProductoDetalle id={id} />;
}
