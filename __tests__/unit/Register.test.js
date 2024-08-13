import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../../src/pages/Register/Register';
import CustomSnackbar from '../../src/components/snackbar/snackbar';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../src/reducers/store';

describe('Register page', () => {
    test('should render google login button', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Register />
                </MemoryRouter>
            </Provider>,
        );
        const googleButton = screen.getByTestId('google-button');
        expect(googleButton).toBeInTheDocument();
    })
    test('should render register form', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Register />
                </MemoryRouter>
            </Provider>,
        );
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Sign up')).toBeInTheDocument();
    });

    test('should show validation error when email, password or confirm password is missing', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Register />
                </MemoryRouter>
            </Provider>,
        );

        fireEvent.click(screen.getByDisplayValue('Sign up'));
        // Check for validation error messages
        const emailError = screen.queryByTestId('error-message-email');
        const passwordError = screen.queryByTestId('error-message-password');
        const confirmPasswordError = screen.queryByTestId('error-message-confirm-password');

        expect(emailError).toBeInTheDocument(); // Expect email error message to be in the document
        expect(passwordError).toBeInTheDocument(); // Expect password error message to be in the document
        expect(confirmPasswordError).toBeInTheDocument(); // Expect confirm password error message to be in the document
    })

    test('should show validation error when email is invalid', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Register />
                </MemoryRouter>
            </Provider>,
        );

        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'test' },
        });
        fireEvent.click(screen.getByDisplayValue('Sign up'));
        const emailError = screen.queryByTestId('error-message-email');
        expect(emailError).toBeInTheDocument(); // Expect email error message to be in the document
    })

    test('should show validation error when password is invalid', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Register />
                </MemoryRouter>
            </Provider>,
        );

        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'pass' },});
        fireEvent.click(screen.getByDisplayValue('Sign up'));
        const passwordError = screen.queryByTestId('error-message-password');
        expect(passwordError).toBeInTheDocument(); // Expect password error message to be in the document
    })
    test('should show validation error when confirm password is invalid', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Register />
                </MemoryRouter>
            </Provider>,
        );

        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: '123aA.' },
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
            target: { value: '123aa.' },});
        fireEvent.click(screen.getByDisplayValue('Sign up'));
        const confirmPasswordError = screen.queryByTestId('error-message-confirm-password');
        expect(confirmPasswordError).toBeInTheDocument(); // Expect confirm password error message to be in the document
    })

    test('should successfully register', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Register />
                </MemoryRouter>
            </Provider>,
        );
        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'test@example.com' },})
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: '123aA.' },})
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
            target: { value: '123aA.' },})
        fireEvent.click(screen.getByDisplayValue('Sign up'));

        // Wait for snackbar to appear
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CustomSnackbar />
                </MemoryRouter>
            </Provider>,
        );
        const snackbar = screen.getByTestId('snackbar');
        expect(snackbar).toBeInTheDocument('Register successful');
        await waitFor(() => {
            expect(snackbar).toBeInTheDocument();
        });
    });

    test('should fail to register', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Register />
                </MemoryRouter>
            </Provider>,
        );
        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'test@example.com' },})
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: '123aA.' },})
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
            target: { value: '123aa.' },})
        fireEvent.click(screen.getByDisplayValue('Sign up'));
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CustomSnackbar />
                </MemoryRouter>
            </Provider>,
        );
        const snackbar = screen.getByTestId('snackbar');
        expect(snackbar).toBeInTheDocument('Registration failed');
        await waitFor(() => {
            expect(snackbar).toBeInTheDocument();
        });
    })
    test('shoud show password criteria based on password input', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Register />
                </MemoryRouter>
            </Provider>,
        );
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: '123' },})

        expect(screen.getByText('At least 6 characters')).toHaveClass('invalid');
        expect(screen.getByText('At least 1 uppercase letter')).toHaveClass('invalid');
        expect(screen.getByText('At least 1 special character (!@#$%^&*.)')).toHaveClass('invalid');

        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: '123aA.' },})
        expect(screen.getByText('At least 6 characters')).toHaveClass('valid');
        expect(screen.getByText('At least 1 uppercase letter')).toHaveClass('valid');
        expect(screen.getByText('At least 1 special character (!@#$%^&*.)')).toHaveClass('valid');
    })
});
