import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTestimonials, createTestimonial, removeTestimonial } from "../../redux/testimonialSlice";
import "../../styles/ManageTestimonials.css"; // ✅ Import styles
import { FaTrash, FaPlus } from "react-icons/fa"; // ✅ Icons for buttons

const ManageTestimonials = () => {
  const dispatch = useDispatch();
  const { list = [], loading, error } = useSelector((state) => state.testimonials || {});

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Prevent multiple submissions

  // ✅ Fetch testimonials on load
  useEffect(() => {
    dispatch(getTestimonials())
      .unwrap()
      .catch((err) => console.error("Failed to load testimonials:", err));
  }, [dispatch]);

  // ✅ Handle Image Upload
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // ✅ Handle Submit
  const handleSubmit = async () => {
    if (isSubmitting) return; // ✅ Prevent duplicate requests
    if (!name || !message) {
      alert("⚠️ Please fill in all fields!");
      return;
    }
  
    setIsSubmitting(true); // ✅ Disable button to prevent multiple clicks
    let imageUrl = "";
  
    // ✅ Upload Image to Cloudinary if provided
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); // ✅ Ensure this preset exists in Cloudinary
  
      try {
        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
  
        const uploadData = await uploadResponse.json();
        console.log("📸 Cloudinary Upload Response:", uploadData); // ✅ Log response for debugging
  
        if (uploadData.secure_url) {
          imageUrl = uploadData.secure_url;
        } else {
          throw new Error("Failed to upload image.");
        }
      } catch (error) {
        console.error("❌ Image Upload Failed:", error);
        alert("Failed to upload image. Check your Cloudinary credentials.");
        setIsSubmitting(false); // ✅ Re-enable button if error occurs
        return;
      }
    }
  
    // ✅ Convert testimonialData to FormData
    const formData = new FormData();
    formData.append("name", name);
    formData.append("text", message); // ✅ Ensure 'text' key matches backend schema
    if (imageUrl) formData.append("image", imageUrl); // ✅ Append Cloudinary image URL if available
  
    console.log("📤 Sending FormData:", Object.fromEntries(formData)); // ✅ Debugging
  
    try {
      await dispatch(
        createTestimonial({ formData, token: localStorage.getItem("token") })
      ).unwrap();
  
      setName("");
      setMessage("");
      setImage(null);
      setIsSubmitting(false); // ✅ Re-enable button after success
    } catch (error) {
      console.error("❌ Error adding testimonial:", error);
      alert("❌ Failed to add testimonial.");
      setIsSubmitting(false);
    }
  };
 
  

  return (
    <div className="manage-testimonials">
      <h2>📢 Manage Testimonials</h2>

      {/* ✅ Testimonial Form */}
      <div className="testimonial-form">
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <button onClick={handleSubmit}>
          <FaPlus /> Add Testimonial
        </button>
      </div>

      {/* ✅ Error Handling */}
      {error && <p className="error-message">❌ {error}</p>}

      {/* ✅ Testimonial List */}
      <ul className="testimonial-list">
        {loading ? (
          <p>Loading...</p>
        ) : list.length === 0 ? (
          <p>No testimonials found.</p>
        ) : (
          list.map((testimonial) => (
            <li key={testimonial._id} className="testimonial-item">
              <img src={testimonial.image || "/images/default-user.jpg"} alt={testimonial.name} className="testimonial-image" />
              <div>
                <p><strong>{testimonial.name}:</strong> {testimonial.message}</p>
                <p className="testimonial-text">{testimonial.text || "No message provided."}</p> {/* ✅ Fix here */}
              </div>
              <button className="delete-btn" onClick={() => dispatch(removeTestimonial({ id: testimonial._id, token: localStorage.getItem("token") }))}>
                <FaTrash />
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ManageTestimonials;
