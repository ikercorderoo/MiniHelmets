const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// Rutas de prueba para la Sessió 9
router.get('/perfil', authMiddleware, (req, res) => {
    res.json({ message: "Token vàlid", user: req.user });
});

router.get('/admin-only', authMiddleware, roleMiddleware('admin'), (req, res) => {
    res.json({ message: "Accés d'administrador confirmat", user: req.user });
});

module.exports = router;