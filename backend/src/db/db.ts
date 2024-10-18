import mongoose from 'mongoose';

// Connect to MongoDB
export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI ? process.env.MONGO_URI : '';
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
};