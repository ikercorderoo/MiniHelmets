import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  // Productos de ejemplo - luego los traerás de tu backend
  const productos = [
    {
      id: 1,
      nombre: 'Producto 1',
      precio: 29.99,
      imagen: 'https://via.placeholder.com/300x200',
      descripcion: 'Descripción del producto 1'
    },
    {
      id: 2,
      nombre: 'Producto 2',
      precio: 39.99,
      imagen: 'https://via.placeholder.com/300x200',
      descripcion: 'Descripción del producto 2'
    },
    {
      id: 3,
      nombre: 'Producto 3',
      precio: 49.99,
      imagen: 'https://via.placeholder.com/300x200',
      descripcion: 'Descripción del producto 3'
    },
    {
      id: 4,
      nombre: 'Producto 4',
      precio: 59.99,
      imagen: 'https://via.placeholder.com/300x200',
      descripcion: 'Descripción del producto 4'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Mi Tienda</h1>
          <div className="space-x-4">
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Bienvenido a nuestra tienda</h2>
          <p className="text-xl mb-8">Encuentra los mejores productos al mejor precio</p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100">
            Ver Productos
          </button>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Productos Destacados</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <div key={producto.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
              <img 
                src={producto.imagen} 
                alt={producto.nombre}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{producto.nombre}</h3>
                <p className="text-gray-600 mb-4">{producto.descripcion}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">
                    ${producto.precio}
                  </span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Mi Tienda. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;