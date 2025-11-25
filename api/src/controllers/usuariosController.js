const usuarioService = require('../services/usuarioServices');

const registrarse = async (req, res) => {
    try {
        const resultado = await usuarioService.registrarUsuario(req.body);
        res.status(201).json({ 
            ok: true, 
            mensaje: 'Usuario registrado correctamente',
            data: resultado 
        });
    } catch (error) {
        console.error('Error en registro:', error.message);
        res.status(400).json({ 
            ok: false, 
            mensaje: error.message 
        });
    }
};

const login = async (req, res) => {
    try {
        const resultado = await usuarioService.loginUsuario(req.body);
        res.status(200).json({ 
            ok: true,
            mensaje: 'Login exitoso',
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

const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(400).json({ 
                ok: false, 
                mensaje: 'Refresh token requerido' 
            });
        }
        
        const nuevosTokens = await usuarioService.renovarTokens(refreshToken);
        res.status(200).json({ 
            ok: true,
            mensaje: 'Tokens renovados correctamente',
            data: nuevosTokens 
        });
    } catch (error) {
        console.error('Error renovando tokens:', error.message);
        res.status(401).json({ 
            ok: false, 
            mensaje: error.message 
        });
    }
};

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(400).json({ 
                ok: false, 
                mensaje: 'Refresh token requerido' 
            });
        }
        
        const resultado = await usuarioService.logout(refreshToken);
        res.status(200).json({ 
            ok: true,
            mensaje: resultado.mensaje 
        });
    } catch (error) {
        console.error('Error en logout:', error.message);
        res.status(400).json({ 
            ok: false, 
            mensaje: error.message 
        });
    }
};

module.exports = {
    registrarse,
    login,
    refresh,
    logout
};