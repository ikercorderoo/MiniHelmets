const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.post('/registro', usuariosController.registrarse);

router.post('/login', usuariosController.login);

router.post('/refresh', usuariosController.refresh);

router.post('/logout', usuariosController.logout);

module.exports = router;