import React, { useEffect, useState } from 'react';
import { Container, Table, Badge, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';

const UserDashboard = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem('usuario'));

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch('http://localhost:3000/api/pedidos/mis-pedidos', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.ok) {
                    setPedidos(data.data);
                } else {
                    setError(data.mensaje);
                }
            } catch (err) {
                setError('Error al conectar con el servidor');
            } finally {
                setLoading(false);
            }
        };

        fetchPedidos();
    }, []);

    const getEstadoBadge = (estado) => {
        switch (estado) {
            case 'pending': return <Badge bg="warning">Pendent</Badge>;
            case 'completed': return <Badge bg="success">Completat</Badge>;
            case 'cancelled': return <Badge bg="danger">Cancel·lat</Badge>;
            default: return <Badge bg="secondary">{estado}</Badge>;
        }
    };

    return (
        <Container className="py-5">
            <h2 className="mb-4">El meu Dashboard</h2>
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>El meu Perfil</Card.Title>
                            <hr />
                            <p><strong>Nom:</strong> {user?.nombre}</p>
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p><strong>Rol:</strong> <Badge bg="info">{user?.role}</Badge></p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <h3>Historial de Compres</h3>
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : pedidos.length === 0 ? (
                <Alert variant="info">Encara no has realitzat cap compra.</Alert>
            ) : (
                <Table responsive striped bordered hover className="mt-3">
                    <thead className="table-dark">
                        <tr>
                            <th>ID Comanda</th>
                            <th>Data</th>
                            <th>Total</th>
                            <th>Estat</th>
                            <th>Productes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map(pedido => (
                            <tr key={pedido._id}>
                                <td>{pedido._id.substring(0, 8)}...</td>
                                <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                                <td>{pedido.total.toFixed(2)}€</td>
                                <td>{getEstadoBadge(pedido.estado)}</td>
                                <td>
                                    <ul className="mb-0 list-unstyled">
                                        {pedido.items.map((item, idx) => (
                                            <li key={idx}><small>{item.quantitat}x {item.nombre}</small></li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default UserDashboard;
