const usuarioService = require('../services/usuarioServices');

// Controlador registro
const registrarse = async (req, res) => {
    try {
        const usuarioCreado = await usuarioService.registrarUsuario(req.body);
        res.status(201).json({ 
            ok: true, 
            data: usuarioCreado 
        });
    } catch (error) {
        console.error('Error en registro:', error.message);
        res.status(400).json({ 
            ok: false, 
            mensaje: error.message 
        });
    }
};

// Controlador login
const login = async (req, res) => {
    try {
        const resultado = await usuarioService.loginUsuario(req.body);
        res.status(200).json({ 
            ok: true, 
            data: resultado 
        });
    } catch (error) {
        console.error('Error en login:', error.message);
        res.status(401).json({ 
            ok: false, 
            mensaje: error.message 
        });
    }
};

module.exports = {
    registrarse,
    login
};