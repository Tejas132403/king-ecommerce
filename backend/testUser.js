const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const testUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected...');
        
        const newUser = new User({
            name: 'Test',
            email: 'test@test.com',
            password: 'password123',
            role: 'customer'
        });
        
        console.log('Saving user...');
        await newUser.save();
        console.log('User saved successfully!');
        
        process.exit();
    } catch (err) {
        console.error('Error detail:', err);
        process.exit(1);
    }
};

testUser();
