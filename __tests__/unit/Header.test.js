import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Header from '../../src/components/Layout/DefautLayout/Header'; // Adjust the path if necessary
import store from '../../src/reducers/store'; // Adjust the path if necessary
import { server } from '../../src/mocks/server';
import { http } from 'msw';
import React from 'react';

describe('Header', () => {

    let dispatch;

    beforeEach(() => {
        dispatch = jest.fn();
        store.dispatch = dispatch;
        localStorage.setItem('user', JSON.stringify({
            id: 1,
            email: 'test@example.com',
            userName: 'test@example.com',
        }));
    });

    afterEach(() => {
        localStorage.removeItem('user');
    })

    test('should render header', async () => {
        server.use(
            http.get('http://localhost:5215/users/me', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json({
                        id: 1,
                        email: 'test@example.com',
                        userName: 'test@example.com',
                    }),
                );
            }),
        );
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Header />
                </MemoryRouter>
            </Provider>,
        );

        // Use separate waitFor calls for each assertion
        await waitFor(() => {
            expect(screen.getByText('My Money')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText('Add transaction')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByTestId('signout-button')).toBeInTheDocument();
        });
    });
    test('should sign out', async () => {
        server.use(
            http.get('http://localhost:5215/users/me', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json({
                        id: 1,
                        email: 'test@example.com',
                        userName: 'test@example.com',
                    }),
                );
            }
        ));
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Header />
                </MemoryRouter>
            </Provider>,
        );
        fireEvent.click(screen.getByTestId('signout-button'));

        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledTimes(1);
        });

        expect(localStorage.getItem('user')).toBeNull();
    })

    test('should dispatch toggleIsOpen action on clicking "Add transaction" button', async () => {
        server.use(
            http.get('http://localhost:5215/users/me', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json({
                        id: 1,
                        email: 'test@example.com',
                        userName: 'test@example.com',
                    }),
                );
            }),
        );
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Header />
                </MemoryRouter>
            </Provider>,
        );
        fireEvent.click(screen.getByTestId('add-button'));
        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledTimes(1);
        });
    });
});
