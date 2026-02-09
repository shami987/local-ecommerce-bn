// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import { UserModel } from '../models/User';
import { hashPassword } from '../utils/password';

async function addUser() {
  try {
    console.log('🌱 Adding user...\n');

    // Connect to database
    await connectDB();

    const userData = {
      email: 'shami@gmail.com',
      password: '12345678',
      name: 'shami',
      role: 'customer' as const,
    };

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      console.log(`⚠️  User with email ${userData.email} already exists.`);
      console.log('   Updating user...');
      
      const hashedPassword = await hashPassword(userData.password);
      existingUser.name = userData.name;
      existingUser.password = hashedPassword;
      existingUser.role = userData.role;
      await existingUser.save();
      
      console.log(`✅ User updated: ${existingUser.name} (${existingUser.email})`);
    } else {
      // Create new user
      const hashedPassword = await hashPassword(userData.password);
      const user = await UserModel.create({
        ...userData,
        password: hashedPassword,
      });
      console.log(`✅ User created: ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role}`);
    }

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error adding user:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

addUser();
