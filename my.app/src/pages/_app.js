import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import AppLayout from "../components/AppLayout";
import { supabase } from "../lib/supabase";
import { fetchApi } from "../lib/apiClient";
import "../index.css";
import "../App.css";

function MyApp({ Component, pageProps }) {
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

  const agregarAlCarrito = async (producto) => {
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
          cantidad: 1,
        }),
      });
      setCarrito(carritoApi);
    } catch (error) {
      console.error("Error al agregar al carrito:", error.message);
      alert(error.message);
    }
  };

  const eliminarDelCarrito = async (productoId) => {
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
          producto_id: productoId,
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
      return;
    }

    setOrdenProcesando(true);

    try {
      const orden = await fetchApi("/api/ordenes", {
        method: "POST",
      });
      setCarrito([]);
      await cargarProductos();
      alert(`Orden #${orden.id} creada correctamente.`);
      router.push("/ordenes");
    } catch (error) {
      console.error("Error al crear orden:", error.message);
      alert(error.message);
    } finally {
      setOrdenProcesando(false);
    }
  };

  return (
    <AppLayout
      busqueda={busqueda}
      setBusqueda={setBusqueda}
      manejarSubmit={manejarSubmit}
      carrito={carrito}
      eliminarDelCarrito={eliminarDelCarrito}
      crearOrden={crearOrden}
      ordenProcesando={ordenProcesando}
    >
      <Component
        {...pageProps}
        productos={productos}
        productosCargando={productosCargando}
        productosFiltrados={productosFiltrados}
        agregarAlCarrito={agregarAlCarrito}
      />
    </AppLayout>
  );
}

export default MyApp;
