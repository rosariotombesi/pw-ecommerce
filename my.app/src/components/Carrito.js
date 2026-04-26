function Carrito({ carrito, onEliminar, abierto, onToggle, totalItems }) {
  const totalPrecio = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <div className="cart-dropdown">
      <button
        type="button"
        className="cart-toggle"
        onClick={onToggle}
        aria-expanded={abierto}
        aria-controls="panel-carrito"
      >
        Carrito
        <span className="cart-badge">{totalItems}</span>
      </button>

      {abierto ? (
        <section
          id="panel-carrito"
          className="cart-panel"
          aria-labelledby="titulo-carrito"
        >
          <div className="cart-header">
            <h2 id="titulo-carrito">Carrito</h2>
            <p>
              {totalItems} producto{totalItems === 1 ? "" : "s"}
            </p>
          </div>

          {carrito.length > 0 ? (
            <>
              <ul className="cart-list">
                {carrito.map((producto) => (
                  <li key={producto.id} className="cart-item">
                    <div>
                      <p className="cart-item-name">{producto.nombre}</p>
                      <p className="cart-item-meta">
                        Cantidad: {producto.cantidad} | $
                        {(producto.precio * producto.cantidad).toLocaleString(
                          "es-AR"
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="cart-remove-button"
                      onClick={() => onEliminar(producto.id)}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>

              <p className="cart-total">
                Total: ${totalPrecio.toLocaleString("es-AR")}
              </p>
            </>
          ) : (
            <p className="cart-empty">Tu carrito esta vacio.</p>
          )}
        </section>
      ) : null}
    </div>
  );
}

export default Carrito;
