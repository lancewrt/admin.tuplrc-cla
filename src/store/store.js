import { configureStore } from "@reduxjs/toolkit";
import chartReducer from '../features/chartSlice.js'

const store = configureStore({
    reducer:{
        chart: chartReducer
    }
})

export default store;