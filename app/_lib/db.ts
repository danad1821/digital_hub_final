import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var _mongooseCache_Altamaritime: MongooseCache | undefined;
}

let cached = global._mongooseCache_Altamaritime || { conn: null, promise: null };

if (!global._mongooseCache_Altamaritime) {
  global._mongooseCache_Altamaritime = cached;
}

export async function connectToDatabase() {
  // If we already have a healthy connection, use it
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If no connection is in progress, start one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000, // Increased for Hostinger stability
      socketTimeoutMS: 45000,
      // Force IPv4 as Hostinger IPv6 can cause auth handshaking issues
      family: 4, 
    };

    console.log("Attempting new MongoDB connection...");

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("MongoDB Connected Successfully");
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // CRITICAL: If it fails, we MUST clear the promise so the NEXT request can try again
    cached.promise = null; 
    cached.conn = null;
    console.error("MongoDB Connection Error:", e);
    throw e; // Throw so your API route can catch it and send a 500, not a 503 crash
  }

  return cached.conn;
}