import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

const SubcatagoriesID = createSlice({
  name: "subcatagoriesid",
  initialState,
  reducers: {
    Togglesubcategories: (state, action) => {
      const subcategoryId = action.payload.id;
      const index = state.value.findIndex(item => item.id === subcategoryId);
      if (index === -1) {
        // If subcategory is not selected, add it
        state.value.push(action.payload);
      } else {
        // If subcategory is already selected, remove it
        state.value.splice(index, 1);
      }
    },

    ClearSubCategory: (state) => {
      state.value = [];
    }
  }
})

export const { Togglesubcategories, ClearSubCategory } = SubcatagoriesID.actions;

export default SubcatagoriesID.reducer;
