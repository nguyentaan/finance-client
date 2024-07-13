/* eslint-disable no-undef */
import React from "react";
import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "../../src/reducers/store";
import Register from "../../src/pages/Register/Register";

describe('Register component', () => {
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    )
  });

  it('should display the registration form', () => {
    cy.get('[data-test="register-container"]').should('be.visible');
    cy.get('h1').contains('Create New Account').should('be.visible');
  });

  it('should display the Google button', () => {
    cy.get('[data-test="google-button"]').should('be.visible');
  });

  it('should display the form fields', () => {
    cy.get('[data-test="email-field"]').should('be.visible');
    cy.get('[data-test="password-field"]').should('be.visible');
    cy.get('[data-test="submit-button"]').should('be.visible');
  })

  it('should display the password criteria', () => {
    cy.get('[data-test="password-criteria"]').should('be.visible');
    cy.get('[data-test="password-criteria"]').contains('Password must be at least 6 characters').should('be.visible');
    cy.get('[data-test="password-criteria"]').contains('Password must contain an uppercase letter').should('be.visible');
    cy.get('[data-test="password-criteria"]').contains('Password must contain a special character').should('be.visible');
  })

  it('should display the error messages', () => {
    cy.get('[data-test="submit-button"]').click();
    cy.get('[data-test="email-error"]').contains('Email is required').should('be.visible');
    cy.get('[data-test="password-error"]').contains('Password is required').should('be.visible');
    cy.get('[data-test="confirm-password-error"]').contains('Confirm Password is required').should('be.visible');
  })

  it('should display the error message for invalid email', () => {
    cy.get('[data-test="email-field"]').type('test');
    cy.get('[data-test="submit-button"]').click();
    cy.get('[data-test="email-error"]').contains('Invalid email address').should('be.visible');
  })
})