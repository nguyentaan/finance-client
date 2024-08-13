import React from 'react';
import { server } from '../../src/mocks/server';
import { http } from 'msw';
import store from '../../src/reducers/store';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Header from '../../src/components/Layout/DefautLayout/Header';

describe('Header Integration Tests', () => {
    let dispatch;

    beforeEach(() => {
        dispatch = jest.fn();
        store.dispatch = dispatch;
        localStorage.setItem(
            'user',
            JSON.stringify({
                id: 1,
                email: 'test@example.com',
                userName: 'test@example.com',
            }),
        );
    });

    afterEach(() => {
        localStorage.removeItem('user');
    });

    test('should sign out and navigate to login page', async () => {
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
        fireEvent.click(screen.getByTestId('signout-button'));
        expect(dispatch).toHaveBeenCalled();
        expect(localStorage.getItem('user')).toBeNull();
    });
    test('should open add transaction modal', async () => {
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
        expect(dispatch).toHaveBeenCalled();
    });
});
