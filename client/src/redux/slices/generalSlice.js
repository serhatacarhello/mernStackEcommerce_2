import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  keyword: "",
  openModel: false,
  openEditModel: false,
};

export const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    getKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    toggleModelFunc: (state) => {
      state.openModel = !state.openModel;
    },
    toggleEditModelFunc: (state) => {
      state.openEditModel = !state.openEditModel;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getKeyword, toggleModelFunc, toggleEditModelFunc } =
  generalSlice.actions;
export const selectOpenModel = (state) => state.general.openModel;
export const selectOpenEditModel = (state) => state.general.openEditModel;

export default generalSlice.reducer;
