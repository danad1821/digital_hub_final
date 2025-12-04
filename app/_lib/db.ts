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
  var _mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache;

if (!global._mongooseCache) {
  global._mongooseCache = { conn: null, promise: null };
}
cached = global._mongooseCache;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      // add any other options you need here
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("MongoDB connected successfully");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("MongoDB connection failed:", err);
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    console.error("Connection attempt failed, will retry on next call");
    throw e;
  }
}