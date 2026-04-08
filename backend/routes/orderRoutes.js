const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus, getSellerOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/seller', protect, authorize('seller'), getSellerOrders);
router.get('/', protect, authorize('admin'), getAllOrders);
router.put('/:id', protect, authorize('seller', 'admin'), updateOrderStatus);

module.exports = router;

