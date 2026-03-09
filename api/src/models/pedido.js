const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    items: [{
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        nombre: {
            type: String,
            required: true
        },
        precio: {
            type: Number,
            required: true
        },
        quantitat: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    // Nuevos campos para Checkout (Sessió 14)
    adreca: {
        type: String,
        required: [true, 'La dirección es obligatoria']
    },
    ciutat: {
        type: String,
        required: [true, 'La ciudad es obligatoria']
    },
    codi_postal: {
        type: String,
        required: [true, 'El código postal es obligatorio']
    },
    telefon: {
        type: String,
        required: [true, 'El teléfono es obligatorio']
    },
    metode_pagament: {
        type: String,
        required: true,
        enum: ['Targeta', 'PayPal', 'Efectiu'] // Validación enum según Apéndice C
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Pedido', pedidoSchema);
