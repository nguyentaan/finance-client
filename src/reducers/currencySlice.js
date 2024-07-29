import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedCurrency: 'VND',
    exchangeRates: {
        VND: 1,
        USD: 0.000043,
        EUR: 0.000038,
    },
};

const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        setCurrency(state, action) {
            state.selectedCurrency = action.payload;
        },
        setExchangeRates(state, action) {
            state.exchangeRates = action.payload;
        },
    },
});

export const { setCurrency, setExchangeRates } = currencySlice.actions;

export default currencySlice.reducer;
