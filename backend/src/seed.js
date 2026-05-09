require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Usuario = require('./models/Usuarios');
const Product = require('./models/Product');

const productos = [
    {
        nombre: 'Casco Fernando Alonso',
        precio: 59.99,
        imagen: '/images/alonso.png',
        descripcion: 'Réplica del icónico casco de Fernando Alonso en Aston Martin.',
        stock: 14,
        categoria: 'F1'
    },
    {
        nombre: 'Casco Marc Márquez',
        precio: 49.99,
        imagen: '/images/marquez.png',
        descripcion: 'El casco de "La Hormiga" de Cervera, Marc Márquez en MotoGP.',
        stock: 93,
        categoria: 'MotoGP'
    },
    {
        nombre: 'Casco Fabio Quartararo',
        precio: 45.99,
        imagen: '/images/quartararo.png',
        descripcion: 'Casco oficial de "El Diablo", Fabio Quartararo.',
        stock: 20,
        categoria: 'MotoGP'
    },
    {
        nombre: 'Casco Lewis Hamilton',
        precio: 55.99,
        imagen: '/images/hamilton.png',
        descripcion: 'Diseño exclusivo del 7 veces campeón del mundo Lewis Hamilton.',
        stock: 44,
        categoria: 'F1'
    },
    {
        nombre: 'Casco Ayrton Senna',
        precio: 65.00,
        imagen: '/images/senna.png',
        descripcion: 'El legendario casco amarillo de Ayrton Senna, tricampeón de F1.',
        stock: 5,
        categoria: 'Legend'
    },
    {
        nombre: 'Casco Carlos Sainz (Rally)',
        precio: 42.50,
        imagen: '/images/sainz.png',
        descripcion: 'Casco del "Matador" Carlos Sainz, leyenda del WRC.',
        stock: 10,
        categoria: 'Rally'
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://iker:1234@localhost:27057/ecommerce?authSource=admin');
        console.log('Conectado a MongoDB...');

        // Limpiar datos
        await Product.deleteMany({});
        await Usuario.deleteMany({});
        console.log('Datos antiguos eliminados.');

        // Insertar productos
        await Product.insertMany(productos);
        console.log('Productos de ejemplo insertados.');

        // Insertar usuarios de prueba
        const admin = new Usuario({
            nombre: 'Admin',
            email: 'admin@minihelmets.com',
            password: 'admin123',
            role: 'admin'
        });

        const user = new Usuario({
            nombre: 'Usuario Test',
            email: 'user@minihelmets.com',
            password: 'user123',
            role: 'client'
        });

        await admin.save();
        await user.save();
        console.log('Usuarios de prueba creados (admin@minihelmets.com y user@minihelmets.com)');

        mongoose.disconnect();
    } catch (error) {
        console.error('Error insertando datos:', error);
        process.exit(1);
    }
};

seedData();
