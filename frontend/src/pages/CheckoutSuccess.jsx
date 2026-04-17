import React, { useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function CheckoutSuccess() {
  useEffect(() => {
    // Netejar la cistella després d'un pagament exitós
    localStorage.removeItem('cistella');
  }, []);

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Card className="text-center p-5 shadow-lg border-0" style={{ maxWidth: '500px', borderRadius: '20px' }}>
        <div className="mb-4">
          <div className="display-1 text-success">✅</div>
        </div>
        <h2 className="fw-bold mb-3">¡Pagament Completat!</h2>
        <p className="text-muted mb-4 fs-5">
          Gràcies por la teva compra. Hem rebut la teva comanda i la estem processant.
        </p>
        <Button as={Link} to="/" variant="primary" size="lg" className="rounded-pill px-5">
          Tornar a la Home
        </Button>
      </Card>
    </Container>
  );
}

export default CheckoutSuccess;
