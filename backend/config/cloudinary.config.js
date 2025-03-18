import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables only if not already loaded
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  dotenv.config();
}

// Ensure all required Cloudinary credentials are present
const requiredEnvVars = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`❌ Missing environment variable: ${varName}`);
    process.exit(1); // Exit the app if credentials are missing
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
