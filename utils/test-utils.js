import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import React from 'react';
import store from '../src/reducers/store'; // Ensure the correct import path

export function renderWithProviders(ui, extendedRenderOptions = {}) {
    const {
        preloadedState = {},
        store1 = store, // Use the imported store directly
        ...renderOptions
    } = extendedRenderOptions;

    const wrapper = ({ children }) => <Provider store={store1}>{children}</Provider>;

    return {
        store1,
        ...render(ui, { wrapper, ...renderOptions }),
    };
}
