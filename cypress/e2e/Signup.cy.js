/* eslint-disable no-undef */
describe('Register page E2E Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/register');
    });

    it('should display the registration form', () => {
        cy.get('h1').contains('Create New Account').should('be.visible');
        cy.get('label').contains('Email address').should('be.visible');
        cy.get('input[id="Email"]').should('be.visible');
        cy.get('label').contains('Password').should('be.visible');
        cy.get('input[id="Password"]').should('be.visible');
        cy.get('label').contains('Confirm Password').should('be.visible');
        cy.get('input[id="ConfirmPassword"]').should('be.visible');
        cy.get('input[type="submit"]').should('be.visible');
    });

    it('should show validation errors for empty fields', () => {
        cy.get('input[type="submit"]').click();
        cy.get('p').should('have.length', 3);
    });

    it('should show validation error for invalid email', () => {
        cy.get('input[id="Email"]').type('invalid-email');
        cy.get('input[type="submit"]').click();
        cy.get('p').contains('Email is invalid').should('be.visible');
    });

    it('should show validation errors for invalid password', () => {
        cy.get('input[id="Email"]').type('test@example.com');
        cy.get('input[id="Password"]').type('123');
        cy.get('input[id="ConfirmPassword"]').type('123');
        cy.get('input[type="submit"]').click();
        cy.get('p').contains('Password must be at least 6 characters').should('be.visible');
    });

    it('should show error for password mismatch', () => {
        cy.get('input[id="Email"]').type('test@example.com');
        cy.get('input[id="Password"]').type('123aA.');
        cy.get('input[id="ConfirmPassword"]').type('123aA');
        cy.get('input[type="submit"]').click();
        cy.get('p').contains('Passwords do not match').should('be.visible');
    });

    it('should submit the form successfully', () => {
        cy.intercept('POST', '**/register', {
            statusCode: 200,
            body: { message: 'User created successfully' },
        }).as('register');

        cy.get('input[id="Email"]').type('test@example4.com');
        cy.get('input[id="Password"]').type('123aA.');
        cy.get('input[id="ConfirmPassword"]').type('123aA.');
        cy.get('input[type="submit"]').click();

        cy.wait('@register').its('response.statusCode').should('eq', 200);
        cy.url().should('eq', `http://localhost:3000/`);
    });

    it('should navigate to login page', () => {
        cy.get('a').contains('Login').click();
        cy.url().should('include', '/');
    });
});
