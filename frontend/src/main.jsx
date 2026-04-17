import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Home from './pages/home.jsx'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Checkout from './pages/Checkout.jsx'
import Cart from './pages/Cart.jsx'
import CheckoutSuccess from './pages/CheckoutSuccess.jsx'
import CheckoutCancel from './pages/CheckoutCancel.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="checkout/success" element={<CheckoutSuccess />} />
          <Route path="checkout/cancel" element={<CheckoutCancel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)