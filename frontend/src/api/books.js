import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/books`;

// Fetch Featured Books
export const fetchFeaturedBooks = async () => {
  return await axios.get(`${API_URL}/featured`);
};

// Fetch Book Categories
export const fetchCategories = async () => {
  return await axios.get(`${API_URL}/categories`);
};

// Get All Books (Supports Category Filtering)
export const getBooks = async (queryParams = "") => {
  return await axios.get(`${API_URL}${queryParams}`);
};

// Get a Single Book by ID
export const getBookById = async (bookId) => {
  return await axios.get(`${API_URL}/${bookId}`);
};
