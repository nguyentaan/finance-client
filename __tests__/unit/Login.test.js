import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Login from '../../src/pages/Login/Login';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';
import CustomSnackbar from '../../src/components/snackbar/snackbar';
// import { server } from "../../src/mocks/server";
// import { rest } from "msw";

describe('Login', () => {
    test('render login form', async () => {
        renderWithProviders(
            <Router>
                <Login />
            </Router>,
        );

        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Sign in')).toBeInTheDocument();
    });

    test('should show validation error when email or password is missing', async () => {
        renderWithProviders(
            <Router>
                <Login />
            </Router>,
        );

        fireEvent.click(screen.getByDisplayValue('Sign in'));
        // Check for validation error messages
        const emailError = screen.queryByTestId('error-message-email');
        const passwordError = screen.queryByTestId('error-message-password');

        expect(emailError).toBeInTheDocument(); // Expect email error message to be in the document
        expect(passwordError).toBeInTheDocument(); // Expect password error message to be in the document
    });

    test('should successfully login', async () => {
        renderWithProviders(
            // <Router>
            <MemoryRouter initialEntries={['/']}>
                <Login />
            </MemoryRouter>,
            // </Router>,
        );
        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'password' },
        });
        fireEvent.click(screen.getByDisplayValue('Sign in'));
        // Wait for snackbar to appear
        renderWithProviders(<CustomSnackbar />);
        const snackbar = screen.getByTestId('snackbar');
        expect(snackbar).toBeInTheDocument('Login successful');
        await waitFor(() => {
            expect(snackbar).toBeInTheDocument();
        });
    });

    test('shoudl fail to login', async () => {
        renderWithProviders(
            <MemoryRouter initialEntries={['/']}>
                <Login />
            </MemoryRouter>,
        );
        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'wrongpassword' },
        });
        fireEvent.click(screen.getByDisplayValue('Sign in'));
        // Wait for snackbar to appear
        renderWithProviders(<CustomSnackbar />);
        const snackbar = screen.getByTestId('snackbar');
        expect(snackbar).toBeInTheDocument('Invalid email or password');
        await waitFor(() => {
            expect(snackbar).toBeInTheDocument();
        });
    });
});
