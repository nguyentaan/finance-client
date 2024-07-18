import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
// import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import GoogleButton from '../../src/components/googleButton';
import * as reactRedux from 'react-redux';
import * as reactRouterDom from 'react-router-dom';

// Mock modules
jest.mock('@react-oauth/google', () => ({
    GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
    GoogleLogin: ({ onSuccess, onFailure }) => (
        <button onClick={() => onSuccess({ credential: 'test_credential' })}>Login with Google</button>
    ),
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'), // Preserve other exports from the module
    useDispatch: jest.fn(), // Mock useDispatch
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // Preserve other exports from the module
    useNavigate: jest.fn(), // Mock useNavigate
}));

const mockStore = configureStore([]);
const store = mockStore({});

describe('GoogleButton', () => {
    const mockDispatchFn = jest.fn();
    const mockNavigateFn = jest.fn();

    beforeEach(() => {
        // Reset mocks before each test
        mockDispatchFn.mockClear();
        mockNavigateFn.mockClear();
        // Override the mock implementation if needed
        reactRedux.useDispatch.mockReturnValue(mockDispatchFn);
        reactRouterDom.useNavigate.mockReturnValue(mockNavigateFn);
    });

    it('renders without crashing', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <GoogleButton />
                </MemoryRouter>
            </Provider>,
        );
    });

    // it('navigates to /dashboard on successful login', async () => {
    //     mockDispatchFn.mockResolvedValue({ payload: { message: 'Google sign-in successful' } });

    //     render(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <GoogleButton />
    //             </MemoryRouter>
    //         </Provider>,
    //     );

    //     fireEvent.click(screen.getByText('Login with Google'));
    //     expect(mockDispatchFn).toHaveBeenCalledWith({ credential: 'test_credential' });
    //     expect(mockNavigateFn).toHaveBeenCalledWith('/dashboard');
    // });

    // it('logs error on login failure', async () => {
    //     console.error = jest.fn();
    //     mockDispatchFn.mockRejectedValue(new Error('API Error'));

    //     render(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <GoogleButton />
    //             </MemoryRouter>
    //         </Provider>,
    //     );

    //     fireEvent.click(screen.getByText('Login with Google'));
    //     await waitFor(() => {
    //         // Wait for the async operation to complete
    //         expect(console.error).toHaveBeenCalledWith('API Error');
    //     });
    // });
});
