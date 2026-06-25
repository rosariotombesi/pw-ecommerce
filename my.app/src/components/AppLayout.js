import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { fetchApi } from "../lib/apiClient";
import Carrito from "./Carrito";

function AppLayout({
  children,
  busqueda,
  setBusqueda,
  manejarSubmit,
  carrito,
  eliminarDelCarrito,
  crearOrden,
  ordenProcesando,
}) {
  const router = useRouter();
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      const { data } = await supabase.auth.getUser();
      setUsuario(data.user);

      if (data.user) {
        const perfil = await fetchApi("/api/auth/rol");
        setRol(perfil.rol);
      } else {
        setRol(null);
      }
    };

    cargarUsuario();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUsuario(session?.user ?? null);

        if (session?.user) {
          const perfil = await fetchApi("/api/auth/rol");
          setRol(perfil.rol);
        } else {
          setRol(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
    setRol(null);
    router.push("/");
  };

  const totalItems = useMemo(
    () => carrito.reduce((acc, item) => acc + item.cantidad, 0),
    [carrito]
  );

  const estaEnInicio = router.pathname === "/";
  const inicioHref = estaEnInicio ? "#inicio" : "/";
  const productosHref = estaEnInicio ? "#productos" : "/#productos";
  const contactoHref = estaEnInicio ? "#contacto" : "/#contacto";

  return (
    <div className="app-shell">
      <Head>
        <title>Verdant | Plantas y Deco</title>
        <meta
          name="description"
          content="Verdant, tienda de plantas y macetas para transformar tus espacios."
        />
        <link rel="icon" type="image/png" href="/Logo verdant .png" />
        <link rel="apple-touch-icon" href="/Logo verdant .png" />
      </Head>

      <header className="site-header">
        <div className="brand">
          <Link href="/" aria-label="Ir al inicio de Verdant">
            <img src="/Logo.png" alt="Logo" className="brand-logo" />
          </Link>
        </div>

        <div className="header-content">
          <nav aria-label="Navegacion principal">
            <ul className="nav-list">
              <li>
                <a href={inicioHref}>Inicio</a>
              </li>
              <li>
                <a href={productosHref}>Productos</a>
              </li>
              <li className="nav-cart-item">
                <Carrito
                  carrito={carrito}
                  onEliminar={eliminarDelCarrito}
                  abierto={carritoAbierto}
                  onToggle={() => setCarritoAbierto((prev) => !prev)}
                  totalItems={totalItems}
                  onComprar={crearOrden}
                  comprando={ordenProcesando}
                />
              </li>
              <li>
                <a href={contactoHref}>Contacto</a>
              </li>
              {usuario ? (
                <li>
                  <Link href="/ordenes">Ordenes</Link>
                </li>
              ) : null}
              {rol === "admin" ? (
                <li>
                  <Link href="/admin/ventas">Reporte</Link>
                </li>
              ) : null}

              {usuario ? (
                <>
                  <li>
                    <span>{usuario.email}</span>
                  </li>
                  <li>
                    <button type="button" onClick={cerrarSesion}>
                      Cerrar sesion
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/auth/login">Login</Link>
                  </li>
                  <li>
                    <Link href="/auth/register">Registro</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          <form
            className="search-form"
            role="search"
            aria-label="Buscar productos"
            onSubmit={manejarSubmit}
          >
            <input
              type="search"
              id="busqueda"
              name="busqueda"
              placeholder="Ej: maceta"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
            <button type="submit">Buscar</button>
          </form>
        </div>
      </header>

      <main className="main-content">{children}</main>

      <footer id="contacto" className="site-footer">
        <h2>Contacto</h2>
        <p>Email: contacto@verdant.com</p>
        <p>Instagram: @verdant</p>
        <p>&copy; 2026 Verdant</p>
      </footer>
    </div>
  );
}

export default AppLayout;
