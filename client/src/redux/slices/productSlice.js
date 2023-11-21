import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Get the base API URL from the environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL 

export const getProducts = createAsyncThunk(
  "product/fetchProducts",
  async (params) => {
    let link = `${API_BASE_URL}/products`;
    if (params) {
      const { keyword, limit, page } = params;
      link = `${API_BASE_URL}/products?keyword=${keyword || ""}&limit=${
        limit || 12
      }&page=${page || 1}`;
    }

    const response = await fetch(link);
    console.log("🚀 ~ file: productSlice.js:20 ~ link:", link);
    const data = await response.json();
    console.log("🚀 ~ file: productSlice.js:21 ~ data:", data);
    return data;
  }
);
export const getFilteredProducts = createAsyncThunk(
  "product/fetchFilteredProducts",
  async (params) => {
    console.log("🚀 ~ file: productSlice.js:23 ~ arams:", params);
    let link = `${API_BASE_URL}/products`;
    if (params) {
      const { keyword, price, rating, category, limit, page } = params;
      link = `${API_BASE_URL}/products?keyword=${keyword || ""}&rating[gte]=${
        rating || 0
      }&price[gte]=${price?.min || 0}&price[lte]=${price?.max || 1000}&limit=${
        limit || 12
      }&page=${page || 1}`;

      if (category) {
        link += `&category=${category}`;
      }
    }

    const response = await fetch(link);
    const data = await response.json();
    console.log("🚀 ~ file: productSlice.js:45 ~ data:", data);
    return data;
  }
);

export const getAdminProducts = createAsyncThunk(
  "product/fetchAdminProducts",
  async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log("🚀 ~ file: productSlice.js:62 ~ data:", data);
    return data;
  }
);
export const addNewAdminProduct = createAsyncThunk(
  "product/addProduct",
  async (newProductData) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newProductData),
    };
    const response = await fetch(`${API_BASE_URL}/product/new`, requestOptions);

    const data = await response.json();
    console.log("🚀 ~ file: productSlice.js:86 ~ data:", data);
    return data;
  }
);
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, updatedProductData }) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",

        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedProductData),
    };
    const response = await fetch(
      `${API_BASE_URL}/products/${id}`,
      requestOptions
    );

    const data = await response.json();
    console.log("🚀 ~ file: productSlice.js:110 ~ data:", data);
    return data;
  }
);

export const getProductDetail = createAsyncThunk(
  "product/fetchProductDetail",
  // Declare the type your function argument here:
  async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return await response.json();
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  // Declare the type your function argument here:
  async (id) => {
    const token = localStorage.getItem("token");
    const requestOptions = {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      `${API_BASE_URL}/products/${id}`,
      requestOptions
    );
    return await response.json();
  }
);

const initialState = {
  products: [],
  filteredProducts: [],
  adminProducts: [],
  loading: false,
  product: {},
  error: false,
  errorMessage: "",
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.message) {
        state.errorMessage = action.payload.message;
      } else {
        state.products = action.payload;
      }
    });
    builder.addCase(getProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.errorMessage = action.error.message;
    });
    builder.addCase(getFilteredProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getFilteredProducts.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.message) {
        state.errorMessage = action.payload.message;
      } else {
        state.filteredProducts = [];
        state.filteredProducts = action.payload;
      }
    });
    builder.addCase(getFilteredProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.errorMessage = action.error.message;
    });
    builder.addCase(getAdminProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAdminProducts.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.message) {
        state.errorMessage = action.payload.message;
      } else {
        state.adminProducts = action.payload;
      }
    });
    builder.addCase(getAdminProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.errorMessage = action.error.message;
    });
    builder.addCase(addNewAdminProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addNewAdminProduct.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.message) {
        state.errorMessage = action.payload.message;
      } else {
        state.adminProducts = [...state.adminProducts, action.payload];
        state.products = [...state.products, action.payload];
        toast.success("New product added.");
      }
    });
    builder.addCase(addNewAdminProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.errorMessage = action.error.message;
    });
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      if (action.payload.message) {
        state.errorMessage = action.payload.message;
      } else {
        const existingProductIndex = state.adminProducts.findIndex(
          (product) => product.id === action.payload._id
        );
        if (existingProductIndex !== -1) {
          state.adminProducts[existingProductIndex] = action.payload;
        }
        const productIndex = state.products.findIndex(
          (product) => product.id === action.payload._id
        );
        if (productIndex !== -1) {
          state.products[productIndex] = action.payload;
        }
        toast.success("Product updated.");
      }
      state.loading = false;
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.errorMessage = action.error.message;
      toast.error(action.error.message);
    });
    builder.addCase(getProductDetail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProductDetail.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.message) {
        state.errorMessage = action.payload.message;
        toast.error(action.payload.message);
      } else {
        state.product = action.payload;
      }
    });
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.message) {
        state.errorMessage = action.payload.message;
      }
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = productSlice.actions;

export default productSlice.reducer;

export const selectAdminProducts = (state) => state.products.adminProducts;
export const selectFilteredProducts = (state) =>
  state.products.filteredProducts;
export const selectProductLoading = (state) => state.products.loading;
