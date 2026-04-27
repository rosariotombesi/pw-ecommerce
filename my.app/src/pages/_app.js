import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/AppLayout";
import productos from "../data/productos";
import "../index.css";
import "../App.css";

const CARRITO_STORAGE_KEY = "verdant_carrito";

function MyApp({ Component, pageProps }) {
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const carritoGuardado = window.localStorage.getItem(CARRITO_STORAGE_KEY);

    if (!carritoGuardado) {
      return;
    }

    try {
      setCarrito(JSON.parse(carritoGuardado));
    } catch {
      setCarrito([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify(carrito));
  }, [carrito]);

  const productosFiltrados = useMemo(() => {
    const textoBusqueda = busqueda.toLowerCase().trim();

    return productos.filter((producto) => {
      return (
        producto.nombre.toLowerCase().includes(textoBusqueda) ||
        producto.descripcion.toLowerCase().includes(textoBusqueda) ||
        producto.categoria.toLowerCase().includes(textoBusqueda)
      );
    });
  }, [busqueda]);

  const manejarSubmit = (event) => {
    event.preventDefault();
  };

  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      const productoExistente = prevCarrito.find(
        (item) => item.id === producto.id
      );

      if (productoExistente) {
        return prevCarrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...prevCarrito, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito((prevCarrito) =>
      prevCarrito
        .map((item) =>
          item.id === productoId
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  return (
    <AppLayout
      busqueda={busqueda}
      setBusqueda={setBusqueda}
      manejarSubmit={manejarSubmit}
      carrito={carrito}
      eliminarDelCarrito={eliminarDelCarrito}
    >
      <Component
        {...pageProps}
        productos={productos}
        productosFiltrados={productosFiltrados}
        agregarAlCarrito={agregarAlCarrito}
      />
    </AppLayout>
  );
}

export default MyApp;
