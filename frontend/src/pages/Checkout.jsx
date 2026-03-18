import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

function Checkout() {
    const [cistella, setCistella] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        adreca: '',
        ciutat: '',
        codi_postal: '',
        telefon: '',
        metode_pagament: 'Targeta'
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Cargar cistella de localStorage al iniciar
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cistella') || '[]');
        if (savedCart.length === 0) {
            navigate('/'); // Si no hay nada, volver a la home
        }
        setCistella(savedCart);
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const total = parseFloat(cistella.reduce((sum, item) => sum + (item.precio * item.quantitat), 0).toFixed(2));

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const pedido = {
            items: cistella.map(item => ({
                producto: item._id,
                nombre: item.nombre,
                precio: item.precio,
                quantitat: item.quantitat
            })),
            total,
            ...formData
        };

        fetch('http://localhost:3000/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        })
            .then(res => {
                if (!res.ok) throw new Error('Error al confirmar el pedido');
                return res.json();
            })
            .then(() => {
                localStorage.removeItem('cistella'); // Vaciar cistella
                alert('Comanda realitzada amb èxit!');
                navigate('/');
            })
            .catch(err => {
                console.error(err);
                setError('No s\'ha pogut processar la comanda. Revisa les dades.');
            })
            .finally(() => setLoading(false));
    };

    return (
        <Container className="my-5 pt-5">
            <h2 className="fw-bold mb-4">Finalitzar Compra</h2>
            <Row>
                <Col md={8}>
                    <Card className="shadow-sm border-0 p-4 mb-4">
                        <h5 className="mb-3">Dades d'Enviament</h5>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nom Complet</Form.Label>
                                <Form.Control
                                    type="text" name="nombre" value={formData.nombre}
                                    onChange={handleChange} required placeholder="Josep Pi"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Adreça</Form.Label>
                                <Form.Control
                                    type="text" name="adreca" value={formData.adreca}
                                    onChange={handleChange} required placeholder="Carrer Major, 10"
                                />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Ciultat</Form.Label>
                                        <Form.Control
                                            type="text" name="ciutat" value={formData.ciutat}
                                            onChange={handleChange} required placeholder="Barcelona"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Codi Postal</Form.Label>
                                        <Form.Control
                                            type="text" name="codi_postal" value={formData.codi_postal}
                                            onChange={handleChange} required placeholder="08001"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Telèfon</Form.Label>
                                <Form.Control
                                    type="text" name="telefon" value={formData.telefon}
                                    onChange={handleChange} required placeholder="600 000 000"
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Mètode de Pagament</Form.Label>
                                <Form.Select name="metode_pagament" value={formData.metode_pagament} onChange={handleChange}>
                                    <option value="Targeta">Targeta de Crèdit</option>
                                    <option value="PayPal">PayPal</option>
                                    <option value="Efectiu">Efectiu (Entrega)</option>
                                </Form.Select>
                            </Form.Group>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <div className="d-grid">
                                <Button variant="primary" size="lg" type="submit" disabled={loading}>
                                    {loading ? 'Processant...' : `Pagar $${total.toFixed(2)}`}
                                </Button>
                                <Button as={Link} to="/" variant="link" className="text-muted mt-2">
                                    Tornar enrere
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="shadow-sm border-0 p-4 bg-light">
                        <h5 className="mb-3">Resum del Pedido</h5>
                        {cistella.map(item => (
                            <div key={item._id} className="d-flex justify-content-between mb-2">
                                <span>{item.nombre} x{item.quantitat}</span>
                                <span>${(item.precio * item.quantitat).toFixed(2)}</span>
                            </div>
                        ))}
                        <hr />
                        <div className="d-flex justify-content-between fw-bold fs-5">
                            <span>Total</span>
                            <span className="text-primary">${total.toFixed(2)}</span>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Checkout;
