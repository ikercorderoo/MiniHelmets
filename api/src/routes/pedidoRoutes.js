const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authMiddleware = require('../middleware/authMiddleware');

const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, pedidoController.createPedido);
router.get('/mis-pedidos', authMiddleware, pedidoController.getMisPedidos);
router.get('/all', authMiddleware, roleMiddleware('admin'), pedidoController.getAllPedidos);
router.get('/stats', authMiddleware, roleMiddleware('admin'), pedidoController.getStats);

module.exports = router;
