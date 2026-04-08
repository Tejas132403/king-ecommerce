const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Shop = require('./models/Shop');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Shop.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        console.log('Cleared existing User, Shop, Product, and Order data.');

        // 1. Create Admin
        console.log('Creating Admin...');
        const admin = new User({
            name: 'King',
            email: 'king@gmail.com',
            password: '1234',
            role: 'admin'
        });
        await admin.save();
        console.log('Admin account created: king@gmail.com');

        // 2. Create Customer
        console.log('Creating Customer...');
        const customer = new User({
            name: 'Tejas',
            email: 'tejas@gmail.com',
            password: '1234',
            role: 'customer'
        });
        await customer.save();
        console.log('Customer account created: tejas@gmail.com');

        // 3. Create Shop Holder (Seller)
        console.log('Creating Seller...');
        const seller = new User({
            name: 'Mart',
            email: 'mart@gmail.com',
            password: '1234',
            role: 'seller'
        });
        await seller.save();
        console.log('Seller user saved.');
        
        // Create a default shop for the seller
        console.log('Creating Shop...');
        const shop = new Shop({
            name: 'Mart Elite Store',
            owner: seller._id,
            description: 'The primary merchant outlet for premium KING products.'
        });
        await shop.save();
        console.log('Shop saved.');
        
        seller.shop = shop._id;
        await seller.save();
        console.log('Seller account linked to Shop.');

        // 4. Create Test Products
        console.log('Creating Products...');
        const products = [
            {
                name: 'Premium Hoodie',
                description: 'High-quality cotton hoodie with KING embroidery.',
                price: 49.99,
                category: 'Clothing',
                stock: 100,
                image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop',
                seller: seller._id,
                shop: shop._id
            },
            {
                name: 'Leather Watch',
                description: 'Classic analog watch with a brown leather strap.',
                price: 89.00,
                category: 'Accessories',
                stock: 25,
                image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop',
                seller: seller._id,
                shop: shop._id
            },
            {
                name: 'Smart Backpack',
                description: 'Waterproof backpack with built-in USB charging.',
                price: 55.50,
                category: 'Bags',
                stock: 50,
                image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
                seller: seller._id,
                shop: shop._id
            }
        ];

        await Product.insertMany(products);
        console.log('3 Sample products added!');

        console.log('Database seeding completed successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedData();
