import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables only if not already loaded
if (!process.env.MONGODB_URL) {
  dotenv.config();
}

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      console.error("❌ MONGODB_URL is missing in environment variables.");
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URL);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
