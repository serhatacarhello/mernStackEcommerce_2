import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  adminProducts: [],
  loading: false,
  product: {},
  error: false,
  errorMessage: "",
};

export const getProducts = createAsyncThunk(
  "product/fetchProducts",
  async (params) => {
    // Varsayılan link değeri
    let link = `http://localhost:5000/products`;
    // Eğer params belirtilmişse, isteği özelleştir
    if (params) {
      const { keyword, price, rating, category } = params;
      console.log("🚀 ~ file: productSlice.js:21 ~ rating:", rating);
      link = `http://localhost:5000/products?keyword=${
        keyword || ""
      }&rating[gte]=${rating.value || 0}&price[gte]=${
        price.min || 0
      }&price[lte]=${price.max || 1000}`;

      // Eğer params içinde category varsa, category'yi da ekleyin
      if (category) {
        link += `&category=${category.value}`;
      }
    }

    const response = await fetch(link);
    return await response.json();
  }
);

export const getAdminProducts = createAsyncThunk(
  "product/fetchAdminProducts",
  async () => {
    const response = await fetch(`http://localhost:5000/admin/products`);
    return await response.json();
  }
);

export const getProductDetail = createAsyncThunk(
  "product/fetchProductDetail",
  // Declare the type your function argument here:
  async (id) => {
    const response = await fetch(`http://localhost:5000/products/${id}`);
    return await response.json();
  }
);

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
      }
      state.products = action.payload;
    });
    builder.addCase(getProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.errorMessage = action.error.message;
      console.log(action);
    });
    builder.addCase(getAdminProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAdminProducts.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.message) {
        state.errorMessage = action.payload.message;
      }
      state.adminProducts = action.payload;
    });
    builder.addCase(getAdminProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.errorMessage = action.error.message;
    });
    builder.addCase(getProductDetail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProductDetail.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.message) {
        state.errorMessage = action.payload.message;
      }
      state.product = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = productSlice.actions;
export const selectAdminProducts = (state) => state.adminProducts;
export default productSlice.reducer;
