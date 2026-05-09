const Product = require('../models/Product');

// Crear producto
const createProduct = async (productData) => {
    const newProduct = new Product(productData);
    return await newProduct.save();
};

// Obtener todos los productos (con filtrado opcional)
const getProducts = async (filters = {}) => {
    let query = {};
    if (filters.nombre) {
        query.nombre = { $regex: filters.nombre, $options: 'i' };
    }
    if (filters.categoria) {
        query.categoria = filters.categoria;
    }
    return await Product.find(query);
};

const getProductById = async (id) => {
    return await Product.findById(id); // <-- Esta es la que faltaba
};

// Actualizar producto
const updateProduct = async (id, productData) => {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
};

// Eliminar producto
const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
