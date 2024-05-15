import { configureStore } from '@reduxjs/toolkit'

// Reducer Import
import SubCatagoriesID from '../src/feature/SubcatagoriesId'
import CategoryId from './feature/CategoryId'
import Sortproductbyid from './feature/Sortproductbyid'

export const store = configureStore({
    reducer: {
        subcatagoriesid: SubCatagoriesID,
        categoryId: CategoryId,
        sortBy : Sortproductbyid
    },
})