import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Card, Row, Col, Badge, Alert } from 'react-bootstrap';

function Home() {
  // Estado para la cistella y productos
  const [cistella, setCistella] = useState([]);
  const [cistellaOberta, setCistellaOberta] = useState(false);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensajeCompra, setMensajeCompra] = useState(null);
  const [error, setError] = useState(null);
  const [cerca, setCerca] = useState("");
  const [categoria, setCategoria] = useState("");

  // Cargar cistella de localStorage al iniciar
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cistella') || '[]');
    if (savedCart.length > 0) setCistella(savedCart);
  }, []);

  // Guardar cistella en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cistella', JSON.stringify(cistella));
  }, [cistella]);

  // Cargar productos del backend con filtros de búsqueda y categoría
  useEffect(() => {
    let url = `http://localhost:3000/api/products?nombre=${cerca}`;
    if (categoria) url += `&categoria=${categoria}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Error en la respuesta del servidor');
        return res.json();
      })
      .then(data => {
        const listaProductos = data.data || data;

        if (Array.isArray(listaProductos)) {
          setProductos(listaProductos);
        } else {
          setProductos([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando productos:", err);
        setError("No se pudieron cargar los productos.");
        setLoading(false);
      });
  }, [cerca, categoria]);

  // Función para agregar producto a la cistella
  const afegirProducte = (producto) => {
    const productoExistente = cistella.find(item => item._id === producto._id);

    if (productoExistente) {
      setCistella(cistella.map(item =>
        item._id === producto._id
          ? { ...item, quantitat: item.quantitat + 1 }
          : item
      ));
    } else {
      setCistella([...cistella, { ...producto, quantitat: 1 }]);
    }
  };

  // Función para eliminar producto de la cistella
  const eliminarProducte = (id) => {
    setCistella(cistella.filter(item => item._id !== id));
  };

  // Función para finalizar compra (enviar al backend)
  const finalitzarCompra = () => {
    const total = cistella.reduce((total, item) => total + (item.precio * item.quantitat), 0);

    const pedido = {
      items: cistella.map(item => ({
        producto: item._id, // ID de mongo
        nombre: item.nombre,
        precio: item.precio,
        quantitat: item.quantitat
      })),
      total: total
    };

    fetch('http://localhost:3000/api/pedidos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pedido)
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al guardar pedido');
        return res.json();
      })
      .then(data => {
        setMensajeCompra("Compra realitzada amb èxit! Gràcies per la teva comanda.");
        setCistella([]); // Vaciar cistella
        setTimeout(() => setMensajeCompra(null), 5000); // Ocultar mensaje a los 5s
      })
      .catch(err => {
        console.error("Error al comprar:", err);
        setMensajeCompra("Error al processar la compra. Torna-ho a provar.");
      });
  };

  // Calcular total de productos y precio
  const totalProductes = cistella.reduce((total, item) => total + item.quantitat, 0);
  const preuTotal = cistella.reduce((total, item) => total + (item.precio * item.quantitat), 0);

  return (
    <div>
      {/* Navbar */}
      <Navbar bg="white" expand="lg" className="shadow-sm fixed-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-3">
            Mini Helmets
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              {/* Buscador de productos */}
              <div className="me-3 position-relative">
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Buscar cascos..."
                  value={cerca}
                  onChange={(e) => setCerca(e.target.value)}
                  style={{ width: '250px', paddingLeft: '40px' }}
                />
                <span className="position-absolute translate-middle-y top-50 start-0 ps-3">🔍</span>
              </div>

              <Nav.Link as={Link} to="/login" className="me-2">
                Iniciar Sesión
              </Nav.Link>
              <Button as={Link} to="/register" variant="primary" className="me-2">
                Registrarse
              </Button>

              <Button
                variant="outline-primary"
                className="position-relative"
                onClick={() => setCistellaOberta(!cistellaOberta)}
              >
                🛒 Cistella
                {totalProductes > 0 && (
                  <Badge
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle"
                  >
                    {totalProductes}
                  </Badge>
                )}
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Espaciador para navbar fixed */}
      <div style={{ marginTop: '80px' }}></div>

      {mensajeCompra && (
        <Container className="mt-3">
          <Alert variant={mensajeCompra.includes('Error') ? 'danger' : 'success'}>
            {mensajeCompra}
          </Alert>
        </Container>
      )}

      {/* Cistella desplegable */}
      {cistellaOberta && (
        <div className="bg-light border-bottom shadow-sm">
          <Container className="py-3">
            <h5 className="mb-3">Cistella de Compras</h5>

            {cistella.length === 0 ? (
              <p className="text-muted">La cistella està buida</p>
            ) : (
              <>
                {cistella.map((item) => (
                  <div
                    key={item._id}
                    className="d-flex justify-content-between align-items-center mb-2 p-2 bg-white rounded"
                  >
                    <div>
                      <strong>{item.nombre}</strong>
                      <span className="text-muted ms-2">x{item.quantitat}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="me-3">${(item.precio * item.quantitat).toFixed(2)}</span>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => eliminarProducte(item._id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="border-top pt-2 mt-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Total: </strong>
                      <strong className="fs-5 text-primary">${preuTotal.toFixed(2)}</strong>
                    </div>
                    <Button variant="success" onClick={finalitzarCompra}>
                      Finalitzar Compra
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Container>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <Container className="text-center py-5">
          <h1 className="display-4 fw-bold mb-4">Bienvenido a nuestra tienda</h1>
          <p className="lead mb-4">Encuentra los mejores productos al mejor precio</p>
          <Button variant="light" size="lg" className="text-primary fw-bold">
            Ver Productos
          </Button>
        </Container>
      </div>

      {/* Productos Destacados */}
      <Container className="my-5" id="productos">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5">
          <h2 className="fw-bold mb-3 mb-md-0">Productes Destacats</h2>

          {/* Filtros de Categoría */}
          <div className="d-flex gap-2">
            {['', 'F1', 'MotoGP', 'Legend', 'Rally'].map((cat) => (
              <Button
                key={cat}
                variant={categoria === cat ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => setCategoria(cat)}
                className="rounded-pill px-3"
              >
                {cat === '' ? 'Tots' : cat}
              </Button>
            ))}
          </div>

          <div className="text-muted mt-3 mt-md-0">{(productos || []).length} productes trobats</div>
        </div>

        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        {loading ? (
          <p className="text-center">Cargando productos...</p>
        ) : (
          <Row xs={1} md={2} lg={4} className="g-4">
            {productos.map((producto) => (
              <Col key={producto._id}>
                <Card className="h-100 shadow-sm border-0">
                  <Link to={`/product/${producto._id}`}>
                    <Card.Img
                      variant="top"
                      src={producto.imagen || 'https://via.placeholder.com/300x200'}
                      alt={producto.nombre}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200';
                      }}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  </Link>
                  <Card.Body className="d-flex flex-column">
                    <Link to={`/product/${producto._id}`} className="text-decoration-none text-dark">
                      <Card.Title className="fw-bold">{producto.nombre}</Card.Title>
                    </Link>
                    <Card.Text className="text-muted flex-grow-1">
                      {producto.descripcion}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="fs-4 fw-bold text-primary">
                        ${producto.precio}
                      </span>
                      <Button
                        variant="primary"
                        onClick={() => afegirProducte(producto)}
                      >
                        Comprar
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-4 mt-5">
        <Container>
          <p className="mb-0">&copy; 2025 MiniHelmet. Todos los derechos reservados.</p>
        </Container>
      </footer>
    </div>
  );
}

export default Home;