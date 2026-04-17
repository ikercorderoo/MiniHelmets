import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function CheckoutCancel() {
  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Card className="text-center p-5 shadow-lg border-0" style={{ maxWidth: '500px', borderRadius: '20px' }}>
        <div className="mb-4">
          <div className="display-1 text-danger">❌</div>
        </div>
        <h2 className="fw-bold mb-3">Pagament Cancel·lat</h2>
        <p className="text-muted mb-4 fs-5">
          Sembla que el procés de pagament s'ha cancel·lat. No s'ha realitzat cap càrrec a la teva targeta.
        </p>
        <div className="d-grid gap-2">
          <Button as={Link} to="/checkout" variant="primary" size="lg" className="rounded-pill px-5">
            Tornar a intentar-ho
          </Button>
          <Button as={Link} to="/" variant="link" className="text-muted">
            Tornar a la Home
          </Button>
        </div>
      </Card>
    </Container>
  );
}

export default CheckoutCancel;
