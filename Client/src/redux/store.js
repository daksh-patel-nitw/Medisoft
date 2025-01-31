import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import drawerReducer from './slices/drawerSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        drawer: drawerReducer
    }
})
