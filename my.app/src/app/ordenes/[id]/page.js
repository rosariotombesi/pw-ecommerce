import OrdenDetalle from "./orden-detalle";

export default async function OrdenDetallePage({ params }) {
  const { id } = await params;

  return <OrdenDetalle id={id} />;
}
