export function adaptarProducto(producto) {
  return {
    id: producto.id,
    nombre: producto.nombre,
    precio: Number(producto.precio),
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
  };
}
