import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import generalReducer from "./slices/generalSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";

// Get cart items from localStorage
const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

const preloadedState = {
  cart: {
    cartItems,
  },
};

export const store = configureStore({
  reducer: {
    products: productReducer,
    general: generalReducer,
    auth: authReducer,
    cart: cartReducer,
  },
  preloadedState,
});
