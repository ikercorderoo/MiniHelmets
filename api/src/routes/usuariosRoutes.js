const express = require('express');
const routerUsuario = express.Router();
const usuarioController = require('../controllers/usuariosController');

routerUsuario.post('/registro', usuarioController.registrarse);
routerUsuario.post('/login', usuarioController.login);

module.exports = routerUsuario;
