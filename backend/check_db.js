const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Shop = require('./models/Shop');

dotenv.config();

// Fix for SRV resolution issues on some Windows/Node environments
const dns = require('dns');
dns.setServers(['8.8.8.8']);

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- DATABASE STATUS ---');

        const userCount = await User.countDocuments();
        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();
        const shopCount = await Shop.countDocuments();

        console.log(`Users:    ${userCount}`);
        console.log(`Products: ${productCount}`);
        console.log(`Orders:   ${orderCount}`);
        console.log(`Shops:    ${shopCount}`);
        
        if (productCount > 0) {
            const sampleProducts = await Product.find().limit(3).populate('seller', 'name email');
            console.log('\n--- SAMPLE PRODUCTS ---');
            sampleProducts.forEach(p => {
                console.log(`- ${p.name} ($${p.price}) | Stock: ${p.stock} | Seller: ${p.seller.name}`);
            });
        } else {
            console.log('\n[WARNING] No products found in the database!');
        }

        if (userCount > 0) {
            const sampleUsers = await User.find().limit(5);
            console.log('\n--- REGISTERED USERS ---');
            sampleUsers.forEach(u => {
                console.log(`- ${u.name} (${u.email}) [Role: ${u.role}]`);
            });
        }

        process.exit();
    } catch (err) {
        console.error('Database Check Error:', err);
        process.exit(1);
    }
};

checkDB();
