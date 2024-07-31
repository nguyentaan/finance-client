// src/mocks/handlers.js
import { http } from 'msw';

const mockUser = {
    id: 1,
    email: 'test@example.com',
    userName: 'test@example.com',
};

const mockTransactions = [
    {
        id: '1',
        email: 'test@example.com',
        name: 'Salary',
        type: 'Income',
        description: 'Monthly salary',
        date:'2021-09-01',
        amount: 1000000,
    },
    {
        id: '2',
        email: 'test@example.com',
        name: 'Rent',
        type: 'Expense',
        description: 'Monthly rent',
        date:'2021-09-02',
        amount: 500000,
    }
]

const mockTransactionsWithoutData = [];

let sessionUser = null;

export const handlers = [
    // http.post('https://personal-finacne-tracking.azurewebsites.net/login', (req, res, ctx) => {
        http.post('https://localhost:7086/login', (req, res, ctx) => {
        const url = new URL(req.url);
        const useCookies = url.searchParams.get('useCookies');
        const useSessionCookies = url.searchParams.get('useSessionCookies');

        const { email, password } = req.body;

        // Simulate the response based on the provided login details
        if (email === 'test@example.com' && password === '123aA.') {
            sessionUser = mockUser;
            return res(
                ctx.status(200),
                ctx.json({
                    message: 'Login successful',
                    email,
                    useCookies,
                    useSessionCookies,
                }),
            );
        }

        return res(
            ctx.status(401),
            ctx.json({
                message: 'Invalid email or password',
            }),
        );
    }),

    // http.get('https://personal-finacne-tracking.azurewebsites.net/users/me', (req, res, ctx) => {
        http.get('https://localhost:7086/users/me', (req, res, ctx) => {
        if (sessionUser) {
            return res(ctx.status(200), ctx.json(sessionUser));
        }
        return res(
            ctx.status(401),
            ctx.json({
                message: 'Unauthorized',
            }),
        );
    }),

    // http.post('https://personal-finacne-tracking.azurewebsites.net/api/Auth/google-signin', (req, res, ctx) => {
        http.post('https://localhost:7086/api/Auth/google-signin', (req, res, ctx) => {
        const { tokenId } = req.body;
        if (tokenId === 'google-token') {
            sessionUser = mockUser;
            return res(
                ctx.status(200),
                ctx.json({
                    message: 'Google sign-in successful',
                    user: mockUser,
                }),
            );
        }
        return res(
            ctx.status(401),
            ctx.json({
                message: 'Invalid Google token',
            }),
        );
    }),

    // http.post('https://personal-finacne-tracking.azurewebsites.net/register', (req, res, ctx) => {
        http.post('https://localhost:7086/register', (req,res,ctx) => {
        const { email, password } = req.body;
        if (email && password) {
            sessionUser = mockUser;
            return res(
                ctx.status(200),
                ctx.json({
                    id: '123',
                    message: 'Registration successful',
                    email,
                }),
            );
        } else {
            return res(
                ctx.status(400),
                ctx.json({
                    message: 'Registration failed',
                }),
            );
        }
    }),

    // http.post('https://personal-finacne-tracking.azurewebsites.net/api/Transaction/create', (req, res, ctx) => {
        http.post('http://localhost:7086/api/Transaction/create', (req, res, ctx) => {
        const transaction = req.body;
        if (transaction) {
            return res(
                ctx.status(200),
                ctx.json({
                    id: '123',
                    message: 'Transaction created successfully',
                    transaction,
                }),
            );
        } else {
            return res(
                ctx.status(400),
                ctx.json({
                    message: 'Transaction creation failed',
                }),
            );
        }
    }),

    // http.get('https://personal-finacne-tracking.azurewebsites.net/api/Transaction/byemail', (req, res, ctx) => {
        http.get('http://localhost:7086/api/Transaction/byemail', (req, res, ctx) => {
        const email = req.url.searchParams.get('email');
        const transactions = email === 'test@example.com' ? mockTransactions : mockTransactionsWithoutData;
        return res(ctx.status(200), ctx.json(transactions));
    })
];
