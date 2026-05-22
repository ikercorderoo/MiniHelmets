const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const { stripeWebhook } = require('./controllers/checkoutController');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

// Middlewares i rutes d'observabilitat
const requestId = require('./middleware/requestId');
const httpLogger = require('./middleware/httpLogger');
const errorHandler = require('./middleware/errorHandler');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// Assignar requestId i loguejar HTTP abans de qualsevol processament de petició
app.use(requestId);
app.use(httpLogger);

app.post('/api/checkout/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
app.use(express.json());

// Documentació API amb Swagger Crea la ruta api docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware CORS manual
app.use((req, res, next) => {
    const origin = process.env.FRONTEND_URL || '*';
    res.header('Access-Control-Allow-Origin', origin);
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

// Endpoint de debug temporal per comprovar l'observabilitat dels errors
app.get('/api/debug/error', (req, res, next) => {
    next(new Error('Error de prova per observabilitat'));
});

app.use('/api', healthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', require('./routes/pedidoRoutes'));
app.use('/api/orders', require('./routes/pedidoRoutes'));
app.use('/api/cistella', require('./routes/cistellaRoutes'));
app.use('/api/checkout', checkoutRoutes);

// Middleware d'errors global (ha de ser l'últim middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`));

