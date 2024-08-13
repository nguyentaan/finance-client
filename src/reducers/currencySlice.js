import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedCurrency: 'VND',
    exchangeRates: {
        USD: 1,
        EUR: 0.85,
        VND: 23000,
    },
    convertedAmount: 0,
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
        convertCurrency(state, action) {
            const amount = action.payload;
            const rate = state.exchangeRates[state.selectedCurrency];
            state.convertedAmount = amount * rate;
        }
    },
});

export const { setCurrency, setExchangeRates, convertCurrency } = currencySlice.actions;

export default currencySlice.reducer;
