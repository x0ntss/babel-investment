import mongoose from 'mongoose';

// Environment variable validation
const MONGODB_URI = process.env.MONGO_URI;

console.log('🔍 Database Connection Check:');
console.log('MONGO_URI:', MONGODB_URI ? 'Set' : 'Missing');

if (!MONGODB_URI) {
  console.error('❌ MONGO_URI environment variable is required');
  throw new Error('MONGO_URI environment variable is required. Please add it to your .env.local file');
}

// Validate MongoDB URI format
if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
  throw new Error('Invalid MONGO_URI format. Must start with mongodb:// or mongodb+srv://');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('🔍 Attempting to connect to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection failed:', error.message);
      throw error;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect; 