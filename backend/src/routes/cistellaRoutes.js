const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const cistellaController = require('../controllers/cistellaController');

/**
 * @swagger
 * tags:
 *   - name: Cistella
 *     description: Gestio de la cistella de l'usuari autenticat
 */

/**
 * @swagger
 * /api/cistella:
 *   get:
 *     summary: Obtener la cistella del usuario autenticado
 *     tags: [Cistella]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cistella obtenida correctamente
 *       401:
 *         description: No autorizado
 */
router.get('/', authMiddleware, cistellaController.getCistella);

/**
 * @swagger
 * /api/cistella/items:
 *   post:
 *     summary: Anadir producto a la cistella
 *     tags: [Cistella]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [producto, nombre, precio]
 *             properties:
 *               producto:
 *                 type: string
 *               nombre:
 *                 type: string
 *               precio:
 *                 type: number
 *               quantitat:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: Producto anadido correctamente
 *       400:
 *         description: Datos invalidos
 *       401:
 *         description: No autorizado
 */
router.post('/items', authMiddleware, cistellaController.addItem);

/**
 * @swagger
 * /api/cistella/items/{producto}:
 *   put:
 *     summary: Actualizar cantidad de un producto en la cistella
 *     tags: [Cistella]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: producto
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantitat]
 *             properties:
 *               quantitat:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Cantidad actualizada
 *       404:
 *         description: Cistella o producto no encontrado
 */
router.put('/items/:producto', authMiddleware, cistellaController.updateItemQuantitat);

/**
 * @swagger
 * /api/cistella/items/{producto}:
 *   delete:
 *     summary: Eliminar producto de la cistella
 *     tags: [Cistella]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: producto
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       404:
 *         description: Cistella o producto no encontrado
 */
router.delete('/items/:producto', authMiddleware, cistellaController.removeItem);

/**
 * @swagger
 * /api/cistella:
 *   delete:
 *     summary: Vaciar completamente la cistella
 *     tags: [Cistella]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cistella vaciada
 *       404:
 *         description: Cistella no encontrada
 */
router.delete('/', authMiddleware, cistellaController.clearCistella);

module.exports = router;
