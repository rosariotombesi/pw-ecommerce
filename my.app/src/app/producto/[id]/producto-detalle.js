"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../AppProviders";

export default function ProductoDetalle({ id }) {
  const { productos, productosCargando, agregarAlCarrito } = useAppContext();
  const producto = productos.find((item) => String(item.id) === String(id));
  const variantes = producto?.variantes || [];
  const tieneVariantes = variantes.length > 0;
  const colores = useMemo(
    () => [...new Set(variantes.map((variante) => variante.color).filter(Boolean))],
    [variantes]
  );
  const tamanios = useMemo(
    () => [...new Set(variantes.map((variante) => variante.tamanio).filter(Boolean))],
    [variantes]
  );
  const [colorSeleccionado, setColorSeleccionado] = useState("");
  const [tamanioSeleccionado, setTamanioSeleccionado] = useState("");

  useEffect(() => {
    if (!tieneVariantes) {
      setColorSeleccionado("");
      setTamanioSeleccionado("");
      return;
    }

    setColorSeleccionado(colores[0] ?? "");
    setTamanioSeleccionado(tamanios[0] ?? "");
  }, [producto?.id, tieneVariantes, colores, tamanios]);

  const varianteSeleccionada = useMemo(() => {
    if (!tieneVariantes) {
      return null;
    }

    return (
      variantes.find((variante) => {
        const coincideColor = colores.length
          ? variante.color === colorSeleccionado
          : true;
        const coincideTamanio = tamanios.length
          ? variante.tamanio === tamanioSeleccionado
          : true;

        return coincideColor && coincideTamanio;
      }) || variantes[0]
    );
  }, [
    colorSeleccionado,
    colores.length,
    tamanioSeleccionado,
    tamanios.length,
    tieneVariantes,
    variantes,
  ]);

  const imagenSeleccionada = useMemo(() => {
    return varianteSeleccionada?.imagen ?? producto?.imagen;
  }, [producto?.imagen, varianteSeleccionada]);

  const precioSeleccionado = varianteSeleccionada?.precio ?? producto?.precio;
  const stockSeleccionado = varianteSeleccionada?.stock ?? producto?.stock;

  if (!producto) {
    return (
      <p className="empty-state">
        {productosCargando
          ? "Cargando producto..."
          : "No encontramos el producto solicitado."}
      </p>
    );
  }

  return (
    <section className="product-detail" aria-labelledby="detalle-producto">
      <Link href="/" className="back-link">
        Volver a productos
      </Link>

      <div className="product-detail-layout">
        <img
          src={imagenSeleccionada}
          alt={producto.alt}
          className="product-detail-image"
        />

        <div className="product-detail-content">
          <p className="detail-category">{producto.categoria}</p>
          <h1 id="detalle-producto">{producto.nombre}</h1>
          <p className="price detail-price">
            ${precioSeleccionado.toLocaleString("es-AR")}
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
              <strong>Tamaño:</strong> {producto.tamanio}
            </p>
            <p>
              <strong>Estado:</strong> {producto.estado}
            </p>
            <p>
              <strong>Stock:</strong> {stockSeleccionado}
            </p>
          </div>

          {tieneVariantes ? (
            <div className="product-options">
              {colores.length ? (
                <div>
                  <p className="option-label">Color</p>
                  <div className="option-list">
                    {colores.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={
                          colorSeleccionado === color
                            ? "option-button selected"
                            : "option-button"
                        }
                        onClick={() => setColorSeleccionado(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {tamanios.length ? (
                <div>
                  <p className="option-label">Tamaño</p>
                  <div className="option-list">
                    {tamanios.map((tamanio) => (
                      <button
                        key={tamanio}
                        type="button"
                        className={
                          tamanioSeleccionado === tamanio
                            ? "option-button selected"
                            : "option-button"
                        }
                        onClick={() => setTamanioSeleccionado(tamanio)}
                      >
                        {tamanio}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {varianteSeleccionada ? (
                <div className="variant-summary">
                  <span>Variante seleccionada</span>
                  <strong>{varianteSeleccionada.nombre}</strong>
                  <p>
                    Precio: ${precioSeleccionado.toLocaleString("es-AR")} · Stock:{" "}
                    {stockSeleccionado}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="detail-actions">
            <button
              type="button"
              onClick={() =>
                agregarAlCarrito(producto, {
                  varianteId: varianteSeleccionada?.id,
                })
              }
              disabled={stockSeleccionado <= 0}
            >
              Agregar al carrito
            </button>
            <button type="button" className="secondary-button">
              Comprar ahora
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
