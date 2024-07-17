// store.js
import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './features/auth/authSlice';
import authReducer from './authSlice';
import transactionReducer from './transSlice';
import isOpenSiceRecuder from './homeSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        transactions: transactionReducer,
        isOpen: isOpenSiceRecuder,
    },
});

export default store;
