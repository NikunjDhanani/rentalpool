import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

const SortbyID = createSlice({
  name: "subcatagoriesid",
  initialState,
  reducers: {
    Togglesortby: (state, action) => {
      const SortbyID = action.payload;
      const index = state.value.indexOf(SortbyID);
      if (index === -1) {
        // If subcategory is not selected, add it
        state.value.push(SortbyID);
      } else {
        // If subcategory is already selected, remove it
        state.value.splice(index, 1);
      }
    },
  },
});

export const { Togglesortby } = SortbyID.actions;

export default SortbyID.reducer;
