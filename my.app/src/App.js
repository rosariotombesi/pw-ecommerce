import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import Carrito from "./components/Carrito";
import ProductCard from "./components/ProductCard";
import "./App.css";

const CARRITO_STORAGE_KEY = "verdant_carrito";

const productos = [
  {
    id: "monstera-deliciosa",
    nombre: "Monstera deliciosa",
    precio: 12000,
    descripcion: "Planta de interior ideal para aportar frescura y color.",
    descripcionLarga:
      "La Monstera deliciosa es una planta tropical de hojas grandes y abiertas. Queda muy bien en livings luminosos y es una de las favoritas para decoracion de interiores.",
    imagen: process.env.PUBLIC_URL + "/Planta monstera deliciosa.jpg",
    alt: "Planta monstera deliciosa",
    categoria: "Plantas",
    luz: "Luz indirecta brillante",
    riego: "1 vez por semana",
    tamanio: "Maceta de 18 cm",
    stock: "Disponible",
  },
  {
    id: "ficus",
    nombre: "Ficus",
    precio: 15000,
    descripcion: "Planta de interior resistente y facil de cuidar.",
    descripcionLarga:
      "El Ficus aporta altura, presencia y un verde profundo. Es una opcion muy buscada para sumar volumen en rincones y entradas, con mantenimiento simple.",
    imagen: process.env.PUBLIC_URL + "/Planta ficus.jpg",
    alt: "Planta ficus",
    categoria: "Plantas",
    luz: "Luz media a alta",
    riego: "Cada 7 a 10 dias",
    tamanio: "Maceta de 20 cm",
    stock: "Ultimas unidades",
  },
  {
    id: "potus",
    nombre: "Potus",
    precio: 12000,
    descripcion: "Planta de interior con hojas grandes y coloridas.",
    descripcionLarga:
      "El Potus es una planta versatil, ideal para estantes, escritorios o muebles altos. Se adapta muy bien a distintos ambientes y es perfecta para empezar.",
    imagen: process.env.PUBLIC_URL + "/Planta potus.jpg",
    alt: "Planta potus",
    categoria: "Plantas",
    luz: "Luz baja a media",
    riego: "Cuando se seca la capa superior",
    tamanio: "Maceta de 15 cm",
    stock: "Disponible",
  },
];

function AppLayout({
  children,
  busqueda,
  setBusqueda,
  manejarSubmit,
  carrito,
  eliminarDelCarrito,
}) {
  const location = useLocation();
  const inicioHref = location.pathname === "/" ? "#inicio" : "/";
  const productosHref = location.pathname === "/" ? "#productos" : "/#productos";
  const contactoHref = location.pathname === "/" ? "#contacto" : "/#contacto";
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <Link to="/" aria-label="Ir al inicio de Verdant">
            <img
              src={process.env.PUBLIC_URL + "/Logo.png"}
              alt="Logo"
              className="brand-logo"
            />
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

      <main className="main-content">
        {children}
      </main>

      <footer id="contacto" className="site-footer">
        <h2>Contacto</h2>
        <p>Email: contacto@verdant.com</p>
        <p>Instagram: @verdant</p>
        <p>&copy; 2026 Verdant</p>
      </footer>
    </div>
  );
}

function HomePage({ productosFiltrados, agregarAlCarrito }) {
  return (
    <>
      <section id="inicio" className="hero" aria-labelledby="bienvenida">
        <img
          src="/Imagen principal.jpg"
          alt="Plantas decorativas para el hogar"
          className="hero-image"
        />

        <div className="hero-text">
          <h1 id="bienvenida">Plantas y macetas para tu hogar</h1>
          <p>
            Descubri una seleccion de plantas y macetas para transformar tus
            espacios.
          </p>
          <a className="catalog-link" href="#productos">
            Ver catalogo
          </a>
        </div>
      </section>

      <section
        id="productos"
        className="products-section"
        aria-labelledby="titulo-productos"
      >
        <div className="section-heading">
          <h2 id="titulo-productos">Productos destacados</h2>
          <p>Selecciona un producto para ver su ficha completa.</p>
        </div>

        {productosFiltrados.length > 0 ? (
          <div className="products-grid">
            {productosFiltrados.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                onAgregar={agregarAlCarrito}
              />
            ))}
          </div>
        ) : (
          <p className="empty-state">
            No encontramos productos que coincidan con tu busqueda.
          </p>
        )}
      </section>
    </>
  );
}

function ProductPage({ agregarAlCarrito }) {
  const { id } = useParams();
  const producto = productos.find((item) => item.id === id);

  if (!producto) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="product-detail" aria-labelledby="detalle-producto">
      <Link to="/" className="back-link">
        Volver a productos
      </Link>

      <div className="product-detail-layout">
        <img
          src={producto.imagen}
          alt={producto.alt}
          className="product-detail-image"
        />

        <div className="product-detail-content">
          <p className="detail-category">{producto.categoria}</p>
          <h1 id="detalle-producto">{producto.nombre}</h1>
          <p className="price detail-price">
            ${producto.precio.toLocaleString("es-AR")}
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
              <strong>Estado:</strong> {producto.stock}
            </p>
          </div>

          <div className="detail-actions">
            <button type="button" onClick={() => agregarAlCarrito(producto)}>
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

function ScrollToDetail() {
  const { pathname } = useLocation();

  useEffect(() => {
    setTimeout(() => {
      const elemento = document.getElementById("detalle-producto");

      if (elemento) {
        elemento.scrollIntoView({
          behavior: "smooth",
          block: "center", // 👈 clave
        });
      }
    }, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem(CARRITO_STORAGE_KEY);

    if (!carritoGuardado) {
      return [];
    }

    try {
      return JSON.parse(carritoGuardado);
    } catch {
      return [];
    }
  });

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

  useEffect(() => {
    localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify(carrito));
  }, [carrito]);

 return (
  <>
    
    <ScrollToDetail />

    <AppLayout
      busqueda={busqueda}
      setBusqueda={setBusqueda}
      manejarSubmit={manejarSubmit}
      carrito={carrito}
      eliminarDelCarrito={eliminarDelCarrito}
    >
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              productosFiltrados={productosFiltrados}
              agregarAlCarrito={agregarAlCarrito}
            />
          }
        />
        <Route
          path="/producto/:id"
          element={<ProductPage agregarAlCarrito={agregarAlCarrito} />}
        />
      </Routes>
    </AppLayout>
</>
);
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
