import React from 'react';
import { screen, fireEvent, waitFor, render } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Login from '../../src/pages/Login/Login';
import { MemoryRouter } from 'react-router-dom';
import CustomSnackbar from '../../src/components/snackbar/snackbar';
import { Provider } from 'react-redux';
import store from '../../src/reducers/store';

describe('Login Integration Tests', () => {
    test('should successfully login and show success snackbar', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </Provider>,
        );

        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'password' },
        });
        fireEvent.click(screen.getByDisplayValue('Sign in'));

        renderWithProviders(<CustomSnackbar />);
        const snackbar = screen.getByTestId('snackbar');
        expect(snackbar).toBeInTheDocument('Login successful');
        await waitFor(() => {
            expect(snackbar).toBeInTheDocument();
        });
    });

    test('should fail to login and show error snackbar', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </Provider>,
        );

        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'wrongpassword' },
        });
        fireEvent.click(screen.getByDisplayValue('Sign in'));

        renderWithProviders(<CustomSnackbar />);

        const snackbar = screen.getByTestId('snackbar');
        expect(snackbar).toBeInTheDocument('Invalid email or password');
        await waitFor(() => {
            expect(snackbar).toBeInTheDocument();
        });
    });
});
