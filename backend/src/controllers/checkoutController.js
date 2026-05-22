const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? require('stripe')(stripeSecretKey) : null;
const Pedido = require('../models/pedido');
const Product = require('../models/Product');
const logger = require('../config/logger');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const createCheckoutSession = async (req, res, next) => {
    const authUserId = req.user?.id || req.user?.userId;
    const { orderId } = req.body;
    try {
        if (!stripe) {
            return res.status(500).json({ message: 'Stripe no configurado en el servidor' });
        }

        if (!authUserId) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        if (!orderId) {
            return res.status(400).json({ message: 'orderId es obligatorio' });
        }

        const pedido = await Pedido.findById(orderId);
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        if (String(pedido.usuario) !== String(authUserId)) {
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

        req.log.info({
            orderId: pedido._id,
            userId: authUserId,
            total: pedido.total
        }, 'Order verified, initiating Stripe checkout session');

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

        req.log.info({
            orderId: pedido._id,
            userId: authUserId,
            sessionId: session.id
        }, 'Stripe checkout session created successfully');

        pedido.stripeSessionId = session.id;
        await pedido.save();

        return res.status(200).json({ sessionId: session.id, url: session.url });
    } catch (error) {
        req.log.error({
            orderId,
            userId: authUserId,
            error: error.message
        }, 'Payment session creation failed');
        error.statusCode = 400;
        error.message = 'Error en el pagament';
        next(error);
    }
};

const stripeWebhook = async (req, res) => {
    const signature = req.headers['stripe-signature'];
    const log = req.log || logger;

    try {
        if (!stripe) {
            return res.status(500).send('Stripe no configurado');
        }
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            return res.status(500).send('Webhook secret no configurado');
        }

        const event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        log.info({ eventType: event.type }, 'Stripe webhook event received');

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const orderId = session.metadata?.orderId;

            if (orderId) {
                const pedido = await Pedido.findById(orderId);
                if (pedido && pedido.estado === 'pending') {
                    pedido.estado = 'paid';
                    pedido.stripePaymentIntentId = session.payment_intent || null;

                    for (const item of pedido.items) {
                        await Product.findByIdAndUpdate(
                            item.producto,
                            { $inc: { stock: -item.quantitat } }
                        );
                    }

                    await pedido.save();
                    
                    log.info({
                        orderId,
                        userId: pedido.usuario,
                        total: pedido.total
                    }, 'Payment succeeded: Order set to paid');
                }
            }
        }
        
        if (event.type === 'checkout.session.expired' || event.type === 'payment_intent.payment_failed') {
            const sessionOrIntent = event.data.object;
            const orderId = sessionOrIntent?.metadata?.orderId;
            if (orderId) {
                await Pedido.findByIdAndUpdate(orderId, { estado: 'cancelled' });
                
                log.warn({
                    orderId,
                    eventType: event.type
                }, 'Payment failed or expired: Order set to cancelled');
            }
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        log.error({
            error: error.message
        }, 'Error processing Stripe webhook');
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
};

const verifyCheckoutSession = async (req, res, next) => {
    const { sessionId } = req.body;
    try {
        if (!stripe) return res.status(500).json({ message: 'Stripe no configurado' });

        if (!sessionId) return res.status(400).json({ message: 'Session ID requerido' });

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const orderId = session.metadata?.orderId;
            if (orderId) {
                const pedido = await Pedido.findById(orderId);
                if (pedido && pedido.estado === 'pending') {
                    pedido.estado = 'paid';
                    pedido.stripePaymentIntentId = session.payment_intent || null;

                    for (const item of pedido.items) {
                        await Product.findByIdAndUpdate(
                            item.producto,
                            { $inc: { stock: -item.quantitat } }
                        );
                    }
                    await pedido.save();

                    req.log.info({
                        orderId,
                        userId: pedido.usuario,
                        total: pedido.total
                    }, 'Payment verified successfully and order updated to paid');
                }
            }
            return res.status(200).json({ success: true, message: 'Pago verificado correctamente' });
        }
        
        req.log.warn({
            sessionId
        }, 'Verification completed: Payment status is not paid');

        return res.status(400).json({ success: false, message: 'Pago no completado' });
    } catch (error) {
        req.log.error({
            sessionId,
            error: error.message
        }, 'Error verifying checkout session');
        error.statusCode = 500;
        next(error);
    }
};

module.exports = {
    createCheckoutSession,
    stripeWebhook,
    verifyCheckoutSession
};
