import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please set MONGODB_URI in .env");
}

const cached = (globalThis as Record<string, unknown>) as {
  _mongooseConn?: typeof mongoose;
  _mongoosePromise?: Promise<typeof mongoose>;
};

export async function connectDB() {
  if (cached._mongooseConn) return cached._mongooseConn;
  if (!cached._mongoosePromise) {
    cached._mongoosePromise = mongoose.connect(MONGODB_URI);
  }
  cached._mongooseConn = await cached._mongoosePromise;
  return cached._mongooseConn;
}
