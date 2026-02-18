const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 3 // Validación extra del apéndice
    },
    descripcion: {
        type: String,
        required: true,
        minlength: 10, // Validación extra del apéndice
        maxlength: 500
    },
    precio: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    categoria: {
        type: String,
        required: true,
        enum: ['F1', 'MotoGP', 'Legend', 'Rally'] // Nuevas categorías con sentido
    },
    imagen: {
        type: String,
        required: false // Permitimos que sea opcional por si acaso, aunque el seed lo tiene
    }
}, {
    timestamps: true  // Esto añade automáticamente createdAt y updatedAt
});

module.exports = mongoose.model('Product', productSchema);