import React, { useEffect, useState } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function Cart() {
  const [cistella, setCistella] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cistella') || '[]');
    setCistella(savedCart);
  }, []);

  const removeItem = (id) => {
    const updated = cistella.filter((item) => item._id !== id);
    setCistella(updated);
    localStorage.setItem('cistella', JSON.stringify(updated));
  };

  const total = cistella.reduce((sum, item) => sum + (item.precio * item.quantitat), 0);

  return (
    <Container className="my-5 pt-5">
      <h2 className="fw-bold mb-4">La teva cistella</h2>
      {cistella.length === 0 ? (
        <Card className="p-4">
          <p className="mb-3">La cistella esta buida.</p>
          <Button as={Link} to="/" variant="primary">Anar a comprar</Button>
        </Card>
      ) : (
        <Card className="p-4">
          {cistella.map((item) => (
            <div key={item._id} className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <strong>{item.nombre}</strong> x{item.quantitat}
              </div>
              <div className="d-flex align-items-center gap-3">
                <span>${(item.precio * item.quantitat).toFixed(2)}</span>
                <Button variant="outline-danger" size="sm" onClick={() => removeItem(item._id)}>
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
          <hr />
          <div className="d-flex justify-content-between align-items-center">
            <strong>Total: ${total.toFixed(2)}</strong>
            <Button variant="success" onClick={() => navigate('/checkout')}>
              Continuar al checkout
            </Button>
          </div>
        </Card>
      )}
    </Container>
  );
}

export default Cart;
