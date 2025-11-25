const Usuario = require('../models/Usuarios');
const jwt = require('jsonwebtoken');

const generarAccessToken = (usuario) => {
    return jwt.sign(
        { 
            id: usuario._id, 
            email: usuario.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
};

const generarRefreshToken = (usuario) => {
    return jwt.sign(
        { 
            id: usuario._id, 
            email: usuario.email 
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};

const registrarUsuario = async ({ nombre, email, password }) => {
    const existe = await Usuario.findOne({ email });
    if (existe) {
        throw new Error('El email ya está registrado');
    }
    
    const nuevoUsuario = new Usuario({
        nombre,
        email,
        password
    });
    
    await nuevoUsuario.save();
    
    const accessToken = generarAccessToken(nuevoUsuario);
    const refreshToken = generarRefreshToken(nuevoUsuario);
    
    nuevoUsuario.refreshTokens.push({ token: refreshToken });
    await nuevoUsuario.save();
    
    return {
        usuario: {
            id: nuevoUsuario._id,
            nombre: nuevoUsuario.nombre,
            email: nuevoUsuario.email
        },
        accessToken,
        refreshToken
    };
};

const loginUsuario = async ({ email, password }) => {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        throw new Error('Credenciales incorrectas');
    }
    
    const esValida = await usuario.compararPassword(password);
    if (!esValida) {
        throw new Error('Credenciales incorrectas');
    }
    
    const accessToken = generarAccessToken(usuario);
    const refreshToken = generarRefreshToken(usuario);
    
    usuario.refreshTokens.push({ token: refreshToken });
    await usuario.save();
    
    return {
        usuario: {
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email
        },
        accessToken,
        refreshToken
    };
};

const renovarTokens = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        const usuario = await Usuario.findById(decoded.id);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        
        const tokenIndex = usuario.refreshTokens.findIndex(
            rt => rt.token === refreshToken
        );
        
        if (tokenIndex === -1) {
            usuario.refreshTokens = [];
            await usuario.save();
            throw new Error('Token inválido o reutilizado. Por seguridad, se han cerrado todas las sesiones.');
        }
        
        usuario.refreshTokens.splice(tokenIndex, 1);
        
        const nuevoAccessToken = generarAccessToken(usuario);
        const nuevoRefreshToken = generarRefreshToken(usuario);
        
        usuario.refreshTokens.push({ token: nuevoRefreshToken });
        await usuario.save();
        
        return {
            accessToken: nuevoAccessToken,
            refreshToken: nuevoRefreshToken
        };
        
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new Error('Token de refresco inválido');
        }
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token de refresco expirado. Por favor, inicia sesión nuevamente');
        }
        throw error;
    }
};

const logout = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        const usuario = await Usuario.findById(decoded.id);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        
        usuario.refreshTokens = usuario.refreshTokens.filter(
            rt => rt.token !== refreshToken
        );
        await usuario.save();
        
        return { mensaje: 'Sesión cerrada correctamente' };
        
    } catch (error) {
        throw new Error('Error al cerrar sesión');
    }
};

module.exports = {
    registrarUsuario,
    loginUsuario,
    renovarTokens,
    logout
};
