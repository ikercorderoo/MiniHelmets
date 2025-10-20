const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
}, {
    timestamps: true  // Esto añade automáticamente createdAt y updatedAt
});

module.exports = mongoose.model('Product', productSchema);