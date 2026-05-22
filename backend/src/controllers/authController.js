const usuarioService = require('../services/usuarioServices');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
    try {
        req.log.info({
            email: req.body.email
        }, 'Attempting user registration');

        const resultado = await usuarioService.registrarUsuario(req.body);

        req.log.info({
            userId: resultado.usuario?.id || resultado.usuario?._id,
            email: resultado.usuario?.email
        }, 'User registered successfully');

        res.status(201).json({ 
            ok: true, 
            mensaje: 'Usuario registrado correctamente',
            data: resultado 
        });
    } catch (error) {
        req.log.error({
            email: req.body.email,
            error: error.message
        }, 'Error in registration');
        error.statusCode = 400;
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        req.log.info({
            email: req.body.email
        }, 'Attempting user login');

        const resultado = await usuarioService.loginUsuario(req.body);

        req.log.info({
            userId: resultado.usuario?.id || resultado.usuario?._id,
            email: resultado.usuario?.email
        }, 'User logged in successfully');

        res.status(200).json({ 
            ok: true,
            mensaje: 'Login exitoso',
            data: resultado 
        });
    } catch (error) {
        req.log.warn({
            email: req.body.email,
            error: error.message
        }, 'Invalid login attempt');
        error.statusCode = 401;
        next(error);
    }
};

const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(400).json({ 
                ok: false, 
                mensaje: 'Refresh token requerido' 
            });
        }
        
        let userId = null;
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            userId = decoded.id;
        } catch (err) {
            // Silently fail decoding if token is corrupt, service renovarTokens will throw properly
        }

        const nuevosTokens = await usuarioService.renovarTokens(refreshToken);

        req.log.info({
            userId
        }, 'Tokens renewed successfully');

        res.status(200).json({ 
            ok: true,
            mensaje: 'Tokens renovados correctamente',
            data: nuevosTokens 
        });
    } catch (error) {
        req.log.error({
            requestId: req.requestId,
            error: error.message
        }, 'Error renewing tokens');
        error.statusCode = 401;
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(400).json({ 
                ok: false, 
                mensaje: 'Refresh token requerido' 
            });
        }

        let userId = null;
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            userId = decoded.id;
        } catch (err) {
            // Silently fail, let service handle validation
        }
        
        const resultado = await usuarioService.logout(refreshToken);

        req.log.info({
            userId
        }, 'User logged out');

        res.status(200).json({ 
            ok: true,
            mensaje: resultado.mensaje 
        });
    } catch (error) {
        req.log.error({
            requestId: req.requestId,
            error: error.message
        }, 'Error in logout');
        error.statusCode = 400;
        next(error);
    }
};

const getUsuarios = async (req, res, next) => {
    try {
        req.log.info({
            requestId: req.requestId,
            adminId: req.user?.id
        }, 'Admin fetching all users');

        const usuarios = await usuarioService.obtenerTodosLosUsuarios();
        res.status(200).json({ 
            ok: true,
            data: usuarios 
        });
    } catch (error) {
        req.log.error({
            requestId: req.requestId,
            error: error.message
        }, 'Error fetching users');
        next(error);
    }
};

module.exports = {
    register,
    login,
    refresh,
    logout,
    getUsuarios
};