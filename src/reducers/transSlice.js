import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
import instance from '~/axios/axiosInstance';

const initialState = {
    transactions: [],
    loading: false,
    error: null,
};

// axios.defaults.withCredentials = true;

export const createTransaction = createAsyncThunk(
    'transaction/createTransaction',
    async (transactionData, { rejectWithValue }) => {
        try {
            const response = await instance.post(
                'https://personal-finacne-tracking.azurewebsites.net/api/Transaction/create',
                // const response = await axios.post('https://localhost:7086/api/Transaction/create',
                transactionData,
            );
            console.log('Transaction Response:', response);
            return {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
            };
        } catch (error) {
            if (error.response) {
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue(error.message);
            }
        }
    },
);

export const fetchTransactionsByEmail = createAsyncThunk(
    'transaction/fetchByEmail',
    async (email) => {
        // const response = await axios.get(
        //     `https://localhost:7086/api/Transaction/byemail?email=${encodeURIComponent(email)}`,
        // );        
            const response = await instance.get(
                `https://personal-finacne-tracking.azurewebsites.net/api/Transaction/byemail?email=${encodeURIComponent(
                    email,
                )}`,
            );
        return response.data;
    }
);

const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createTransaction.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createTransaction.fulfilled, (state, action) => {
            state.transactions.push(action.payload);
            state.loading = false;
        });
        builder.addCase(createTransaction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(fetchTransactionsByEmail.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTransactionsByEmail.fulfilled, (state, action) => {
            state.transactions = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchTransactionsByEmail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { actions, reducer } = transactionSlice;
export default reducer;
