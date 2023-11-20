import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cart")) || [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      if (product.quantity === undefined) return;
      const exists = state.cartItems.find((item) => item._id === product._id);

      if (exists) {
        // Update quantity
        state.cartItems = state.cartItems.map((item) => {
          if (item._id === product._id) {
            return {
              ...item,
              quantity: item.quantity + product.quantity,
            };
          }
          return item;
        });
      } else {
        // Add new item
        state.cartItems.push({
          ...product,
          quantity: product.quantity,
        });
      }

      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
    updateCartQuantity: (state, action) => {
      if (action.payload.quantity === undefined) return;
      state.cartItems = state.cartItems.map((cart) => {
        if (cart._id === action.payload.id) {
          return {
            ...cart,
            quantity: action.payload.quantity,
          };
        } else {
          return cart;
        }
      });
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
  },
});

export const { addToCart, updateCartQuantity, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;

//  cart state comes from LS with cart key
export const selectCart = (state) => state.cart.cartItems;
