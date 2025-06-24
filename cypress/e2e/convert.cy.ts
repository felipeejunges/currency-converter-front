describe('Convert Page', () => {
  beforeEach(() => {
    cy.mockAuth()
    cy.mockCurrencies()
    cy.mockConversions()
    cy.login('test@example.com', 'password123')
  })

  it('should display currency conversion form', () => {
    cy.visit('/convert')
    
    cy.get('h1').should('contain', 'Currency Converter')
    cy.get('.hidden.lg\\:grid select[name="fromCurrency"]').should('be.visible')
    cy.get('.hidden.lg\\:grid select[name="toCurrency"]').should('be.visible')
    cy.get('.hidden.lg\\:grid input[name="fromValue"]').should('be.visible')
    cy.get('.hidden.lg\\:grid button[type="submit"]').should('contain', 'Convert')
  })

  it('should load currencies in dropdowns', () => {
    cy.visit('/convert')
    
    cy.wait('@getCurrencies')
    
    cy.get('.hidden.lg\\:grid select[name="fromCurrency"]').find('option').should('have.length.at.least', 4)
    cy.get('.hidden.lg\\:grid select[name="toCurrency"]').find('option').should('have.length.at.least', 4)
    
    cy.get('.hidden.lg\\:grid select[name="fromCurrency"]').should('contain', 'USD')
    cy.get('.hidden.lg\\:grid select[name="fromCurrency"]').should('contain', 'BRL')
    cy.get('.hidden.lg\\:grid select[name="fromCurrency"]').should('contain', 'EUR')
  })

  it('should show validation errors for empty amount', () => {
    cy.visit('/convert')
    
    cy.wait('@getCurrencies')
    
    cy.get('.hidden.lg\\:grid button[type="submit"]').click()
    
    cy.get('.alert-error').should('contain', 'Please fill in all required fields')
  })

  it('should show validation error for negative amount', () => {
    cy.visit('/convert')
    
    cy.wait('@getCurrencies')
    
    cy.get('.hidden.lg\\:grid select[name="fromCurrency"]').select('USD');
    cy.get('.hidden.lg\\:grid select[name="toCurrency"]').select('BRL');
    cy.get('.hidden.lg\\:grid input[name="fromValue"]').type('-100')
    cy.get('.hidden.lg\\:grid button[type="submit"]').click()
    
    cy.get('.alert-error').should('contain', 'Please enter a valid amount')
  })

  it('should show validation error for zero amount', () => {
    cy.visit('/convert')
    
    cy.wait('@getCurrencies')
    
    cy.get('.hidden.lg\\:grid input[name="fromValue"]').should('not.be.disabled')
    cy.get('.hidden.lg\\:grid select[name="fromCurrency"]').select('USD')
    cy.get('.hidden.lg\\:grid select[name="toCurrency"]').select('BRL')
    cy.get('.hidden.lg\\:grid input[name="fromValue"]').type('0')
    cy.get('.hidden.lg\\:grid button[type="submit"]').click()
    
    cy.get('.alert-error').should('contain', 'Please enter a valid amount')
  })

  it('should successfully convert currency', () => {
    cy.visit('/convert')
    
    cy.wait('@getCurrencies')
    
    cy.get('.hidden.lg\\:grid input[name="fromValue"]').should('not.be.disabled')
    cy.get('.hidden.lg\\:grid select[name="fromCurrency"]').select('USD')
    cy.get('.hidden.lg\\:grid select[name="toCurrency"]').select('BRL')
    cy.get('.hidden.lg\\:grid input[name="fromValue"]').type('100')
    cy.get('.hidden.lg\\:grid button[type="submit"]').click()
    
    cy.wait('@convertCurrency')
    
    cy.get('.alert-success').should('contain', 'Currency converted successfully!')
    cy.get('.text-success').should('contain', 'R$525.32')
  })

  it('should show error message for conversion failure', () => {
    cy.intercept('POST', '/api/v1/currencies/conversions', {
      statusCode: 400,
      body: { message: 'Invalid currency pair' }
    }).as('convertError')
    
    cy.visit('/convert')
    
    cy.wait('@getCurrencies')
    
    cy.get('.hidden.lg\\:grid input[name="fromValue"]').should('not.be.disabled')
    cy.get('.hidden.lg\\:grid select[name="fromCurrency"]').select('USD')
    cy.get('.hidden.lg\\:grid select[name="toCurrency"]').select('BRL')
    cy.get('.hidden.lg\\:grid input[name="fromValue"]').type('100')
    cy.get('.hidden.lg\\:grid button[type="submit"]').click()
    
    cy.wait('@convertError')
    cy.get('.alert-error').should('be.visible')
  })

  it('should prevent same currency conversion', () => {
    cy.visit('/convert')
    
    cy.wait('@getCurrencies')
    
    cy.get('.hidden.lg\\:grid input[name="fromValue"]').should('not.be.disabled')
    cy.get('.hidden.lg\\:grid select[name="fromCurrency"]').select('USD')
    cy.get('.hidden.lg\\:grid select[name="toCurrency"]').select('USD')
    cy.get('.hidden.lg\\:grid input[name="fromValue"]').type('100')
    cy.get('.hidden.lg\\:grid button[type="submit"]').click()
    
    cy.get('.alert-error').should('contain', 'Please select different currencies for conversion')
  })

  it('should clear form after successful conversion', () => {
    cy.visit('/convert')
    
    cy.wait('@getCurrencies')
    
    cy.get('.hidden.lg\\:grid input[name="fromValue"]').should('not.be.disabled')
    cy.get('.hidden.lg\\:grid select[name="fromCurrency"]').select('USD')
    cy.get('.hidden.lg\\:grid select[name="toCurrency"]').select('BRL')
    cy.get('.hidden.lg\\:grid input[name="fromValue"]').type('100')
    cy.get('.hidden.lg\\:grid button[type="submit"]').click()
    
    cy.wait('@convertCurrency')
    
    cy.get('.hidden.lg\\:grid input[name="fromValue"]').should('have.value', '')
  })

  it('should show loading state during conversion', () => {
    cy.intercept('POST', '/api/v1/currencies/conversions', (req) => {
      req.reply({ 
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
        },
        delay: 1000 
      })
    }).as('convertWithDelay')
    
    cy.visit('/convert')
    
    cy.wait('@getCurrencies')
    
    cy.get('.hidden.lg\\:grid input[name="fromValue"]').should('not.be.disabled')
    cy.get('.hidden.lg\\:grid select[name="fromCurrency"]').select('USD')
    cy.get('.hidden.lg\\:grid select[name="toCurrency"]').select('BRL')
    cy.get('.hidden.lg\\:grid input[name="fromValue"]').type('100')
    cy.get('.hidden.lg\\:grid button[type="submit"]').click()
    
    cy.get('.hidden.lg\\:grid button[type="submit"]').should('be.disabled')
    cy.get('.hidden.lg\\:grid button[type="submit"]').should('contain', 'Converting...')
    
    cy.wait('@convertWithDelay')
    
    cy.get('.hidden.lg\\:grid button[type="submit"]').should('not.be.disabled')
    cy.get('.hidden.lg\\:grid button[type="submit"]').should('contain', 'Convert')
  })

  it('should navigate to conversions history', () => {
    cy.visit('/convert')
    
    cy.get('a').contains('View History').click()
    cy.url().should('include', '/conversions')
  })

  it('should logout successfully', () => {
    cy.visit('/convert')
    
    cy.get('.dropdown').click()
    cy.get('button').contains('Logout').click()
    
    cy.wait('@logout')
    cy.url().should('include', '/login')
  })
}) 