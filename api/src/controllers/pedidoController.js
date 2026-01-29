const Pedido = require('../models/pedido');

// Crear un nuevo pedido
exports.createPedido = async (req, res) => {
    try {
        const { items, total } = req.body;

        const nuevoPedido = new Pedido({
            items,
            total
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
