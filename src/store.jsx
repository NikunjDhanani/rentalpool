import { configureStore } from '@reduxjs/toolkit'

// Reducer Import
import SubCatagoriesID from '../src/feature/SubcatagoriesId'
import CategoryId from './feature/CategoryId'

export const store = configureStore({
    reducer: {
        subcatagoriesid: SubCatagoriesID,
        categoryId: CategoryId
    },
})