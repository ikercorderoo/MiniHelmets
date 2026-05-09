const mongoose = require('mongoose');
const Usuario = require('./models/Usuarios');
const Product = require('./models/Product');
const Pedido = require('./models/pedido');

async function seedOrder() {
    try {
        await mongoose.connect('mongodb://iker:1234@localhost:27057/ecommerce?authSource=admin');
        console.log('Connected to MongoDB');

        const user = await Usuario.findOne({ email: 'user@minihelmets.com' });
        const product = await Product.findOne({ nombre: 'Casco Fernando Alonso' });

        if (!user || !product) {
            console.error('User or Product not found');
            process.exit(1);
        }

        const nuevoPedido = new Pedido({
            usuario: user._id,
            items: [{
                producto: product._id,
                nombre: product.nombre,
                precio: product.precio,
                quantitat: 1
            }],
            total: product.precio,
            nombre: user.nombre,
            adreca: 'Calle Falsa 123',
            ciutat: 'Barcelona',
            codi_postal: '08001',
            telefon: '600000000',
            metode_pagament: 'Targeta',
            estado: 'paid',
            fecha: new Date()
        });

        await nuevoPedido.save();
        console.log('Order seeded successfully for user@minihelmets.com');

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

seedOrder();
