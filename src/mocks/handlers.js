// src/mocks/handlers.js
import { http } from 'msw';

const mockUser = {
    id: 1,
    email: 'test@example.com',
    userName: 'test@example.com',
};

let sessionUser = null;

export const handlers = [
    http.post('http://localhost:5215/login', (req, res, ctx) => {
        const url = new URL(req.url);
        const useCookies = url.searchParams.get('useCookies');
        const useSessionCookies = url.searchParams.get('useSessionCookies');

        const { email, password } = req.body;

        // Simulate the response based on the provided login details
        if (email === 'test@example.com' && password === 'password') {
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

    http.get('http://localhost:5215/users/me', (req, res, ctx) => {
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

    http.post('http://localhost:5215/api/Auth/google-signin', (req, res, ctx) => {
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

    http.post('http://localhost:5215/register', (req,res,ctx) => {
        const { email, password } = req.body;
        if (email && password) {
            sessionUser = mockUser;
            return res(
                ctx.status(200),
                ctx.json({
                    id:'123',
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
];
