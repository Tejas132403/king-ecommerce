const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc Register User / Seller
exports.register = async (req, res) => {
    const { name, email, password, role, shopName, shopDescription } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password, role });
        
        if (role === 'seller') {
            const Shop = require('../models/Shop');
            const shop = await Shop.create({
                name: shopName || `${name}'s Store`,
                description: shopDescription || '',
                owner: user._id,
                isApproved: false
            });
            user.shop = shop._id;
            await user.save();
        }

        const token = generateToken(user._id);

        res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        res.status(201).json({ 
            _id: user._id, name: user.name, email: user.email, role: user.role, token 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            const token = generateToken(user._id);
            res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
            res.json({ 
                _id: user._id, name: user.name, email: user.email, role: user.role, token 
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Logout
exports.logout = (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.json({ message: 'Logged out' });
};

// @desc Get Profile
exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
