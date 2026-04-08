const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const clearDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        for (let collection of collections) {
            await mongoose.connection.db.dropCollection(collection.name);
            console.log(`Dropped collection: ${collection.name}`);
        }
        
        console.log('Database cleared successfully!');
        process.exit();
    } catch (err) {
        console.error('Error clearing database:', err);
        process.exit(1);
    }
};

clearDB();
