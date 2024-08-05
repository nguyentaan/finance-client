import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../../src/pages/Register/Register';
import CustomSnackbar from '../../src/components/snackbar/snackbar';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../src/reducers/store';

describe('Register page integration test', () => {
    test('should render register form and handle interactions correctly', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Register />
                </MemoryRouter>
            </Provider>,
        );

        // Check initial rendering
        const googleButton = screen.getByTestId('google-button');
        expect(googleButton).toBeInTheDocument();

        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Sign up')).toBeInTheDocument();

        // Test validation errors for empty fields
        fireEvent.click(screen.getByDisplayValue('Sign up'));
        expect(screen.getByTestId('error-message-email')).toBeInTheDocument();
        expect(screen.getByTestId('error-message-password')).toBeInTheDocument();
        expect(screen.getByTestId('error-message-confirm-password')).toBeInTheDocument();

        // Test validation error for invalid email
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test' } });
        fireEvent.click(screen.getByDisplayValue('Sign up'));
        expect(screen.getByTestId('error-message-email')).toBeInTheDocument();

        // Test validation error for invalid password
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass' } });
        fireEvent.click(screen.getByDisplayValue('Sign up'));
        expect(screen.getByTestId('error-message-password')).toBeInTheDocument();

        // Test validation error for mismatched confirm password
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123aA.' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: '123aa.' } });
        fireEvent.click(screen.getByDisplayValue('Sign up'));
        expect(screen.getByTestId('error-message-confirm-password')).toBeInTheDocument();

        // Test successful registration
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123aA.' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: '123aA.' } });
        fireEvent.click(screen.getByDisplayValue('Sign up'));

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CustomSnackbar />
                </MemoryRouter>
            </Provider>,
        );

        // Wait for snackbar to appear and check its content
        const snackbar = screen.getByTestId('snackbar');
        expect(snackbar).toBeInTheDocument('Register successful');
        await waitFor(() => {
            expect(snackbar).toBeInTheDocument();
        });
    });

    test('should show password criteria based on password input', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Register />
                </MemoryRouter>
            </Provider>,
        );

        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123' } });
        expect(screen.getByText('At least 6 characters')).toHaveClass('invalid');
        expect(screen.getByText('At least 1 uppercase letter')).toHaveClass('invalid');
        expect(screen.getByText('At least 1 special character (!@#$%^&*.)')).toHaveClass('invalid');

        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123aA.' } });
        expect(screen.getByText('At least 6 characters')).toHaveClass('valid');
        expect(screen.getByText('At least 1 uppercase letter')).toHaveClass('valid');
        expect(screen.getByText('At least 1 special character (!@#$%^&*.)')).toHaveClass('valid');
    });

    test('should fail to register and show snackbar message', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Register />
                </MemoryRouter>
            </Provider>,
        );

        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123aA.' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: '123aa.' } });
        fireEvent.click(screen.getByDisplayValue('Sign up'));

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CustomSnackbar />
                </MemoryRouter>
            </Provider>,
        );

        // Wait for snackbar to appear and check its content
        const snackbar = screen.getByTestId('snackbar');
        expect(snackbar).toBeInTheDocument('Registration failed');
        await waitFor(() => {
            expect(snackbar).toBeInTheDocument();
        });
    });
});
