const Product = require('../models/Product');

// Crear producto
const createProduct = async (productData) => {
    const newProduct = new Product(productData);
    return await newProduct.save();
};

// Obtener todos los productos
const getProducts = async () => {
    return await Product.find();
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
