import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('URI:', process.env.MONGODB_URI?.replace(/:[^:@]*@/, ':****@')); // Hide password in logs
    
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ MongoDB connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

testConnection();