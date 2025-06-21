/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
export {}

const conversionsFixture = require('../fixtures/conversions.json');

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<Element>
      logout(): Chainable<Element>
      mockAuth(): Chainable<Element>
      mockCurrencies(): Chainable<Element>
      mockConversions(): Chainable<Element>
      mockConversionHistory(): Chainable<Element>
      mockEmptyHistory(): Chainable<Element>
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.intercept('POST', '/api/v1/login', {
    statusCode: 200,
    body: {
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User'
      },
      token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE2MzQ1Njc4OTB9.test-token'
    }
  }).as('login')
  
  cy.visit('/login')
  cy.get('input[placeholder="Enter your email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
  
  cy.wait('@login')
  
  cy.url().should('include', '/convert')
  cy.get('.navbar').should('be.visible')
})

Cypress.Commands.add('logout', () => {
  cy.intercept('DELETE', '/api/v1/logout', { fixture: 'auth.json' }).as('logout')
  
  cy.get('.dropdown').click()
  cy.get('button').contains('Logout').click()
  
  cy.wait('@logout')
  cy.url().should('include', '/login')
})

Cypress.Commands.add('mockAuth', () => {
  cy.intercept('POST', '/api/v1/login', { fixture: 'auth.json' }).as('login')
  cy.intercept('POST', '/api/v1/register', { fixture: 'auth.json' }).as('register')
  cy.intercept('DELETE', '/api/v1/logout', { fixture: 'auth.json' }).as('logout')
})

Cypress.Commands.add('mockCurrencies', () => {
  cy.intercept('GET', '/api/v1/currencies', { fixture: 'currencies.json' }).as('getCurrencies')
})

Cypress.Commands.add('mockConversions', () => {
  cy.intercept('POST', '/api/v1/currencies/conversions', {
    statusCode: 200,
    body: {
      transaction_id: 42,
      user_id: 123,
      from_currency: "USD",
      to_currency: "BRL",
      from_value: "100.0",
      to_value: "525.32",
      rate: "5.2532",
      timestamp: "2024-05-19T18:00:00Z"
    }
  }).as('convertCurrency')
})

Cypress.Commands.add('mockConversionHistory', () => {
  cy.intercept('GET', '/api/v1/currencies/conversions*', {
    statusCode: 200,
    body: conversionsFixture.history,
  }).as('getConversionHistory');
})

Cypress.Commands.add('mockEmptyHistory', () => {
  cy.intercept('GET', '/api/v1/currencies/conversions*', {
    statusCode: 200,
    body: conversionsFixture.empty_history,
  }).as('getEmptyHistory');
})