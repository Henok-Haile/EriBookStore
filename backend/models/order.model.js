import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    books: [
      {
        book: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "Book", 
          required: true 
        },
        title: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalAmount: { 
      type: Number, 
      required: true 
    },
    isPaid: { 
      type: Boolean, 
      default: false 
    },
    paidAt: { 
      type: Date 
    },
    stripeSessionId: { 
      type: String, 
      unique: true, 
      trim: true 
    },
    status: { 
      type: String, 
      enum: ["Pending", "Shipped", "Delivered"], 
      default: "Pending" 
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
