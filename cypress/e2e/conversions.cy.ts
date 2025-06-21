const conversionsFixture = require('../fixtures/conversions.json');

describe('Conversions History Page', () => {
  beforeEach(() => {
    cy.mockAuth();
    cy.mockCurrencies();
  });

  it('should display conversions history page with data', () => {
    cy.mockConversionHistory();
    cy.login('test@example.com', 'password123');
    cy.visit('/conversions');
    
    cy.get('h2').contains('Your Conversions').should('be.visible');
    cy.get('.space-y-4 > .border').should('have.length.at.least', 1);
  });

  it('should load and display conversion history correctly', () => {
    cy.mockConversionHistory();
    cy.login('test@example.com', 'password123');
    cy.visit('/conversions');

    cy.wait('@getConversionHistory');
    cy.get('.space-y-4 > .border').first().within(() => {
      cy.get('.text-2xl').should('contain', 'USD → BRL');
      cy.get('.badge').should('contain', '#42');
      cy.get('.text-sm').should('contain', 'May 19, 2024');
      cy.get('.font-semibold').should('contain', '$100.00');
      cy.get('.text-success').should('contain', 'R$525.32');
      cy.get('.text-info').should('contain', '5.2532');
    });
  });

  it('should display empty state when there are no conversions', () => {
    cy.mockEmptyHistory();
    cy.login('test@example.com', 'password123');
    cy.visit('/conversions');

    cy.wait('@getEmptyHistory');
    cy.get('h3').contains('No Conversions Yet').should('be.visible');
    cy.get('p').contains('Start converting currencies to see your history here').should('be.visible');
    cy.get('a.btn').contains('Convert Currency').should('be.visible');
  });

  it('should show an error message if the API fails', () => {
    cy.intercept('GET', '/api/v1/currencies/conversions*', {
      statusCode: 500,
      body: { message: 'Internal Server Error' },
    }).as('getHistoryError');
    cy.login('test@example.com', 'password123');
    cy.visit('/conversions');

    cy.wait('@getHistoryError');
    cy.get('.alert-error').should('be.visible').and('contain', 'Failed to load page data. Please try again.');
  });
  
  it('should navigate to the convert page', () => {
    cy.mockConversionHistory();
    cy.login('test@example.com', 'password123');
    cy.visit('/conversions');
    
    cy.get('a').contains('Convert Currency').click();
    cy.url().should('include', '/convert');
  });
  
  it('should show a loading state while fetching data', () => {
    cy.intercept('GET', '/api/v1/currencies/conversions*', {
      delay: 1000,
      body: conversionsFixture.history,
    }).as('getHistoryWithDelay');
    
    cy.login('test@example.com', 'password123');
    cy.visit('/conversions');
    
    cy.get('.loading-spinner').should('be.visible');
    cy.wait('@getHistoryWithDelay');
    cy.get('.loading-spinner').should('not.exist');
  });
  
  it('should handle pagination correctly', () => {
    cy.mockConversionHistory();
    cy.login('test@example.com', 'password123');
    cy.visit('/conversions');
    
    // With the current mock data, there's only one page, so pagination should not appear.
    cy.get('.join').should('not.exist');
  });
  
  it('should be responsive and render cards on mobile', () => {
    cy.mockConversionHistory();
    cy.login('test@example.com', 'password123');
    cy.viewport('iphone-x');
    cy.visit('/conversions');
    
    cy.get('.space-y-4 > .border').should('be.visible');
    cy.get('.grid-cols-1.md\\:grid-cols-3').should('be.visible');
  });

  it('should logout successfully from the history page', () => {
    cy.mockConversionHistory();
    cy.login('test@example.com', 'password123');
    cy.visit('/conversions');
    
    cy.get('.dropdown').click();
    cy.get('button').contains('Logout').click();
    cy.url().should('include', '/login');
  });
}); 