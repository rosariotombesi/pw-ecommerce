import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname();
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [productosMenuAbierto, setProductosMenuAbierto] = useState(false);
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

  const manejarCrearOrden = async () => {
    const ordenCreada = await crearOrden();

    if (ordenCreada) {
      setCarritoAbierto(false);
    }
  };

  const totalItems = useMemo(
    () => carrito.reduce((acc, item) => acc + item.cantidad, 0),
    [carrito]
  );

  const estaEnInicio = pathname === "/";
  const inicioHref = estaEnInicio ? "#inicio" : "/";
  const contactoHref = estaEnInicio ? "#contacto" : "/#contacto";

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <Link href="/" aria-label="Ir al inicio de Verdant">
            <img src="/Logo.png" alt="Logo" className="brand-logo" />
          </Link>
        </div>

        <div className="header-content">
          <nav aria-label="Navegación principal">
            <ul className="nav-list">
              <li>
                <a href={inicioHref}>Inicio</a>
              </li>
              <li className="nav-menu-item">
                <button
                  type="button"
                  className="menu-toggle menu-toggle-plain"
                  aria-expanded={productosMenuAbierto}
                  aria-controls="menu-productos"
                  onClick={() => setProductosMenuAbierto((prev) => !prev)}
                >
                  Productos
                </button>

                {productosMenuAbierto ? (
                  <div id="menu-productos" className="menu-panel products-menu-panel">
                    <Link
                      href="/productos/plantas"
                      onClick={() => setProductosMenuAbierto(false)}
                    >
                      Plantas
                    </Link>
                    <Link
                      href="/productos/macetas"
                      onClick={() => setProductosMenuAbierto(false)}
                    >
                      Macetas
                    </Link>
                  </div>
                ) : null}
              </li>
              <li className="nav-cart-item">
                <Carrito
                  carrito={carrito}
                  onEliminar={eliminarDelCarrito}
                  abierto={carritoAbierto}
                  onToggle={() => setCarritoAbierto((prev) => !prev)}
                  totalItems={totalItems}
                  onComprar={manejarCrearOrden}
                  comprando={ordenProcesando}
                />
              </li>
              <li className="nav-menu-item">
                <button
                  type="button"
                  className="menu-toggle"
                  aria-expanded={menuAbierto}
                  aria-controls="menu-cuenta"
                  onClick={() => setMenuAbierto((prev) => !prev)}
                >
                  Menú
                </button>

                {menuAbierto ? (
                  <div id="menu-cuenta" className="menu-panel">
                    <a href={contactoHref} onClick={() => setMenuAbierto(false)}>
                      Contacto
                    </a>

                    {usuario ? (
                      <>
                        <Link
                          href="/ordenes"
                          onClick={() => setMenuAbierto(false)}
                        >
                          Órdenes
                        </Link>
                        {rol === "admin" ? (
                          <Link
                            href="/admin/ventas"
                            onClick={() => setMenuAbierto(false)}
                          >
                            Reporte
                          </Link>
                        ) : null}
                        <span className="menu-email">{usuario.email}</span>
                        <button type="button" onClick={cerrarSesion}>
                          Cerrar sesión
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          onClick={() => setMenuAbierto(false)}
                        >
                          Login
                        </Link>
                        <Link
                          href="/auth/register"
                          onClick={() => setMenuAbierto(false)}
                        >
                          Registro
                        </Link>
                      </>
                    )}
                  </div>
                ) : null}
              </li>
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
