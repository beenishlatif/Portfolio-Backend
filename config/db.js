import mongoose from "mongoose";
import dns from "dns";

// Fix for MongoDB Atlas SRV lookup failures on networks/ISPs whose default DNS
// can't resolve "mongodb+srv://..." records. Forcing Cloudflare + Google DNS
// resolves this without touching OS-level network settings.
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;