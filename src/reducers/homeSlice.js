import { createSlice } from '@reduxjs/toolkit';

const isOpenSlice = createSlice({
    name: 'isOpen',
    initialState: {
        isOpen: false,
    },
    reducers: {
        toggleIsOpen: (state) => {
            state.isOpen = !state.isOpen;
        },
        setIsOpen: (state, action) => {
            state.isOpen = action.payload;
        },
    },
});

export const { toggleIsOpen, setIsOpen } = isOpenSlice.actions;
export default isOpenSlice.reducer;
