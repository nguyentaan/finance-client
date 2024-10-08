import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '~/axios/axiosInstance';

const initialState = {
    transactions: [],
    loading: false,
    error: null,
};


export const createTransaction = createAsyncThunk(
    'transaction/createTransaction',
    async (transactionData, { rejectWithValue }) => {
        try {
            const response = await instance.post('/api/Transaction/create', transactionData);
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

export const fetchTransactionsByEmail = createAsyncThunk('transaction/fetchByEmail', async (email) => {
    const response = await instance.get(`/api/Transaction/byemail?email=${encodeURIComponent(email)}`);
    return response.data;
});

export const updateTransaction = createAsyncThunk(
    'transaction/updateTransaction',
    async (transactionData, { rejectWithValue }) => {
        try {
            const response = await instance.put(
                `/api/Transaction/update/${transactionData.id}`,
                transactionData,
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : 'An error occurred');
        }
    },
);

export const deleteTransaction = createAsyncThunk('transaction/deleteTransaction', async (id, { rejectWithValue }) => {
    try {
        const response = await instance.delete(`/api/Transaction/delete/${id}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data : 'An error occurred');
    }
});

const transactionSlice = createSlice({
    name: 'transactions',
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
        builder.addCase(updateTransaction.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateTransaction.fulfilled, (state, action) => {
            state.loading = false;
            state.transactions = state.transactions.map((transaction) =>
                transaction.id === action.payload.id ? action.payload : transaction,
            );
        });
        builder.addCase(updateTransaction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(deleteTransaction.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteTransaction.fulfilled, (state, action) => {
            state.loading = false;
            state.transactions = state.transactions.filter((transaction) => transaction.id !== action.meta.arg);
        });
        builder.addCase(deleteTransaction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { actions, reducer } = transactionSlice;
export default reducer;
