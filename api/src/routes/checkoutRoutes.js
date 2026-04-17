const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createCheckoutSession } = require('../controllers/checkoutController');

const router = express.Router();

router.post('/create-session', authMiddleware, createCheckoutSession);

module.exports = router;
