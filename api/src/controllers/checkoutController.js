const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Pedido = require('../models/pedido');
const Product = require('../models/Product');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const createCheckoutSession = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!req.user?.id) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        if (!orderId) {
            return res.status(400).json({ message: 'orderId es obligatorio' });
        }

        const pedido = await Pedido.findById(orderId);
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        if (String(pedido.usuario) !== String(req.user.id)) {
            return res.status(403).json({ message: 'No puedes pagar este pedido' });
        }

        if (pedido.estado !== 'pending') {
            return res.status(400).json({ message: 'El pedido no está pendiente de pago' });
        }

        let totalVerificado = 0;
        const line_items = [];

        for (const item of pedido.items) {
            const product = await Product.findById(item.producto);
            if (!product) {
                return res.status(400).json({ message: `Producto no existe: ${item.producto}` });
            }

            if (product.stock < item.quantitat) {
                return res.status(400).json({ message: `Stock insuficiente para ${product.nombre}` });
            }

            totalVerificado += product.precio * item.quantitat;
            line_items.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: product.nombre
                    },
                    unit_amount: Math.round(product.precio * 100)
                },
                quantity: item.quantitat
            });
        }

        const totalRedondeado = Number(totalVerificado.toFixed(2));
        if (Number(pedido.total.toFixed(2)) !== totalRedondeado) {
            return res.status(400).json({ message: 'Total de pedido inconsistente' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            success_url: `${FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${FRONTEND_URL}/checkout/cancel`,
            metadata: {
                orderId: String(pedido._id)
            }
        });

        pedido.stripeSessionId = session.id;
        await pedido.save();

        return res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.error('Error en createCheckoutSession:', error);
        return res.status(400).json({ message: 'Error en el pagament' });
    }
};

const stripeWebhook = async (req, res) => {
    const signature = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const orderId = session.metadata?.orderId;

            if (orderId) {
                const pedido = await Pedido.findById(orderId);
                if (pedido) {
                    pedido.estado = 'paid';
                    pedido.stripePaymentIntentId = session.payment_intent || null;

                    for (const item of pedido.items) {
                        await Product.findByIdAndUpdate(
                            item.producto,
                            { $inc: { stock: -item.quantitat } }
                        );
                    }

                    await pedido.save();
                }
            }
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        console.error('Error webhook Stripe:', error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
};

module.exports = {
    createCheckoutSession,
    stripeWebhook
};
