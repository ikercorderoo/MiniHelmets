import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Card, Row, Col, Badge } from 'react-bootstrap';

function Home() {
  // Estado para la cistella
  const [cistella, setCistella] = useState([]);
  const [cistellaOberta, setCistellaOberta] = useState(false);

  // Productos de ejemplo - luego los traerás de tu backend
  const productos = [
    {
      id: 1,
      nombre: 'Producto 1',
      precio: 29.99,
      imagen: 'https://via.placeholder.com/300x200',
      descripcion: 'Descripción del producto 1'
    },
    {
      id: 2,
      nombre: 'Producto 2',
      precio: 39.99,
      imagen: 'https://via.placeholder.com/300x200',
      descripcion: 'Descripción del producto 2'
    },
    {
      id: 3,
      nombre: 'Producto 3',
      precio: 49.99,
      imagen: 'https://via.placeholder.com/300x200',
      descripcion: 'Descripción del producto 3'
    },
    {
      id: 4,
      nombre: 'Producto 4',
      precio: 59.99,
      imagen: 'https://via.placeholder.com/300x200',
      descripcion: 'Descripción del producto 4'
    }
  ];

  // Función para agregar producto a la cistella
  const afegirProducte = (producto) => {
    const productoExistente = cistella.find(item => item.id === producto.id);
    
    if (productoExistente) {
      // Si el producto ya está, incrementar cantidad
      setCistella(cistella.map(item =>
        item.id === producto.id
          ? { ...item, quantitat: item.quantitat + 1 }
          : item
      ));
    } else {
      // Si es nuevo, agregarlo con cantidad 1
      setCistella([...cistella, { ...producto, quantitat: 1 }]);
    }
  };

  // Función para eliminar producto de la cistella
  const eliminarProducte = (id) => {
    setCistella(cistella.filter(item => item.id !== id));
  };

  // Calcular total de productos en la cistella
  const totalProductes = cistella.reduce((total, item) => total + item.quantitat, 0);

  // Calcular precio total
  const preuTotal = cistella.reduce((total, item) => total + (item.precio * item.quantitat), 0);

  return (
    <div>
      {/* Navbar */}
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-3">
            Mini Helmets  
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login" className="me-2">
                Iniciar Sesión
              </Nav.Link>
              <Button as={Link} to="/register" variant="primary" className="me-2">
                Registrarse
              </Button>
              
              {/* Botón de cistella */}
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
                    key={item.id} 
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
                        onClick={() => eliminarProducte(item.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="border-top pt-2 mt-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>Total:</strong>
                    <strong className="fs-5 text-primary">${preuTotal.toFixed(2)}</strong>
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
      <Container className="my-5">
        <h2 className="text-center fw-bold mb-5">Productos Destacados</h2>
        
        <Row xs={1} md={2} lg={4} className="g-4">
          {productos.map((producto) => (
            <Col key={producto.id}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Img 
                  variant="top" 
                  src={producto.imagen} 
                  alt={producto.nombre}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fw-bold">{producto.nombre}</Card.Title>
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