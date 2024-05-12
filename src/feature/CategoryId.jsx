import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: null,
};

const CatagoryID = createSlice({
    name: "catagoryid",
    initialState,
    reducers: {
        TogglesCategories: (state, action) => {
            state.value = action.payload
        },
    },
});

export const { TogglesCategories } = CatagoryID.actions;

export default CatagoryID.reducer;
