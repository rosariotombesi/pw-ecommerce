import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import Carrito from "./Carrito";

function AppLayout({
  children,
  busqueda,
  setBusqueda,
  manejarSubmit,
  carrito,
  eliminarDelCarrito,
}) {
  const router = useRouter();
  const [carritoAbierto, setCarritoAbierto] = useState(false);

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
                />
              </li>
              <li>
                <a href={contactoHref}>Contacto</a>
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
