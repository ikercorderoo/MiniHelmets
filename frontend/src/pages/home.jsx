import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Card, Row, Col } from 'react-bootstrap';

function Home() {
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
              <Button as={Link} to="/register" variant="primary">
                Registrarse
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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
                    <Button variant="primary">
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