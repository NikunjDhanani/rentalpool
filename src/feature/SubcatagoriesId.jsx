import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

const SubcatagoriesID = createSlice({
  name: "subcatagoriesid",
  initialState,
  reducers: {
    Togglesubcategories: (state, action) => {
      const subcategoryId = action.payload;
      const index = state.value.indexOf(subcategoryId);
      if (index === -1) {
        // If subcategory is not selected, add it
        state.value.push(subcategoryId);
      } else {
        // If subcategory is already selected, remove it
        state.value.splice(index, 1);
      }
    },
  },
});

export const { Togglesubcategories } = SubcatagoriesID.actions;

export default SubcatagoriesID.reducer;
