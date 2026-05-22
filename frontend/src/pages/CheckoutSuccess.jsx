import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import API_URL from '../config/api';

function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [verifying, setVerifying] = useState(!!sessionId);
  const [message, setMessage] = useState('Gràcies por la teva compra. Hem rebut la teva comanda y la estem processant.');

  useEffect(() => {
    // Netejar la cistella després d'un pagament exitós
    localStorage.removeItem('cistella');

    if (sessionId) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        fetch(`${API_URL}/api/checkout/verify-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ sessionId })
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setMessage('Gràcies per la teva compra! El pagament s\'ha verificat correctament i la teva comanda està confirmada.');
            } else {
              setMessage('Hem rebut la teva comanda però estem esperant la confirmació del pagament de Stripe.');
            }
          })
          .catch(err => {
            console.error('Error al verificar pagament', err);
          })
          .finally(() => {
            setVerifying(false);
          });
      } else {
        setVerifying(false);
      }
    }
  }, [sessionId]);

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Card className="text-center p-5 shadow-lg border-0" style={{ maxWidth: '500px', borderRadius: '20px' }}>
        <div className="mb-4">
          <div className="display-1 text-success">✅</div>
        </div>
        <h2 className="fw-bold mb-3">¡Pagament Completat!</h2>
        {verifying ? (
          <div className="my-4">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-2">Verificant pagament...</p>
          </div>
        ) : (
          <p className="text-muted mb-4 fs-5">{message}</p>
        )}
        <Button as={Link} to="/dashboard" variant="primary" size="lg" className="rounded-pill px-5 mb-2">
          Anar al meu Dashboard
        </Button>
        <Button as={Link} to="/" variant="outline-secondary" size="lg" className="rounded-pill px-5">
          Tornar a la Home
        </Button>
      </Card>
    </Container>
  );
}

export default CheckoutSuccess;
