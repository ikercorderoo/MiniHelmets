const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, pedidoController.createPedido);

module.exports = router;
