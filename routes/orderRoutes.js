const express = require('express');
const router = express.Router();
const { createOrder, verifyOrder, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.post('/verify', protect, verifyOrder);
router.get('/myorders', protect, getMyOrders);

module.exports = router;
