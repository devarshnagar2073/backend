import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './model/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.mongoURI);
    console.log('🔌 MongoDB Connected for Seeding...');

    const adminUser = {
      name: "Super Admin",
      email: "admin@example.com",
      password: "adminpassword123",
      role: "admin"
    };

    const userExists = await User.findOne({ email: adminUser.email });

    if (userExists) {
      console.log('⚠️  Admin user already exists. No changes made.');
      process.exit();
    }

    await User.create(adminUser);
    
    console.log('✅ Success! New Admin User created.');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🔑 Password: ${adminUser.password}`);
    
    process.exit();
    
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();