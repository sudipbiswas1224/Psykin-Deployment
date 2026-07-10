import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import crisisReducer from './slices/crisisSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        crisis: crisisReducer
    },
});
