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

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                // Fetch Users
                const resUsers = await fetch('http://localhost:3000/api/auth/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const dataUsers = await resUsers.json();

                // Fetch Stats
                const resStats = await fetch('http://localhost:3000/api/pedidos/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const dataStats = await resStats.json();

                if (dataUsers.ok && dataStats.ok) {
                    setUsers(dataUsers.data);
                    setStats(dataStats.data);
                } else {
                    setError(dataUsers.mensaje || dataStats.mensaje);
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
                </Tabs>
            )}
        </Container>
    );
};

export default AdminDashboard;
