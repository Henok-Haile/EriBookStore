import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/books`;


// Add a new book with image
export const addBook = async (bookData, token) => {
    const formData = new FormData();
    for (let key in bookData) {
      formData.append(key, bookData[key]);
    }
  
    return await axios.post(API_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  };

// Fetch all books (Admin Only)
export const getAllBooks = async (token) => {
  return await axios.get(`${API_URL}/admin/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Approve a book (Admin Only)
export const approveBook = async (bookId, token) => {
  return await axios.put(`${API_URL}/${bookId}/approve`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Delete a book (Admin Only)
export const deleteBook = async (bookId, token) => {
  return await axios.delete(`${API_URL}/${bookId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Update book with new image
export const updateBook = async (bookId, bookData, token) => {
    const formData = new FormData();
    for (let key in bookData) {
      formData.append(key, bookData[key]);
    }
  
    return await axios.put(`${API_URL}/${bookId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  };

// Make sure all functions are exported correctly
export default {
  addBook,
  getAllBooks,
  approveBook,
  deleteBook,
  updateBook, // **Make sure updateBook is included**
};
