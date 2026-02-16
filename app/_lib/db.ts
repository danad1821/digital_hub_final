import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

// 1. Extend the global object to prevent multiple connections during hot reloads
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var _mongooseCache_Altamaritime: MongooseCache | undefined;
}

// 2. Use the existing connection if it exists
let cached = global._mongooseCache_Altamaritime || { conn: null, promise: null };

if (!global._mongooseCache_Altamaritime) {
  global._mongooseCache_Altamaritime = cached;
}

export async function connectToDatabase() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 5, // 3. Keep this small on Free Tier to avoid "Leakage" errors
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // 4. Reset if it fails so the next ping can try again
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}