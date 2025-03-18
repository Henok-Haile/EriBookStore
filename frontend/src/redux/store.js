import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import wishlistReducer from "./wishlistSlice";
import cartReducer from "./cartSlice";
import bookReducer from "./bookSlice";
import orderReducer from "./orderSlice";
import userReducer from "./userSlice";
import reviewReducer from "./reviewSlice";
import testimonialReducer from "./testimonialSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    books: bookReducer,
    orders: orderReducer,
    users: userReducer,
    reviews: reviewReducer,
    testimonials: testimonialReducer,
  },
});

export default store;
