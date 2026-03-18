const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());

// Middleware CORS manual (para permitir peticiones desde el frontend 5173)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

connectDB();

console.log('Verificando variables de entorno:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'CARGADO' : 'NO CARGADO');
console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET ? 'CARGADO' : 'NO CARGADO');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'CARGADO' : 'NO CARGADO');

app.get('/', (req, res) => res.send('API Ecommerce en marxa 🚀'));

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', require('./routes/pedidoRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`));
