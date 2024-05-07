import { configureStore } from '@reduxjs/toolkit'

// Reducer Import
import SubCatagoriesID from '../src/feature/SubcatagoriesId'

export const store = configureStore({
    reducer: {
        subcatagoriesid: SubCatagoriesID,
    },
})