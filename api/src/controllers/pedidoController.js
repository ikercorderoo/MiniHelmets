const Pedido = require('../models/pedido');
const Product = require('../models/Product');

// Crear un nuevo pedido
exports.createPedido = async (req, res) => {
    try {
        const { items, total, nombre, adreca, ciutat, codi_postal, telefon, metode_pagament } = req.body;

        if (!req.user?.id) {
            return res.status(401).json({ mensaje: 'Usuario no autenticado' });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ mensaje: 'La cistella no puede estar vacía' });
        }

        if (!nombre || !adreca || !ciutat || !codi_postal || !telefon) {
            return res.status(400).json({ mensaje: 'Faltan datos de envío obligatorios' });
        }

        let totalCalculado = 0;
        const itemsValidados = [];

        for (const item of items) {
            const productId = item.producto;
            const cantidad = Number(item.quantitat);

            if (!productId || !Number.isInteger(cantidad) || cantidad < 1) {
                return res.status(400).json({ mensaje: 'Productos o cantidades inválidas' });
            }

            const productoDB = await Product.findById(productId);
            if (!productoDB) {
                return res.status(400).json({ mensaje: `Producto no existe: ${productId}` });
            }

            if (productoDB.stock < cantidad) {
                return res.status(400).json({ mensaje: `Stock insuficiente para ${productoDB.nombre}` });
            }

            const subtotal = productoDB.precio * cantidad;
            totalCalculado += subtotal;

            itemsValidados.push({
                producto: productoDB._id,
                nombre: productoDB.nombre,
                precio: productoDB.precio,
                quantitat: cantidad
            });
        }

        const totalRedondeado = Number(totalCalculado.toFixed(2));
        const totalFrontend = Number(Number(total).toFixed(2));
        if (totalFrontend !== totalRedondeado) {
            return res.status(400).json({ mensaje: 'Total inválido. Recalcula la compra.' });
        }

        const nuevoPedido = new Pedido({
            usuario: req.user.id,
            items: itemsValidados,
            total: totalRedondeado,
            nombre,
            adreca,
            ciutat,
            codi_postal,
            telefon,
            metode_pagament,
            estado: 'pending'
        });

        const pedidoGuardado = await nuevoPedido.save();

        res.status(201).json({
            mensaje: 'Pedido creado exitosamente',
            pedido: pedidoGuardado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al crear el pedido' });
    }
};

// Obtener pedidos del usuario autenticado
exports.getMisPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find({ usuario: req.user.id }).sort({ fecha: -1 });
        res.json({ ok: true, data: pedidos });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al obtener pedidos' });
    }
};

// Obtener todos los pedidos (solo admin)
exports.getAllPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find().populate('usuario', 'nombre email').sort({ fecha: -1 });
        res.json({ ok: true, data: pedidos });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al obtener todos los pedidos' });
    }
};

// Obtener estadísticas para gráficos (solo admin)
exports.getStats = async (req, res) => {
    try {
        // Ejemplo: Ventas por día en los últimos 7 días
        const sieteDiasAtras = new Date();
        sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 7);

        const stats = await Pedido.aggregate([
            { $match: { fecha: { $gte: sieteDiasAtras } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } },
                    totalVentas: { $sum: "$total" },
                    cantidadPedidos: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json({ ok: true, data: stats });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al obtener estadísticas' });
    }
};
