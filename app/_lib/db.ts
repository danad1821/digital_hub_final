import mongoose from "mongoose";

const MONGODB_URI: any = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define MONGODB_URI in .env.local → https://mongodb.com/atlas"
  );
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Expose a typed cache on the global object so it survives HMR in dev
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache_AltaMaritime: MongooseCache | undefined;
}

let cached: MongooseCache;

if (!global._mongooseCache_AltaMaritime) {
  global._mongooseCache_AltaMaritime = { conn: null, promise: null };
}
cached = global._mongooseCache_AltaMaritime;

export async function connectToDatabase(): Promise<typeof mongoose> {
  // Try to get the URI inside the function call
  let uri = process.env.MONGODB_URI;

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    // If URI is missing, wait 500ms and try once more before crashing
    if (!uri) {
      await new Promise(resolve => setTimeout(resolve, 500));
      uri = process.env.MONGODB_URI;
    }

    if (!uri) throw new Error("MONGODB_URI is missing from environment");

    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
    }).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null; // Reset so the next refresh actually tries again
    throw e;
  }
}