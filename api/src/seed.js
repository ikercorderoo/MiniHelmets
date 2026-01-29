require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Product = require('./models/Product');

const productos = [
    {
        nombre: 'Casco Red Bull',
        precio: 29.99,
        imagen: 'https://m.media-amazon.com/images/I/61S1gS91fVL._AC_SL1500_.jpg',
        descripcion: 'Mini casco oficial de Red Bull Racing',
        stock: 10
    },
    {
        nombre: 'Casco Mercedes',
        precio: 39.99,
        imagen: 'https://m.media-amazon.com/images/I/71wZwG5a2oL._AC_SL1500_.jpg',
        descripcion: 'Réplica exacta del casco de Lewis Hamilton',
        stock: 5
    },
    {
        nombre: 'Casco Ferrari',
        precio: 49.99,
        imagen: 'https://m.media-amazon.com/images/I/71-k9fGk+XL._AC_SL1500_.jpg',
        descripcion: 'Edición limitada del casco de Charles Leclerc',
        stock: 3
    },
    {
        nombre: 'Casco Aston Martin',
        precio: 59.99,
        imagen: 'https://m.media-amazon.com/images/I/71O8+c-y+4L._AC_SL1500_.jpg',
        descripcion: 'El casco de Fernando Alonso 2024',
        stock: 8
    }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://iker:1234@localhost:27057/ecommerce?authSource=admin')
    .then(async () => {
        console.log('Conectado a MongoDB...');

        try {
            await Product.deleteMany({}); // Borrar productos viejos
            console.log('Productos antiguos eliminados.');

            await Product.insertMany(productos);
            console.log('4 Productos de ejemplo insertados correctamente.');
        } catch (error) {
            console.error('Error insertando datos:', error);
        }

        mongoose.disconnect();
    })
    .catch(err => {
        console.error('Error conectando a MongoDB:', err);
        process.exit(1);
    });
