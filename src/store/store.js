import { configureStore } from "@reduxjs/toolkit";
import chartReducer from '../features/chartSlice.js'
import isOnlineReducer from '../features/isOnlineSlice.js'

const store = configureStore({
    reducer:{
        chart: chartReducer,
        isOnline:  isOnlineReducer
    }
})

export default store;