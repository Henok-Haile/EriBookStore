import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.config.js";

// Cloudinary Storage Configurations
const storageConfig = (folder, filePrefix) => 
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `EriBookStore/${folder}`,
      allowed_formats: ["jpg", "jpeg", "png"],
      public_id: (req, file) => `${filePrefix}-${Date.now()}-${file.originalname}`,
    },
  });

// Storage for Different Uploads
const bookStorage = storageConfig("Books", "book");
const avatarStorage = storageConfig("Avatars", "avatar");
const testimonialStorage = storageConfig("Testimonials", "testimonial");

// Multer Middleware
export const uploadCoverImage = multer({ storage: bookStorage }).single("coverImage");
export const uploadAvatar = multer({ storage: avatarStorage }).single("avatar");
export const uploadTestimonialImage = multer({ storage: testimonialStorage }).single("image");
