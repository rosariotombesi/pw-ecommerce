"use client";

import { useEffect, useMemo, useState } from "react";
import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "../components/AppLayout";
import { supabase } from "../lib/supabase";
import { fetchApi } from "../lib/apiClient";

const AppContext = createContext(null);

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext debe usarse dentro de AppProviders");
  }

  return context;
}

export default function AppProviders({ children }) {
  const router = useRouter();

  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productosCargando, setProductosCargando] = useState(true);
  const [ordenProcesando, setOrdenProcesando] = useState(false);

  const cargarProductos = async () => {
    try {
      const productosApi = await fetchApi("/api/productos");
      setProductos(productosApi);
    } catch (error) {
      console.error("Error al cargar productos:", error.message);
    } finally {
      setProductosCargando(false);
    }
  };

  const cargarCarrito = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setCarrito([]);
      return;
    }

    try {
      const carritoApi = await fetchApi("/api/carrito");
      setCarrito(carritoApi);
    } catch (error) {
      console.error("Error al cargar carrito:", error.message);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarCarrito();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      cargarCarrito();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const productosFiltrados = useMemo(() => {
    const textoBusqueda = busqueda.toLowerCase().trim();

    return productos.filter((producto) => {
      return (
        producto.nombre.toLowerCase().includes(textoBusqueda) ||
        producto.descripcion.toLowerCase().includes(textoBusqueda) ||
        producto.categoria.toLowerCase().includes(textoBusqueda)
      );
    });
  }, [busqueda, productos]);

  const manejarSubmit = (event) => {
    event.preventDefault();
  };

  const agregarAlCarrito = async (producto, opciones = {}) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    try {
      const carritoApi = await fetchApi("/api/carrito", {
        method: "POST",
        body: JSON.stringify({
          producto_id: producto.id,
          producto_variante_id: opciones.varianteId ?? null,
          cantidad: 1,
        }),
      });
      setCarrito(carritoApi);
    } catch (error) {
      console.error("Error al agregar al carrito:", error.message);
      alert(error.message);
    }
  };

  const eliminarDelCarrito = async (itemCarrito) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    try {
      const carritoApi = await fetchApi("/api/carrito", {
          method: "DELETE",
          body: JSON.stringify({
          carrito_id: itemCarrito.cartItemId,
          producto_id: itemCarrito.id,
          producto_variante_id: itemCarrito.varianteId ?? null,
        }),
      });
      setCarrito(carritoApi);
    } catch (error) {
      console.error("Error al eliminar del carrito:", error.message);
      alert(error.message);
    }
  };

  const crearOrden = async () => {
    if (!carrito.length || ordenProcesando) {
      return false;
    }

    setOrdenProcesando(true);

    try {
      const orden = await fetchApi("/api/ordenes", {
        method: "POST",
      });
      setCarrito([]);
      await cargarProductos();
      router.push("/ordenes");
      return true;
    } catch (error) {
      console.error("Error al crear orden:", error.message);
      alert(error.message);
      return false;
    } finally {
      setOrdenProcesando(false);
    }
  };

  const value = {
    productos,
    productosCargando,
    productosFiltrados,
    agregarAlCarrito,
  };

  return (
    <AppContext.Provider value={value}>
      <AppLayout
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        manejarSubmit={manejarSubmit}
        carrito={carrito}
        eliminarDelCarrito={eliminarDelCarrito}
        crearOrden={crearOrden}
        ordenProcesando={ordenProcesando}
      >
        {children}
      </AppLayout>
    </AppContext.Provider>
  );
}
