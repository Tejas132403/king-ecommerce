const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Shop = require('./models/Shop');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing users
        await User.deleteMany({});
        await Shop.deleteMany({});
        console.log('Cleared existing User and Shop data.');

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

        console.log('Database seeding completed successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedData();
