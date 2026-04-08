const Order = require('../models/Order');

// @desc Create new order
exports.createOrder = async (req, res) => {
    const { items, totalAmount, address } = req.body;
    try {
        if (!items || items.length === 0) return res.status(400).json({ message: 'No order items' });
        const order = await Order.create({
            customer: req.user._id,
            items,
            totalAmount,
            address
        });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get user orders
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id }).populate('items.product');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get all orders (Admin Only)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('customer', 'name email').populate('items.product');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
