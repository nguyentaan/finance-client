import { createSlice } from '@reduxjs/toolkit';

const isOpenSlice = createSlice({
    name: 'isOpen',
    initialState: {
        isOpen: false,
        isUpdate: false,
    },
    reducers: {
        toggleIsOpen: (state) => {
            state.isOpen = !state.isOpen;
        },
        setIsOpen: (state, action) => {
            state.isOpen = action.payload;
        },
        toggleIsUpdate: (state) => {
            state.isUpdate = !state.isUpdate;
        },
        setIsUpdate: (state, action) => {
            state.isUpdate = action.payload;
        },
    },
});

export const { toggleIsOpen, setIsOpen, toggleIsUpdate, setIsUpdate } = isOpenSlice.actions;
export default isOpenSlice.reducer;
