const productService = require('../services/productService');

// Crear producto
const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json({ status: 'success', data: product });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

// Obtener todos los productos
const getProducts = async (req, res) => {
    try {
        const products = await productService.getProducts();
        res.status(200).json({ status: 'success', data: products });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
// Obtener un producto por ID
const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.status(200).json({ status: 'success', data: product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Actualizar producto
const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body);
        res.status(200).json({ status: 'success', data: updatedProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

// Eliminar producto
const deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.status(200).json({ status: 'success', message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
