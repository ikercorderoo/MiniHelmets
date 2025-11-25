require('dotenv').config({ path: '../.env' });

const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');

const app = express();

app.use(express.json());

connectDB();

console.log('Verificando variables de entorno:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'CARGADO' : 'NO CARGADO');
console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET ? 'CARGADO' : 'NO CARGADO');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'CARGADO' : 'NO CARGADO');

app.get('/', (req, res) => res.send('API Ecommerce en marxa 🚀'));

app.use('/api/products', productRoutes);
app.use('/api/usuarios', usuariosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`));
