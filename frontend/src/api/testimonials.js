import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/testimonials`;

// Fetch all testimonials
export const fetchTestimonials = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Add a new testimonial (Admin Only)
export const addTestimonial = async (testimonial, token) => {
  const response = await axios.post(API_URL, testimonial, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update a testimonial (Admin Only)
export const updateTestimonial = async (id, updatedData, token) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete a testimonial (Admin Only)
export const deleteTestimonial = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
