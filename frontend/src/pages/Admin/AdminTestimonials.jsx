import React, { useEffect, useState } from "react";
import { fetchTestimonials, addTestimonial, updateTestimonial, deleteTestimonial } from "../api/testimonials";
import { useSelector } from "react-redux";
import "../styles/AdminTestimonials.css";

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({ name: "", text: "", image: "" });
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const data = await fetchTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTestimonial = async () => {
    try {
      await addTestimonial(newTestimonial, token);
      loadTestimonials();
      setNewTestimonial({ name: "", text: "", image: "" });
    } catch (error) {
      console.error("Error adding testimonial:", error);
    }
  };

  const handleEditTestimonial = (testimonial) => {
    setEditingTestimonial(testimonial);
  };

  const handleUpdateTestimonial = async () => {
    try {
      await updateTestimonial(editingTestimonial._id, editingTestimonial, token);
      setEditingTestimonial(null);
      loadTestimonials();
    } catch (error) {
      console.error("Error updating testimonial:", error);
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      await deleteTestimonial(id, token);
      loadTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  return (
    <div className="admin-testimonials">
      <h2>Manage Testimonials</h2>

      {/* ✅ Add New Testimonial */}
      <div className="add-testimonial">
        <input
          type="text"
          placeholder="Name"
          value={newTestimonial.name}
          onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
        />
        <textarea
          placeholder="Testimonial"
          value={newTestimonial.text}
          onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL (optional)"
          value={newTestimonial.image}
          onChange={(e) => setNewTestimonial({ ...newTestimonial, image: e.target.value })}
        />
        <button onClick={handleAddTestimonial} disabled={loading}>
          {loading ? "Adding..." : "Add Testimonial"}
        </button>
      </div>

      {/* ✅ Edit Testimonial */}
      {editingTestimonial && (
        <div className="edit-testimonial">
          <input
            type="text"
            placeholder="Name"
            value={editingTestimonial.name}
            onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
          />
          <textarea
            value={editingTestimonial.text}
            onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
          />
          <button onClick={handleUpdateTestimonial}>Update</button>
          <button onClick={() => setEditingTestimonial(null)}>Cancel</button>
        </div>
      )}

      {/* ✅ Testimonial List */}
      <ul className="testimonial-list">
        {loading ? (
          <p>Loading...</p>
        ) : (
          testimonials.map((testimonial) => (
            <li key={testimonial._id}>
              <div className="testimonial-content">
                <img src={testimonial.image || "/images/default-user.jpg"} alt={testimonial.name} />
                <div>
                  <p><strong>{testimonial.name}</strong>: {testimonial.text}</p>
                  <button onClick={() => handleEditTestimonial(testimonial)}>Edit</button>
                  <button onClick={() => handleDeleteTestimonial(testimonial._id)}>Delete</button>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AdminTestimonials;
