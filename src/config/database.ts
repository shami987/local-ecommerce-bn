import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('MONGODB_URI is not defined in environment variables');
      process.exit(1);
    }

    console.log('Attempting to connect to MongoDB...');
    
    // Set mongoose options
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    
    if (error.code === 'EREFUSED' || error.code === 'ENOTFOUND') {
      console.log('\n🔧 Network/DNS Issue - Try these steps:');
      console.log('1. Check your internet connection');
      console.log('2. Verify MongoDB Atlas cluster is running');
      console.log('3. Add your IP to MongoDB Atlas whitelist');
      console.log('4. Try using a different network (mobile hotspot)');
    }
    
    process.exit(1);
  }
};