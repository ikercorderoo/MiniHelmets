const productService = require('../services/productService');

// Crear producto
const createProduct = async (req, res, next) => {
    try {
        req.log.info({
            requestId: req.requestId,
            productData: {
                nombre: req.body.nombre,
                precio: req.body.precio
            }
        }, 'Creating new product');
        const product = await productService.createProduct(req.body);
        res.status(201).json({ status: 'success', data: product });
    } catch (error) {
        req.log.error({
            requestId: req.requestId,
            error: error.message
        }, 'Error creating product');
        error.statusCode = 400;
        next(error);
    }
};

// Obtener todos los productos
const getProducts = async (req, res, next) => {
    try {
        req.log.info({
            requestId: req.requestId,
            query: req.query
        }, 'Getting product list');
        const filters = {
            nombre: req.query.nombre,
            categoria: req.query.categoria
        };
        const products = await productService.getProducts(filters);
        res.status(200).json({ status: 'success', data: products });
    } catch (error) {
        req.log.error({
            requestId: req.requestId,
            error: error.message
        }, 'Error getting products');
        next(error);
    }
};

// Obtener un producto por ID
const getProductById = async (req, res, next) => {
    try {
        req.log.info({
            requestId: req.requestId,
            productId: req.params.id
        }, 'Getting product by ID');
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            req.log.warn({
                requestId: req.requestId,
                productId: req.params.id
            }, 'Product not found');
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.status(200).json({ status: 'success', data: product });
    } catch (error) {
        req.log.error({
            requestId: req.requestId,
            productId: req.params.id,
            error: error.message
        }, 'Error getting product by ID');
        next(error);
    }
};

// Actualizar producto
const updateProduct = async (req, res, next) => {
    try {
        req.log.info({
            requestId: req.requestId,
            productId: req.params.id
        }, 'Updating product');
        const updatedProduct = await productService.updateProduct(req.params.id, req.body);
        res.status(200).json({ status: 'success', data: updatedProduct });
    } catch (error) {
        req.log.error({
            requestId: req.requestId,
            productId: req.params.id,
            error: error.message
        }, 'Error updating product');
        error.statusCode = 400;
        next(error);
    }
};

// Eliminar producto
const deleteProduct = async (req, res, next) => {
    try {
        req.log.info({
            requestId: req.requestId,
            productId: req.params.id
        }, 'Deleting product');
        await productService.deleteProduct(req.params.id);
        res.status(200).json({ status: 'success', message: 'Producto eliminado correctamente' });
    } catch (error) {
        req.log.error({
            requestId: req.requestId,
            productId: req.params.id,
            error: error.message
        }, 'Error deleting product');
        next(error);
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};

