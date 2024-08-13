/* eslint-disable no-undef */
describe('Home Page E2E Tests', () => {
    beforeEach(() => {
        // Intercept login requests and set up mock responses
        cy.intercept('POST', '**/login?useCookies=true&useSessionCookies=true', {
            statusCode: 200,
            body: {
                token: 'mock-token',
                user: {
                    email: 'test@example.com',
                },
            },
        }).as('loginRequest');

        // Intercept transactions API requests
        cy.intercept('GET', '**/transactions?email=*', {
            statusCode: 200,
            body: [
                {
                    id: '1',
                    name: 'Salary',
                    type: 'Income',
                    date: '2024-07-01T00:00:00Z',
                    amount: 5000,
                },
                {
                    id: '2',
                    name: 'Rent',
                    type: 'Expense',
                    date: '2024-07-02T00:00:00Z',
                    amount: 1500,
                },
            ],
        }).as('fetchTransactions');

        // Visit login page
        cy.visit('https://localhost:3000');

        // Perform login
        cy.get('input#Email').type('test@example.com');
        cy.get('input#Password').type('123aA.');
        cy.get('input[type="submit"]').click();

        // Wait for login request to complete
        cy.wait('@loginRequest');

        // Ensure that login was successful and redirected to the dashboard
        cy.url().should('include', '/dashboard');
    });

    it('should display welcome message with user email', () => {
        cy.get('h1').should('contain.text', 'Welcome, test@example.com'); // Adjust based on actual user email
    });
})