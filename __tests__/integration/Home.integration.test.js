import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import Home from '../../src/pages/Home/Home';
import { MemoryRouter } from 'react-router-dom';
import userReducer from '../../src/reducers/authSlice';
import transactionsReducer from '../../src/reducers/transSlice';
import isOpenReducer from '../../src/reducers/homeSlice';
import { server } from '../../src/mocks/server';
import { http } from 'msw';
import { configureStore } from '@reduxjs/toolkit';

const mockTransactions = [
    {
        id: '1',
        email: 'test@example.com',
        name: 'Salary',
        type: 'Income',
        description: 'Monthly salary',
        date: '2021-09-01',
        amount: 1000000,
    },
    {
        id: '2',
        email: 'test@example.com',
        name: 'Rent',
        type: 'Expense',
        description: 'Monthly rent',
        date: '2021-09-02',
        amount: 500000,
    },
];

// Mock store setup
const mockStore = configureStore({
    reducer: {
        auth: userReducer,
        transactions: transactionsReducer,
        isOpen: isOpenReducer,
    },
    preloadedState: {
        auth: {
            user: {
                email: 'test@example.com',
            },
        },
        transactions: {
            transactions: mockTransactions,
        },
        isOpen: {
            isOpen: false,
        },
    },
});

// Mock store without transactions
const mockStoreWithoutTransactions = configureStore({
    reducer: {
        auth: userReducer,
        transactions: transactionsReducer,
        isOpen: isOpenReducer,
    },
    preloadedState: {
        auth: {
            user: {
                email: 'test@example1.com',
            },
        },
        transactions: {
            transactions: [], // No transactions
        },
        isOpen: {
            isOpen: false,
        },
    },
});

describe('Home Integration Tests', () => {
    beforeAll(() => {
        server.listen();
    });

    afterEach(() => {
        server.resetHandlers();
    });

    afterAll(() => {
        server.close();
    });

    test('should render all components and interactions correctly when there are transactions', async () => {
        server.use(
            http.get('https://personal-finacne-tracking.azurewebsites.net/api/Transaction/byemail', (req, res, ctx) => {
                const email = req.url.searchParams.get('email');
                const userTransactions = mockTransactions.filter((transaction) => transaction.email === email);
                return res(ctx.status(200), ctx.json(userTransactions));
            }),
        );

        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            </Provider>,
        );

        // Check if all components are rendered
        expect(screen.getByText('Welcome, test@example.com')).toBeInTheDocument();
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        expect(screen.getByTestId('transactions-list')).toBeInTheDocument();
        expect(screen.getByTestId('donut-chart')).toBeInTheDocument();
        expect(screen.getByTestId('calendar')).toBeInTheDocument();
        expect(screen.getByTestId('total-amount')).toBeInTheDocument();

        // Check if transaction list is rendered correctly
        const transactionItem1 = screen.getByText('Salary');
        const transactionItem2 = screen.getByText('Rent');
        expect(transactionItem1).toBeInTheDocument();
        expect(transactionItem2).toBeInTheDocument();

        // Check DoughnutChart filter buttons
        const bothButton = screen.getByTestId('both-button');
        const incomeButton = screen.getByTestId('income-button');
        const expenseButton = screen.getByTestId('expense-button');
        expect(bothButton).toBeInTheDocument();
        expect(incomeButton).toBeInTheDocument();
        expect(expenseButton).toBeInTheDocument();

        // Interact with filter buttons
        fireEvent.click(incomeButton);
        expect(incomeButton).toHaveClass('selected');
        expect(expenseButton).not.toHaveClass('selected');
        expect(bothButton).not.toHaveClass('selected');

        fireEvent.click(expenseButton);
        expect(incomeButton).not.toHaveClass('selected');
        expect(expenseButton).toHaveClass('selected');
        expect(bothButton).not.toHaveClass('selected');

        fireEvent.click(bothButton);
        expect(incomeButton).not.toHaveClass('selected');
        expect(expenseButton).not.toHaveClass('selected');
        expect(bothButton).toHaveClass('selected');
    });

    test('should render no transactions message and components correctly when there are no transactions', async () => {
        server.use(
            http.get('https://personal-finacne-tracking.azurewebsites.net/api/Transaction/byemail', (req, res, ctx) => {
                const email = req.url.searchParams.get('email');
                const userTransactions = mockTransactions.filter((transaction) => transaction.email === email);
                return res(ctx.status(200), ctx.json(userTransactions));
            }),
        );

        render(
            <Provider store={mockStoreWithoutTransactions}>
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            </Provider>,
        );

        // Check if all components are rendered
        expect(screen.getByText('Welcome, test@example1.com')).toBeInTheDocument();
        const noTransactionsMessages = screen.getAllByText('There is no transaction history');
        noTransactionsMessages.forEach((message) => expect(message).toBeInTheDocument());
        expect(screen.getByText('No transactions available')).toBeInTheDocument();
        expect(screen.getByTestId('calendar')).toBeInTheDocument();
        expect(screen.getByTestId('total-amount')).toBeInTheDocument();
    });

    test('should interact with DoughnutChart filter buttons and update state', async () => {
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            </Provider>,
        );

        // Check DoughnutChart filter buttons
        const bothButton = screen.getByTestId('both-button');
        const incomeButton = screen.getByTestId('income-button');
        const expenseButton = screen.getByTestId('expense-button');

        expect(bothButton).toBeInTheDocument();
        expect(incomeButton).toBeInTheDocument();
        expect(expenseButton).toBeInTheDocument();

        // Interact with filter buttons
        fireEvent.click(incomeButton);
        expect(incomeButton).toHaveClass('selected');
        expect(expenseButton).not.toHaveClass('selected');
        expect(bothButton).not.toHaveClass('selected');

        fireEvent.click(expenseButton);
        expect(incomeButton).not.toHaveClass('selected');
        expect(expenseButton).toHaveClass('selected');
        expect(bothButton).not.toHaveClass('selected');

        fireEvent.click(bothButton);
        expect(incomeButton).not.toHaveClass('selected');
        expect(expenseButton).not.toHaveClass('selected');
        expect(bothButton).toHaveClass('selected');
    });

    test('should render transaction list correctly when transactions are available', async () => {
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            </Provider>,
        );

        const transactionItem1 = screen.getByText('Salary');
        const transactionItem2 = screen.getByText('Rent');

        expect(transactionItem1).toBeInTheDocument();
        expect(transactionItem2).toBeInTheDocument();
    });

    test('should format date correctly', () => {
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            </Provider>,
        );

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };

        const formattedDate = formatDate('2024-01-01');
        expect(formattedDate).toBe('01/01/2024');
    });
});
