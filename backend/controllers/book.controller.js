import { Book } from "../models/book.model.js";


/**
 * 🛠 Helper Function: Build Query Based on Filters (Search, Price, Rating, Year)
 */
const buildQuery = (filters) => {
  const { search, minPrice, maxPrice, minRating, maxRating, publishYear, category } = filters;

  let query = { isApproved: true }; // ✅ Users can only see approved books

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } }
    ];
  }

  if (category && category !== "All") {// ✅ Prevent undefined error
    query.category = { $regex: new RegExp(`^${category}$`, "i") };
    // query.category = category;
  }



  if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
  if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

  if (minRating) query.averageRating = { ...query.averageRating, $gte: Number(minRating) };
  if (maxRating) query.averageRating = { ...query.averageRating, $lte: Number(maxRating) };

  if (publishYear) query.publishYear = Number(publishYear);

  return query;
};

/**
 * 🛠 Helper Function: Sorting Options
 */
const getSortOptions = (sort) => {
  let sortOption = {};
  switch (sort) {
    case "priceLowHigh":
      sortOption.price = 1;
      break;
    case "priceHighLow":
      sortOption.price = -1;
      break;
    case "ratingHighLow":
      sortOption.averageRating = -1;
      break;
    case "ratingLowHigh":
      sortOption.averageRating = 1;
      break;
    case "mostPopular":
      sortOption.totalReviews = -1;
      break;
    case "newest":
      sortOption.createdAt = -1;
      break;
    case "oldest":
      sortOption.createdAt = 1;
      break;
    default:
      break;
  }
  return sortOption;
};

/**
 * 🛠 Helper Function: Pagination Logic
 */
const getPagination = (page, limit) => {
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 9;
  const skip = (pageNum - 1) * limitNum;

  return { pageNum, limitNum, skip };
};

/**
 * ✅ Fetch All Books (General)
 * Supports search, filters, sorting, and pagination
 */


// export const getBooks = async (req, res) => {
//   try {
//     const filters = req.query || {}; // ✅ Ensure filters is always an object
//     console.log("🔍 Incoming Filters:", filters);

//     const { search, page, limit, sort, minPrice, maxPrice, minRating, maxRating, publishYear, category } = filters;

//     let query = { isApproved: true }; // ✅ Users can only see approved books

//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: "i" } },
//         { author: { $regex: search, $options: "i" } }
//       ];
//     }

//     if (category && category !== "All") {
//       query.category = { $regex: new RegExp(`^${category}$`, "i") };
//     }

//     if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
//     if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

//     if (minRating) query.averageRating = { ...query.averageRating, $gte: Number(minRating) };
//     if (maxRating) query.averageRating = { ...query.averageRating, $lte: Number(maxRating) };

//     if (publishYear) query.publishYear = Number(publishYear);

//     console.log("🔍 Final Query:", JSON.stringify(query, null, 2));

//     const sortOption = getSortOptions(sort);
//     const pageNum = Number(filters.page) || 1;
//     const limitNum = Number(filters.limit) || 12;
//     const skip = (pageNum - 1) * limitNum;

//     const books = await Book.find(query)
//       .sort(sortOption)
//       .skip(skip)
//       .limit(limitNum)
//       .populate("userId", "name email");

//     const totalBooks = await Book.countDocuments(query);

//     res.json({
//       totalBooks,
//       page: pageNum,
//       totalPages: Math.ceil(totalBooks / limitNum),
//       books,
//     });

//   } catch (error) {
//     console.error("🔥 Server Error in getBooks:", error.message);
//     res.status(500).json({ message: `Server error while fetching books: ${error.message}` });
//   }
// };

export const getBooks = async (req, res) => {
  try {
    const filters = req.query || {};
    console.log("🔍 Incoming Filters:", filters);

    const query = buildQuery(filters); // ✅ Use helper function
    const sortOption = getSortOptions(filters.sort);
    const { pageNum, limitNum, skip } = getPagination(filters.page, filters.limit);

    const books = await Book.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .populate("userId", "name email");

    const totalBooks = await Book.countDocuments(query);

    res.json({
      totalBooks,
      page: pageNum,
      totalPages: Math.ceil(totalBooks / limitNum),
      books,
    });
  } catch (error) {
    console.error("🔥 Server Error in getBooks:", error.message);
    res.status(500).json({ message: `Server error while fetching books: ${error.message}` });
  }
};


// ✅ Fetch all books (Admins can see all books, including unapproved ones)
export const getAllBooks = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "⛔ Only admins can access all books" });
    }

    const books = await Book.find().populate("userId", "name email");
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: `Server error while fetching books: ${error.message}` });
  }
};

// ✅ Fetch single book by ID (Users can see only approved books)
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("userId", "name email");

    if (!book) return res.status(404).json({ message: "❌ Book not found" });

    // Users can only see approved books, admins can see all
    if (!book.isApproved && !req.user?.isAdmin) {
      return res.status(403).json({ message: "⛔ This book is awaiting approval" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: `Server error while fetching book: ${error.message}` });
  }
};

// ✅ Users can suggest books (Admins must approve them)
export const suggestBook = async (req, res) => {
  try {
    const { title, author, publishYear, image } = req.body;

    if (!title || !author || !publishYear) {
      return res.status(400).json({ message: "⚠️ Please provide title, author, and publish year" });
    }

    const existingBook = await Book.findOne({ title, author, publishYear });
    if (existingBook) {
      return res.status(400).json({ message: "❌ This book already exists in the database" });
    }

    const newBook = new Book({
      title,
      author,
      publishYear,
      image,
      userId: req.user.id, // User who suggested the book
      isApproved: false, // ✅ Requires admin approval
    });

    await newBook.save();
    res.status(201).json({ message: "✅ Book suggestion submitted for admin approval." });
  } catch (error) {
    res.status(500).json({ message: `Error suggesting book: ${error.message}` });
  }
};

// ✅ Admin can approve books
export const approveBook = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "⛔ Only admins can approve books" });
    }

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "❌ Book not found" });

    book.isApproved = true;
    await book.save();

    res.json({ message: "✅ Book approved successfully", book });
  } catch (error) {
    res.status(500).json({ message: `Error approving book: ${error.message}` });
  }
};

// // ✅ Add a new book with Cloudinary image

// ✅ Add a New Book
export const addBook = async (req, res) => {
  try {

    // console.log("📌 Received Form Data:", req.body);
    // console.log("📌 Received File:", req.file);

    const { title, author, publishYear, category, price, stock, format, tags, discount } = req.body;


    // ✅ Check if all required fields are present
    if (!title || !author || !publishYear || !category || !price || !stock || !format) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    // ✅ Ensure the cover image was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Cover image is required!" });
    }

    // ✅ Get the Cloudinary Image URL
    const coverImage = req.file.path; // Cloudinary gives us the URL

    // ✅ Create a new book entry
    const newBook = new Book({
      title,
      author,
      publishYear,
      coverImage, // ✅ Store Cloudinary Image URL
      category,
      price,
      stock,
      format,
      tags,
      discount: discount || 0, // Default discount is 0 if not provided
      userId: req.user.id,
      isApproved: false,
    });

    await newBook.save();

    res.status(201).json({
      success: true,
      message: "Book added successfully! Awaiting approval.",
      book: newBook
    });

  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ success: false, message: `Error adding book: ${error.message}` });
  }
};



// // ✅ Update book details and image

// ✅ Update Book
export const updateBook = async (req, res) => {
  try {
    console.log("📌 Received Update Data:", req.body);
    console.log("📌 Received File:", req.file);

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    // ✅ Update fields only if provided
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.publishYear = req.body.publishYear || book.publishYear;
    book.category = req.body.category || book.category;
    book.price = req.body.price || book.price;
    book.stock = req.body.stock || book.stock;
    book.format = req.body.format || book.format;
    book.tags = req.body.tags ? req.body.tags.split(",") : book.tags; // Ensure array

    // ✅ Update Cover Image if a new one is uploaded
    if (req.file) {
      book.coverImage = req.file.path; // ✅ Cloudinary URL
    }

    await book.save();
    res.status(200).json({ success: true, message: "Book updated successfully!", book });
  } catch (error) {
    res.status(500).json({ success: false, message: `Error updating book: ${error.message}` });
  }
};


// ✅ Admin can delete books
export const deleteBook = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "⛔ Only admins can delete books" });
    }

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "❌ Book not found" });

    await book.deleteOne();
    res.json({ message: "✅ Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `Error deleting book: ${error.message}` });
  }
};


// ✅ Fetch Unique Book Categories
export const getBookCategories = async (req, res) => {
  try {
    // Fetch distinct categories from the database
    const categories = await Book.distinct("category");

    if (!categories || categories.length === 0) {
      return res.status(404).json({ success: false, message: "No categories found" });
    }

    res.json(categories);
  } catch (error) {
    console.error("🔥 Error fetching book categories:", error.message);
    res.status(500).json({ success: false, message: "Server error fetching categories" });
  }
};

// export const getFeaturedBooks = async (req, res) => {
//   const books = await Book.find().sort({ averageRating: -1 }).limit(5);
//   res.json(books);
// };
// ✅ Fetch Featured Books
export const getFeaturedBooks = async (req, res) => {
  try {
    const featuredBooks = await Book.find({ isApproved: true }) // Fetch only approved books
      .sort({ popularityScore: -1 }) // Sort by popularity
      .limit(10); // Return only 6 featured books

    res.json(featuredBooks);
  } catch (error) {
    console.error("Error fetching featured books:", error);
    res.status(500).json({ success: false, message: "Server error fetching featured books" });
  }
};


/**
 * ✅ Fetch Books by Category (Separate from getBooks)
 */
export const getBooksByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const { page, limit } = req.query;
    const { pageNum, limitNum, skip } = getPagination(page, limit);

    const books = await Book.find({ category, isApproved: true })
      .sort({ createdAt: -1 }) // Newest books first
      .skip(skip)
      .limit(limitNum)
      .populate("userId", "name email");

    const totalBooks = await Book.countDocuments({ category, isApproved: true });

    if (!books.length) {
      return res.status(404).json({ message: "No books found in this category" });
    }

    res.json({
      totalBooks,
      page: pageNum,
      totalPages: Math.ceil(totalBooks / limitNum),
      books,
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching books by category" });
  }
};
