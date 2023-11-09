import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  keyword: "",
};

export const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    getKeyword: (state, action) => {
      state.keyword = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getKeyword } = generalSlice.actions;

export default generalSlice.reducer;
