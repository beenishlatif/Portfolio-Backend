import mongoose from "mongoose";
import dns from "dns";

// Fix for MongoDB Atlas SRV lookup failures on networks/ISPs whose default DNS
// can't resolve "mongodb+srv://..." records.
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Serverless-friendly connection caching: Vercel can reuse the same container
// across invocations, so we cache the connection promise instead of reconnecting
// (and instead of ever killing the process) on every request.
let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set in environment variables");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((mongooseInstance) => {
        console.log(`MongoDB connected: ${mongooseInstance.connection.host}`);
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset so the next request can retry instead of staying stuck on a dead promise
    cached.promise = null;
    console.error(`MongoDB connection error: ${error.message}`);
    // IMPORTANT: never call process.exit() here - on Vercel that kills the whole
    // serverless function and turns every request into a 500 with no CORS headers.
    throw error;
  }

  return cached.conn;
};

export default connectDB;