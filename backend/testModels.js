const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Shop = require('./models/Shop');

dotenv.config();

const testModels = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected with both models...');
        process.exit();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

testModels();
