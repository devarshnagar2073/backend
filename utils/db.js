import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const mongoURI = process.env.mongoURI || 'mongodb://127.0.0.1:27017/eventDatabase';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

