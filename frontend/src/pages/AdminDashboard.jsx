import React, { useEffect, useState } from 'react';
import { Container, Table, Badge, Card, Row, Col, Spinner, Alert, Tabs, Tab } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

import API_URL from '../config/api';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                // Fetch Users
                const resUsers = await fetch(`${API_URL}/api/auth/users`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const dataUsers = await resUsers.json();

                // Fetch Stats
                const resStats = await fetch(`${API_URL}/api/pedidos/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const dataStats = await resStats.json();

                // Fetch Orders
                const resOrders = await fetch(`${API_URL}/api/orders/all`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const dataOrders = await resOrders.json();

                if (dataUsers.ok && dataStats.ok && dataOrders.ok) {
                    setUsers(dataUsers.data);
                    setStats(dataStats.data);
                    setOrders(dataOrders.data);
                } else {
                    setError(dataUsers.mensaje || dataStats.mensaje || dataOrders.mensaje || 'No s\'han pogut carregar les dades d\'admin');
                }
            } catch (err) {
                setError('Error al conectar con el servidor');
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [token]);

    const chartData = {
        labels: stats.map(s => s._id),
        datasets: [
            {
                label: 'Ventes (€)',
                data: stats.map(s => s.totalVentas),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const pedidosData = {
        labels: stats.map(s => s._id),
        datasets: [
            {
                label: 'Nombre de Comandes',
                data: stats.map(s => s.cantidadPedidos),
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
            },
        ],
    };

    return (
        <Container className="py-5">
            <h2 className="mb-4">Admin Dashboard</h2>
            
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="danger" />
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <Tabs defaultActiveKey="stats" id="admin-tabs" className="mb-4">
                    <Tab eventKey="stats" title="Estadístiques">
                        <Row className="mt-4">
                            <Col md={6} className="mb-4">
                                <Card className="shadow-sm">
                                    <Card.Body>
                                        <Card.Title>Ventes (Últims 7 dies)</Card.Title>
                                        <Bar data={chartData} />
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6} className="mb-4">
                                <Card className="shadow-sm">
                                    <Card.Body>
                                        <Card.Title>Comandes (Últims 7 dies)</Card.Title>
                                        <Line data={pedidosData} />
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Tab>
                    <Tab eventKey="users" title="Gestió d'Usuaris">
                        <Table responsive striped bordered hover className="mt-3 shadow-sm">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id}>
                                        <td>{u._id.substring(0, 8)}...</td>
                                        <td>{u.nombre}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <Badge bg={u.role === 'admin' ? 'danger' : 'primary'}>
                                                {u.role}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Tab>
                    <Tab eventKey="orders" title="Registre de Comandes">
                        <Table responsive striped bordered hover className="mt-3 shadow-sm">
                            <thead className="table-dark">
                                <tr>
                                    <th>Comanda</th>
                                    <th>Client</th>
                                    <th>Email</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Estat</th>
                                    <th>Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center text-muted py-4">
                                            Encara no hi ha comandes registrades.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>{order._id.substring(0, 8)}...</td>
                                            <td>{order?.usuario?.nombre || 'Client eliminat'}</td>
                                            <td>{order?.usuario?.email || '-'}</td>
                                            <td>{Array.isArray(order.items) ? order.items.length : 0}</td>
                                            <td>${Number(order.total || 0).toFixed(2)}</td>
                                            <td>
                                                <Badge bg={order.estado === 'paid' ? 'success' : order.estado === 'pending' ? 'warning' : 'secondary'}>
                                                    {order.estado}
                                                </Badge>
                                            </td>
                                            <td>{order.fecha ? new Date(order.fecha).toLocaleString() : '-'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </Tab>
                </Tabs>
            )}
        </Container>
    );
};

export default AdminDashboard;
