import ProductCategoryPage from "../../../components/ProductCategoryPage";

export default function PlantasPage() {
  return (
    <ProductCategoryPage
      eyebrow="Catálogo botánico"
      titulo="Todas las plantas"
      bajada="Variedades para interior, rincones luminosos y espacios tranquilos."
      categoria="planta"
      emptyMessage="No encontramos plantas para esta búsqueda."
    />
  );
}
