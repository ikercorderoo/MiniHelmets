const Cistella = require('../models/cistella');

const calcularTotal = (items) => {
    return items.reduce((acc, item) => acc + item.precio * item.quantitat, 0);
};

const getCistella = async (req, res) => {
    try {
        let cistella = await Cistella.findOne({ usuario: req.user.id });

        if (!cistella) {
            cistella = await Cistella.create({ usuario: req.user.id, items: [] });
        }

        return res.status(200).json({
            ok: true,
            data: {
                items: cistella.items,
                total: calcularTotal(cistella.items)
            }
        });
    } catch (error) {
        return res.status(500).json({ ok: false, mensaje: 'Error obteniendo la cistella' });
    }
};

const addItem = async (req, res) => {
    try {
        const { producto, nombre, precio, quantitat } = req.body;

        if (!producto || !nombre || precio === undefined) {
            return res.status(400).json({ ok: false, mensaje: 'Faltan datos del producto' });
        }

        let cistella = await Cistella.findOne({ usuario: req.user.id });
        if (!cistella) {
            cistella = await Cistella.create({ usuario: req.user.id, items: [] });
        }

        const qty = Number(quantitat) > 0 ? Number(quantitat) : 1;
        const existingItem = cistella.items.find((item) => String(item.producto) === String(producto));

        if (existingItem) {
            existingItem.quantitat += qty;
        } else {
            cistella.items.push({ producto, nombre, precio, quantitat: qty });
        }

        await cistella.save();

        return res.status(200).json({
            ok: true,
            mensaje: 'Producto anadido a la cistella',
            data: {
                items: cistella.items,
                total: calcularTotal(cistella.items)
            }
        });
    } catch (error) {
        return res.status(500).json({ ok: false, mensaje: 'Error anadiendo producto a la cistella' });
    }
};

const updateItemQuantitat = async (req, res) => {
    try {
        const { producto } = req.params;
        const { quantitat } = req.body;

        if (!Number.isInteger(quantitat) || quantitat < 1) {
            return res.status(400).json({ ok: false, mensaje: 'La quantitat debe ser un entero mayor a 0' });
        }

        const cistella = await Cistella.findOne({ usuario: req.user.id });
        if (!cistella) {
            return res.status(404).json({ ok: false, mensaje: 'Cistella no encontrada' });
        }

        const item = cistella.items.find((i) => String(i.producto) === String(producto));
        if (!item) {
            return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado en la cistella' });
        }

        item.quantitat = quantitat;
        await cistella.save();

        return res.status(200).json({
            ok: true,
            mensaje: 'Cantidad actualizada',
            data: {
                items: cistella.items,
                total: calcularTotal(cistella.items)
            }
        });
    } catch (error) {
        return res.status(500).json({ ok: false, mensaje: 'Error actualizando la cistella' });
    }
};

const removeItem = async (req, res) => {
    try {
        const { producto } = req.params;
        const cistella = await Cistella.findOne({ usuario: req.user.id });

        if (!cistella) {
            return res.status(404).json({ ok: false, mensaje: 'Cistella no encontrada' });
        }

        const initialLength = cistella.items.length;
        cistella.items = cistella.items.filter((item) => String(item.producto) !== String(producto));

        if (cistella.items.length === initialLength) {
            return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado en la cistella' });
        }

        await cistella.save();

        return res.status(200).json({
            ok: true,
            mensaje: 'Producto eliminado de la cistella',
            data: {
                items: cistella.items,
                total: calcularTotal(cistella.items)
            }
        });
    } catch (error) {
        return res.status(500).json({ ok: false, mensaje: 'Error eliminando producto de la cistella' });
    }
};

const clearCistella = async (req, res) => {
    try {
        const cistella = await Cistella.findOne({ usuario: req.user.id });

        if (!cistella) {
            return res.status(404).json({ ok: false, mensaje: 'Cistella no encontrada' });
        }

        cistella.items = [];
        await cistella.save();

        return res.status(200).json({
            ok: true,
            mensaje: 'Cistella vaciada',
            data: {
                items: [],
                total: 0
            }
        });
    } catch (error) {
        return res.status(500).json({ ok: false, mensaje: 'Error vaciando la cistella' });
    }
};

module.exports = {
    getCistella,
    addItem,
    updateItemQuantitat,
    removeItem,
    clearCistella
};
