import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};

const SortbyID = createSlice({
  name: "sortId",
  initialState,
  reducers: {
    Togglesortby: (state, action) => {
      const SortbyID = action.payload;
      state.value = SortbyID
    },
    ClearSortBy: (state) => {
      state.value = null
    }
  },
});

export const { Togglesortby,ClearSortBy } = SortbyID.actions;

export default SortbyID.reducer;
