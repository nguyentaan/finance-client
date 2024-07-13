/* eslint-disable jest/valid-expect-in-promise */
/* eslint-disable testing-library/await-async-utils */
/* eslint-disable no-undef */
describe('Login Page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });
    it('should display the login page', () => {
        cy.contains('Login to Your Account').should('be.visible');
    });

    it('Login Form', () => {
        cy.get('label').contains('Email address').should('be.visible');
        cy.get('input[id="Email"]').should('be.visible');
        cy.get('label').contains('Password').should('be.visible');
        cy.get('input[id="Password"]').should('be.visible');
        cy.get('input[id="remember-me"]').should('be.visible');
        cy.get('label').contains('Remember me').should('be.visible');
        cy.get('div a').contains('Forgot password?').should('be.visible');

        cy.get('input[type="submit"]').should('be.visible');
    });

    it('should login successfully with valid credentials', () => {
        cy.intercept('POST', '**/login?useCookies=true&useSessionCookies=true', {
            statusCode: 200,
            body: { message: 'Login successful', user: { id: 1, email: 'tan@test.com' } },
        }).as('loginRequest');

        cy.get('input#Email').type('tan@test.com');
        cy.get('input#Password').type('123aA.');
        cy.get('input[type="submit"]').click();

        cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
        cy.url().should('include', '/dashboard');
    });

    it('should show error message for invalid credentials', () => {
        cy.intercept('POST', '**/login?useCookies=true&useSessionCookies=true', {
            statusCode: 401,
            body: { message: 'Invalid email or password' },
        }).as('loginRequest');

        cy.get('input#Email').type('invalid@example.com');
        cy.get('input#Password').type('invalidpassword');
        cy.get('input[type="submit"]').click();

        cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);

        cy.get('.error-message', { timeout: 10000 }).should('contain', 'Invalid email or password');
    });
});
