const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registre de nou usuari
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, password]
 *             properties:
 *               nombre: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201: { description: Usuari registrat correctament }
 *       400: { description: Dades invàlides }
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login d'usuari ja registrat
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login exitós, retorna tokens }
 *       401: { description: Credencials incorrectes }
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Renovar Access Token mitjançant Refresh Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200: { description: Tokens renovats correctament }
 *       401: { description: Token de refresc invàlid o expirat }
 */
router.post('/refresh', authController.refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Tancar sessió i invalidar Refresh Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200: { description: Sessió tancada correctament }
 */
router.post('/logout', authController.logout);

// Rutas de prueba para la Sessió 9
/**
 * @swagger
 * /api/auth/perfil:
 *   get:
 *     summary: Obtenir dades del perfil de l'usuari autenticat
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Perfil de l'usuari }
 *       401: { description: No autoritzat }
 */
router.get('/perfil', authMiddleware, (req, res) => {
    res.json({ message: "Token vàlid", user: req.user });
});

/**
 * @swagger
 * /api/auth/admin-only:
 *   get:
 *     summary: Ruta restringida només per a usuaris amb rol administrador
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Accés d'administrador confirmat }
 *       403: { description: Accés prohibit }
 */
router.get('/admin-only', authMiddleware, roleMiddleware('admin'), (req, res) => {
    res.json({ message: "Accés d'administrador confirmat", user: req.user });
});

module.exports = router;