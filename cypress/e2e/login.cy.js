/* eslint-disable jest/valid-expect-in-promise */
/* eslint-disable testing-library/await-async-utils */
/* eslint-disable no-undef */
describe('Login Page E2E Tests', () => {
    beforeEach(() => {
        cy.visit('https://localhost:3000');
    });
    it('should display the login page', () => {
        cy.contains('Login to Your Account').should('be.visible');
    });

    it('should show validation error when email or password is missing', () => {
        cy.get('input[type="submit"]').click();
        cy.get('[data-testid=error-message-email').should('be.visible');
        cy.get('[data-testid=error-message-password').should('be.visible');
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
            body: { message: 'Login successful', user: { id: 1, email: 'test@example.com' } },
        }).as('loginRequest');

        cy.get('input#Email').type('tan@test.com');
        cy.get('input#Password').type('123aA.');
        cy.get('input[type="submit"]').click();

        cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
        // Wait for the snackbar to appear and verify its content
        // Verify that the snackbar displays the success message
        // cy.get('[data-testid="snackbar"]', { timeout: 1000 })
        //     .should('be.visible')
        //     .and('contain.text', 'Login successful');

        // // Wait for the snackbar to disappear (1 second)
        // cy.wait(1000); // Adjust timing as needed

        // Check if the user is redirected to the dashboard
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

        // cy.get('[data-testid="snackbar"]', { timeout: 1000 }).then(($snackbar) => {
        //     console.log($snackbar.html()); // Debug the HTML of the Snackbar
        //     cy.wrap($snackbar).should('be.visible').and('contain.text', 'Invalid email or password');
        // });
    });

    it('should navigate to Sign up page', () => {
        cy.get('a').contains('Create account').click();
        cy.url().should('include', '/register');
    });
});
