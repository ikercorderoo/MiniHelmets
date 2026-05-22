const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createCheckoutSession, verifyCheckoutSession } = require('../controllers/checkoutController');

const router = express.Router();

router.post('/create-session', authMiddleware, createCheckoutSession);
router.post('/verify-session', authMiddleware, verifyCheckoutSession);

module.exports = router;
