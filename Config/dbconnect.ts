import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function connect() {
    try {
        const uri = process.env.MONGO_URI || '';
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = { connect };

