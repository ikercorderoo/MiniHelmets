const Usuario = require('../models/Usuarios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Funcion registrar
const registrarUsuario = async ({ nombre, email, password }) => {
    // Validar si el email existeix
    const existe = await Usuario.findOne({ email });
    if (existe) throw new Error('Email ya está utilizado');
    
    // Crear el usuario
    const nuevoUsuario = new Usuario({
        nombre,
        email,
        password
    });
    
    await nuevoUsuario.save();
    
    // Generar token JWT
    const token = jwt.sign(
        { id: nuevoUsuario._id, email: nuevoUsuario.email },
        process.env.JWT_SECRET || 'tu_secret_key_aqui',
        { expiresIn: '24h' }
    );
    
    return {
        usuario: {
            id: nuevoUsuario._id,
            nombre: nuevoUsuario.nombre,
            email: nuevoUsuario.email
        },
        token
    };
};

// Función para hacer login
const loginUsuario = async ({ email, password }) => {
    // Buscar usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) throw new Error('Credenciales incorrectas');
    
    // Comparar contraseña
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) throw new Error('Credenciales incorrectas');
    
    // Generar token JWT
    const token = jwt.sign(
        { id: usuario._id, email: usuario.email },
        process.env.JWT_SECRET || 'tu_secret_key_aqui',
        { expiresIn: '24h' }
    );
    
    return {
        usuario: {
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email
        },
        token
    };
};

module.exports = {
    registrarUsuario,
    loginUsuario
};