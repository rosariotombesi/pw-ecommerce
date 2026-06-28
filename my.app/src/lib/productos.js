export function adaptarProducto(producto) {
  const variantes = (producto.producto_variantes || []).map((variante) => ({
    id: variante.id,
    nombre: variante.nombre,
    color: variante.color,
    tamanio: variante.tamanio,
    precio: Number(variante.precio),
    stock: Number(variante.stock),
    imagen: variante.imagen_url,
    alt: variante.alt,
    estado: variante.estado,
  }));
  const precioMinimo = variantes.length
    ? Math.min(...variantes.map((variante) => variante.precio))
    : Number(producto.precio);

  return {
    id: producto.id,
    nombre: producto.nombre,
    precio: precioMinimo,
    precioBase: Number(producto.precio),
    descripcion: producto.descripcion,
    descripcionLarga: producto.descripcion_larga,
    imagen: producto.imagen_url,
    alt: producto.alt,
    categoria: producto.categoria,
    luz: producto.luz,
    riego: producto.riego,
    tamanio: producto.tamanio,
    stock: Number(producto.stock),
    estado: producto.estado,
    variantes,
  };
}
