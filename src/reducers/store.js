// store.js
import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './features/auth/authSlice';
import authReducer from './authSlice';
import isOpenSiceRecuder from './homeSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        isOpen: isOpenSiceRecuder,
    },
});

export default store;
