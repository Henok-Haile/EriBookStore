import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
    preferredGenre: { 
      type: String, 
      default: "Fiction" 
    },
    unsubscribeToken: { 
      type: String, 
      required: true, 
      trim: true 
    },
    subscribedAt: { 
      type: Date, 
      default: Date.now 
    },
  },
  { timestamps: true }
);

export const Newsletter = mongoose.model("Newsletter", newsletterSchema);
