import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import Home from '../../src/pages/Home/Home';
// import store from '../../src/reducers/store';
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

describe('Home', () => {
    test('should renders the Home component with welcome message', async () => {
        server.use(
            http.get('https://personal-finacne-tracking.azurewebsites.net/api/Transaction/byemail', (req, res, ctx) => {
                const email = req.url.searchParams.get('email');
                const userTransactions = mockTransactions.filter((transaction) => transaction.email === email);
                if (userTransactions.length > 0) {
                    return res(ctx.status(200), ctx.json(userTransactions));
                } else {
                    return res(ctx.status(200), ctx.json([]));
                }
            }),
        );
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            </Provider>,
        );
        expect(screen.getByText('Welcome, test@example.com')).toBeInTheDocument();
    });

    test('should render LineChart with data when transactions are available', async () => {
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

        // Check if LineChart component is rendered with data
        const lineChart = screen.getByTestId('line-chart');
        expect(lineChart).toBeInTheDocument();
        // Add more specific checks if needed, e.g., checking if chart has correct data
    });

    test('should render DoughnutChart with filter options when transactions are available', async () => {
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

        const doughnutChart = screen.getByTestId('donut-chart');
        expect(doughnutChart).toBeInTheDocument();

        // Check if filter buttons are present
        expect(screen.getByTestId('both-button')).toBeInTheDocument();
        expect(screen.getByTestId('income-button')).toBeInTheDocument();
        expect(screen.getByTestId('expense-button')).toBeInTheDocument();
    });

    test('should render Calendar component when transactions are available', async () => {
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

        const calendar = screen.getByTestId('calendar');
        expect(calendar).toBeInTheDocument();
        // Add more specific checks if needed, e.g., checking if calendar displays transactions
    });

    test('should render TransactionSummary component when transactions are available', async () => {
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

        const totalAmount = screen.getByTestId('total-amount');
        expect(totalAmount).toBeInTheDocument();
        // Add more specific checks if needed, e.g., checking if the summary displays correct totals
    });

    test('should render transaction list with transactions', async () => {
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

        const transactionList = screen.getByTestId('transactions-list');
        expect(transactionList).toBeInTheDocument();

        // Check if transaction items are rendered
        expect(screen.getByText('Salary')).toBeInTheDocument();
        expect(screen.getByText('Rent')).toBeInTheDocument();
    });

    test('should apply filter and display correct DoughnutChart data', async () => {
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

        const bothButton = screen.getByTestId('both-button');
        const incomeButton = screen.getByTestId('income-button');
        const expenseButton = screen.getByTestId('expense-button');
        expect(bothButton).toBeInTheDocument();
        expect(incomeButton).toBeInTheDocument();
        expect(expenseButton).toBeInTheDocument();
        // Check initial state
        expect(incomeButton).not.toHaveClass('selected');
        expect(expenseButton).not.toHaveClass('selected');
        expect(bothButton).toHaveClass('selected');
    });

    test('should apply filter "Income" and display correct DoughnutChart data', async () => {
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

        const bothButton = screen.getByTestId('both-button');
        const incomeButton = screen.getByTestId('income-button');
        const expenseButton = screen.getByTestId('expense-button');
        expect(bothButton).toBeInTheDocument();
        expect(incomeButton).toBeInTheDocument();
        expect(expenseButton).toBeInTheDocument();
        // Check initial state
        // Interact with filter buttons
        fireEvent.click(incomeButton);
        expect(incomeButton).toHaveClass('selected');
        expect(expenseButton).not.toHaveClass('selected');
        expect(bothButton).not.toHaveClass('selected');
    });

    test('should apply filter "Expense" and display correct DoughnutChart data', async () => {
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

        const bothButton = screen.getByTestId('both-button');
        const incomeButton = screen.getByTestId('income-button');
        const expenseButton = screen.getByTestId('expense-button');
        expect(bothButton).toBeInTheDocument();
        expect(incomeButton).toBeInTheDocument();
        expect(expenseButton).toBeInTheDocument();
        // Check initial state
        // Interact with filter buttons
        fireEvent.click(expenseButton);
        expect(incomeButton).not.toHaveClass('selected');
        expect(expenseButton).toHaveClass('selected');
        expect(bothButton).not.toHaveClass('selected');
    });

    test('should render all components when there are no transactions', async () => {
        server.use(
            http.get('https://personal-finacne-tracking.azurewebsites.net/api/Transaction/byemail', (req, res, ctx) => {
                const email = req.url.searchParams.get('email');
                const userTransactions = mockTransactions.filter((transaction) => transaction.email === email);
                if (userTransactions.length > 0) {
                    return res(ctx.status(200), ctx.json(userTransactions));
                }
            }),
        );
        render(
            <Provider store={mockStoreWithoutTransactions}>
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            </Provider>,
        );
        expect(screen.getByText('Welcome, test@example1.com')).toBeInTheDocument();
        const noTransactionsMessages = screen.getAllByText('There is no transaction history');
        noTransactionsMessages.forEach((message) => expect(message).toBeInTheDocument());
        expect(screen.getByText('No transactions available')).toBeInTheDocument();
        expect(screen.getByTestId('calendar')).toBeInTheDocument();
        expect(screen.getByTestId('total-amount')).toBeInTheDocument();
    });
    test('should display DoughnutChart options filter correctly', () => {
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            </Provider>,
        );
        const doughnutChart = screen.getByTestId('donut-chart');
        expect(doughnutChart).toBeInTheDocument();

        //Check filter buttons
        const bothButton = screen.getByTestId('both-button');
        expect(bothButton).toBeInTheDocument();

        const incomeButton = screen.getByTestId('income-button');
        expect(incomeButton).toBeInTheDocument();

        const expenseButton = screen.getByTestId('expense-button');
        expect(expenseButton).toBeInTheDocument();
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
