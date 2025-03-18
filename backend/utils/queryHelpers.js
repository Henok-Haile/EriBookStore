// queryHelpers.js

// 🛠 Helper Function: Build MongoDB Query Object
export const buildQuery = (filters) => {
    const { search, minPrice, maxPrice, minRating, maxRating, publishYear, category } = filters;
  
    let query = {};
  
    // Search for books by title or author
    if (search) {
      const searchRegex = new RegExp(search, "i"); // Case-insensitive search
      query.$or = [
        { title: { $regex: searchRegex } },
        { author: { $regex: searchRegex } },
      ];
    }
  
    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }
  
    // Filter by rating range
    if (minRating || maxRating) {
      query.rating = {};
      if (minRating) query.rating.$gte = minRating;
      if (maxRating) query.rating.$lte = maxRating;
    }
  
    // Filter by publication year
    if (publishYear) {
      query.publishYear = publishYear;
    }
  
    // Filter by category
    if (category) {
      query.category = category;
    }
  
    return query;
  };
  
  // 🛠 Helper Function: Get Sorting Options
  export const getSortOptions = (sort) => {
    let sortOption = {};
  
    if (sort) {
      const [field, direction] = sort.split(":");
      sortOption[field] = direction === "desc" ? -1 : 1; // 1 for ascending, -1 for descending
    } else {
      sortOption = { publishYear: -1 }; // Default sort by most recent publication
    }
  
    return sortOption;
  };
  
  // 🛠 Helper Function: Get Pagination Options
  export const getPagination = (page, limit) => {
    const pageNum = parseInt(page) || 1; // Default to page 1 if no page is provided
    const limitNum = parseInt(limit) || 10; // Default to 10 items per page if no limit is provided
    const skip = (pageNum - 1) * limitNum; // Calculate the number of records to skip
  
    return { pageNum, limitNum, skip };
  };
  