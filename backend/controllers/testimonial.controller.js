import { Testimonial } from "../models/testimonial.model.js";
import cloudinary from "../config/cloudinary.config.js";

// Fetch All Testimonials
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Error fetching testimonials." });
  }
};

// Add Testimonial with Image
export const addTestimonial = async (req, res) => {
  try {
    const { name, text, image } = req.body;

    if (!name || !text) {
      return res.status(400).json({ message: "Name and text are required." });
    }

    const existingTestimonial = await Testimonial.findOne({ name, text });
    if (existingTestimonial) {
      return res.status(400).json({ message: "Duplicate testimonial detected." });
    }

    const newTestimonial = await Testimonial.create({ name, text, image });

    res.status(201).json({ message: "Testimonial added successfully.", testimonial: newTestimonial });
  } catch (error) {
    res.status(500).json({ message: "Error adding testimonial." });
  }
};

// Delete Testimonial & Image
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found." });

    if (testimonial.image && !testimonial.image.includes("default-user.jpg")) {
      const publicId = testimonial.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`EriBookStore/Testimonials/${publicId}`).catch(() => {
        console.warn("Failed to delete image from Cloudinary.");
      });
    }

    await testimonial.deleteOne();
    res.json({ message: "Testimonial deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting testimonial." });
  }
};
