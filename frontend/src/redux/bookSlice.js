import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBooks, getBookById, fetchCategories, fetchFeaturedBooks } from "../api/books";
import { getAllBooks, approveBook, deleteBook, addBook, updateBook } from "../api/adminBooks";


export const fetchBooks = createAsyncThunk("books/fetchAll", async ({ category = "", page = 1, sortBy = "" } = {}, thunkAPI) => {
  try {
    let query = `?page=${page}&limit=12`; 
    if (category && category !== "All") query += `&category=${encodeURIComponent(category)}`; // Encode category name
    if (sortBy) query += `&sort=${sortBy}`;  // Add sorting to API request

    const response = await getBooks(query);
    return response.data || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Error fetching books.");
  }
});


// Fetch Featured Books
export const fetchFeatured = createAsyncThunk("books/fetchFeatured", async (_, thunkAPI) => {
  try {
    const response = await fetchFeaturedBooks();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Error fetching featured books.");
  }
});

// Fetch Book Categories
export const fetchBookCategories = createAsyncThunk("books/fetchCategories", async (_, thunkAPI) => {
  try {
    const response = await fetchCategories();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Error fetching categories.");
  }
});

// Fetch Single Book Details
export const fetchBookDetails = createAsyncThunk("books/fetchDetails", async (bookId, thunkAPI) => {
  try {
    const response = await getBookById(bookId);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Error fetching book details.");
  }
});

// Fetch All Books (Admin)
export const fetchAllBooks = createAsyncThunk("books/fetchAllAdmin", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    const response = await getAllBooks(token);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Error fetching all books.");
  }
});

// Approve a Book
export const approveBookById = createAsyncThunk("books/approve", async (bookId, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    await approveBook(bookId, token);
    return bookId; // Return bookId to update Redux state
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Error approving book.");
  }
});

// Delete a Book
export const deleteBookById = createAsyncThunk("books/delete", async (bookId, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    await deleteBook(bookId, token);
    return bookId;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Error deleting book.");
  }
});

export const addNewBook = createAsyncThunk("books/add", async (bookData, thunkAPI) => {
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  try {
    const response = await fetch(`$${API_URL}/api/books`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, 
        // DO NOT SET `Content-Type` for FormData (Browser sets it automatically)
      },
      body: bookData, // Send as FormData
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to add book");
    }
    return data.book;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Update a Book
export const updateBookById = createAsyncThunk("books/update", async ({ bookId, updatedData }, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();

    // Append all fields except `coverImage`
    Object.keys(updatedData).forEach((key) => {
      if (key !== "coverImage") {
        formData.append(key, updatedData[key]);
      }
    });

    // Append the new cover image (if provided)
    if (updatedData.coverImage) {
      formData.append("coverImage", updatedData.coverImage);
    }

    const response = await fetch(`http://localhost:5555/api/books/${bookId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`, // No `Content-Type` needed for FormData
      },
      body: formData, // Send as FormData
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update book");
    }

    return { bookId, updatedData: data.book };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});


// Book Slice
const bookSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    totalBooks: 0,
    totalPages: 1,
    featuredBooks: [],
    categories: [],
    bookDetails: null,
    loading: false,
    error: null,
    currentPage: 1,
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.books;
        state.totalBooks = action.payload.totalBooks;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFeatured.fulfilled, (state, action) => {
        state.featuredBooks = action.payload;
      })
      .addCase(fetchBookCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchBookDetails.fulfilled, (state, action) => {
        state.bookDetails = action.payload;
      })
      .addCase(fetchAllBooks.fulfilled, (state, action) => {
        state.books = action.payload;
      })
      .addCase(approveBookById.fulfilled, (state, action) => {
        const book = state.books.find((b) => b._id === action.payload);
        if (book) book.isApproved = true;
      })
      .addCase(deleteBookById.fulfilled, (state, action) => {
        state.books = state.books.filter((book) => book._id !== action.payload);
      })
      .addCase(addNewBook.fulfilled, (state, action) => {
        state.books.push(action.payload);
      })
      .addCase(updateBookById.fulfilled, (state, action) => {
        const book = state.books.find((b) => b._id === action.payload.bookId);
        if (book) {
          Object.assign(book, action.payload.updatedData);
        }
      });
  },
});

export const { setPage } = bookSlice.actions;
export default bookSlice.reducer;
