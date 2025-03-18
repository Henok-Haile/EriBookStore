import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Title must be at least 2 characters long"],
    },
    author: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Author name must be at least 3 characters long"],
    },
    publishYear: {
      type: Number,
      required: true,
      min: [1800, "Publish year must be after 1800"],
      max: [new Date().getFullYear(), "Publish year cannot be in the future"],
    },
    coverImage: {
      type: String,
      required: true, // Store the Cloudinary image URL
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Fiction", "Non-Fiction", "Science", "Self-Help", "History", "Romance",
        "Thriller", "Fantasy", "Business", "Biography", "Children", "Others",
      ],
    },
    format: {
      type: String,
      required: true,
      enum: ["Paperback", "Hardcover", "eBook", "Audiobook"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0, // Discount in percentage (e.g., 10 for 10% off)
    },
    salePrice: {
      type: Number, // Auto-calculated sale price
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 10, // Default stock quantity
    },
    tags: [{ type: String, trim: true }], // Keywords for better search
    popularityScore: {
      type: Number,
      default: 0, // Based on sales/views
    },
    averageRating: {
      type: Number,
      default: 0, // Store the book's average rating
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isApproved: { 
      type: Boolean, 
      default: false 
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to calculate sale price
bookSchema.pre("save", function (next) {
  this.salePrice = this.price - (this.price * this.discount) / 100;
  if (this.salePrice < 0) this.salePrice = 0; // Ensure salePrice is never negative
  next();
});

// Index for faster queries
bookSchema.index({ userId: 1, category: 1, price: 1 });

export const Book = mongoose.model("Book", bookSchema);
