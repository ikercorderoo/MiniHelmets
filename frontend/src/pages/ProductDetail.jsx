import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Badge, Spinner, Alert } from 'react-bootstrap';

function ProductDetail() {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cistella, setCistella] = useState([]); // Manejo local simplificado para demostrar

    useEffect(() => {
        fetch(`http://localhost:3000/api/products/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('No s\'ha pogut carregar el producte');
                return res.json();
            })
            .then(data => {
                setProducto(data.data || data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });

        // Cargar cistella local de localStorage para poder añadir (opcional para el ejercicio)
        const savedCart = JSON.parse(localStorage.getItem('cistella') || '[]');
        setCistella(savedCart);
    }, [id]);

    const afegirProducte = () => {
        const savedCart = JSON.parse(localStorage.getItem('cistella') || '[]');
        const productoExistente = savedCart.find(item => item._id === producto._id);

        let newCart;
        if (productoExistente) {
            newCart = savedCart.map(item =>
                item._id === producto._id
                    ? { ...item, quantitat: item.quantitat + 1 }
                    : item
            );
        } else {
            newCart = [...savedCart, { ...producto, quantitat: 1 }];
        }

        localStorage.setItem('cistella', JSON.stringify(newCart));
        alert('Producte afegit a la cistella!');
    };

    if (loading) return (
        <Container className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p>Carregant producte...</p>
        </Container>
    );

    if (error) return (
        <Container className="my-5">
            <Alert variant="danger">{error}</Alert>
            <Button as={Link} to="/" variant="primary">Tornar al catàleg</Button>
        </Container>
    );

    if (!producto) return null;

    return (
        <Container className="my-5">
            <Button as={Link} to="/" variant="outline-secondary" className="mb-4">
                ← Tornar enrere
            </Button>

            <Row>
                <Col md={6}>
                    <Card className="border-0 shadow-sm">
                        <Card.Img
                            src={producto.imagen || 'https://via.placeholder.com/600x400'}
                            alt={producto.nombre}
                            style={{ borderRadius: '10px' }}
                        />
                    </Card>
                </Col>
                <Col md={6}>
                    <div className="ps-md-4">
                        <Badge bg="primary" className="mb-2">Nou Producte</Badge>
                        <h1 className="fw-bold mb-3">{producto.nombre}</h1>
                        <h2 className="text-primary fw-bold mb-4">${producto.precio}</h2>

                        <div className="mb-4">
                            <h5 className="fw-bold">Descripció</h5>
                            <p className="text-muted" style={{ lineHeight: '1.8' }}>
                                {producto.descripcion}
                            </p>
                            <p className="text-muted">
                                El Mini Helmet oficial de alta calidad, fabricado con materiales premium para los coleccionistas más exigentes.
                            </p>
                        </div>

                        <div className="mb-4">
                            <h5 className="fw-bold">Disponibilitat</h5>
                            <p className={producto.stock > 0 ? 'text-success' : 'text-danger'}>
                                {producto.stock > 0 ? `En estoc (${producto.stock} unitats)` : 'Esgotat'}
                            </p>
                        </div>

                        <div className="d-grid gap-2">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={afegirProducte}
                                disabled={producto.stock === 0}
                            >
                                Afegir a la Cistella 🛒
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ProductDetail;
