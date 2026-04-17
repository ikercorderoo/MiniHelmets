const mongoose = require('mongoose');

const cistellaItemSchema = new mongoose.Schema(
    {
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
            required: true,
            min: 1
        }
    },
    { _id: false }
);

const cistellaSchema = new mongoose.Schema(
    {
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true,
            unique: true
        },
        items: {
            type: [cistellaItemSchema],
            default: []
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Cistella', cistellaSchema);
