const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Shop = require('../models/Shop');
const { protect, authorize } = require('../middleware/auth');

// All routes here are protected and require admin role
router.use(protect, authorize('admin'));

// @desc    Get all sellers and their shops
// @route   GET /api/admin/sellers
// @access  Private/Admin
router.get('/sellers', async (req, res) => {
    try {
        const sellers = await User.find({ role: 'seller' }).select('-password').populate('shop');
        res.json(sellers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Add a new seller and their shop
// @route   POST /api/admin/sellers
// @access  Private/Admin
router.post('/sellers', async (req, res) => {
    try {
        const { name, email, password, shopName, shopDescription } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create seller user
        const seller = new User({
            name,
            email,
            password,
            role: 'seller'
        });

        await seller.save();

        // Create shop for the seller
        const shop = new Shop({
            name: shopName,
            description: shopDescription || '',
            owner: seller._id,
            isApproved: true // Auto-approve shops created by admin
        });

        await shop.save();

        // Link shop to seller
        seller.shop = shop._id;
        await seller.save();

        const populatedSeller = await User.findById(seller._id).select('-password').populate('shop');
        res.status(201).json(populatedSeller);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete a seller and their shop
// @route   DELETE /api/admin/sellers/:id
// @access  Private/Admin
router.delete('/sellers/:id', async (req, res) => {
    try {
        const seller = await User.findById(req.params.id);
        
        if (!seller || seller.role !== 'seller') {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Delete associated shop
        if (seller.shop) {
            await Shop.findByIdAndDelete(seller.shop);
        }

        // Delete the seller user
        await User.findByIdAndDelete(seller._id);

        res.json({ message: 'Seller and associated shop removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
