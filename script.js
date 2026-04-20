const productos = [
  {
    nombre: "Monstera deliciosa",
    precio: 12000,
    descripcion: "Planta de interior ideal para aportar frescura y color.",
    imagen: "Planta monstera deliciosa.jpg",
    alt: "Planta monstera deliciosa"
  },
  {
    nombre: "Ficus",
    precio: 15000,
    descripcion: "Planta de interior resistente y fácil de cuidar.",
    imagen: "Planta ficus.jpg",
    alt: "Planta ficus"
  },
  {
    nombre: "Potus",
    precio: 12000,
    descripcion: "Planta de interior con hojas grandes y coloridas.",
    imagen: "Planta potus.jpg",
    alt: "Planta potus"
  }
];

const contenedorProductos = document.getElementById("productos");
const inputBusqueda = document.getElementById("busqueda");
const formularioBusqueda = document.querySelector('form[role="search"]');

function renderizarProductos(listaProductos) {
  contenedorProductos.innerHTML = `
    <h2 id="titulo-productos">Productos destacados</h2>
  `;

  listaProductos.forEach((producto) => {
    contenedorProductos.innerHTML += `
      <article>
        <figure>
          <img src="${producto.imagen}" alt="${producto.alt}">
          <figcaption>${producto.nombre}</figcaption>
        </figure>
        <h3>${producto.nombre}</h3>
        <p>$${producto.precio}</p>
        <p>${producto.descripcion}</p>
        <button 
          type="button" 
          class="btn-carrito" 
          aria-label="Agregar ${producto.nombre} al carrito">
          Agregar al carrito
        </button>
      </article>
    `;
  });

  activarBotonesCarrito();
}

function activarBotonesCarrito() {
  const botonesCarrito = document.querySelectorAll(".btn-carrito");

  botonesCarrito.forEach((boton) => {
    boton.addEventListener("click", () => {
      alert("Producto agregado al carrito 🛒");
    });
  });
}

function filtrarProductos() {
  const textoBusqueda = inputBusqueda.value.toLowerCase().trim();

  const productosFiltrados = productos.filter((producto) => {
    return (
      producto.nombre.toLowerCase().includes(textoBusqueda) ||
      producto.descripcion.toLowerCase().includes(textoBusqueda)
    );
  });

  renderizarProductos(productosFiltrados);
}

formularioBusqueda.addEventListener("submit", (event) => {
  event.preventDefault();
  filtrarProductos();
});

inputBusqueda.addEventListener("input", filtrarProductos);

renderizarProductos(productos);