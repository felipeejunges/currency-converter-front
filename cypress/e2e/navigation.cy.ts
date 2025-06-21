describe('Navigation and Routing', () => {
  beforeEach(() => {
    cy.mockAuth()
    cy.mockCurrencies()
    cy.mockConversionHistory()
  })

  it('should redirect to login when accessing protected routes without authentication', () => {
    cy.visit('/convert')
    cy.url().should('include', '/login')
    
    cy.visit('/conversions')
    cy.url().should('include', '/login')
  })

  it('should navigate between pages when authenticated', () => {
    cy.login('test@example.com', 'password123')
    
    cy.visit('/convert')
    cy.url().should('include', '/convert')
    
    cy.get('a').contains('View History').click()
    cy.url().should('include', '/conversions')
    
    cy.get('a').contains('Convert Currency').click()
    cy.url().should('include', '/convert')
  })

  it('should show navbar with user menu when authenticated', () => {
    cy.login('test@example.com', 'password123')
    cy.visit('/convert')
    
    cy.get('.navbar').should('be.visible')
    cy.get('.dropdown').should('be.visible')
    cy.get('.dropdown').should('contain', 'Test User')
  })

  it('should not show navbar on login/register pages', () => {
    cy.visit('/login')
    cy.get('nav').should('not.exist')
    
    cy.visit('/register')
    cy.get('nav').should('not.exist')
  })

  it('should handle 404 routes', () => {
    cy.visit('/nonexistent-page')
    cy.url().should('include', '/login')
  })

  it('should maintain authentication state across page refreshes', () => {
    cy.login('test@example.com', 'password123')
    cy.visit('/convert')
    
    cy.reload()
    cy.url().should('include', '/convert')
    cy.get('.dropdown').should('be.visible')
  })

  it('should logout and redirect to login', () => {
    cy.login('test@example.com', 'password123')
    cy.visit('/convert')
    
    cy.get('.dropdown').click()
    cy.get('button').contains('Logout').click()
    
    cy.wait('@logout')
    cy.url().should('include', '/login')
    
    cy.visit('/convert')
    cy.url().should('include', '/login')
  })

  it('should be responsive with tabs on mobile', () => {
    cy.login('test@example.com', 'password123')
    cy.viewport('iphone-x')
    cy.visit('/convert')
    
    cy.get('.tabs').should('be.visible')
    cy.get('.tab').should('contain', 'Convert Currency')
    cy.get('.tab').should('contain', 'Result')
    
    cy.get('.tab').contains('Result').click()
    cy.get('h2').contains('Conversion Result').should('be.visible')
    
    cy.get('.tab').contains('Convert Currency').click()
    cy.get('h2').contains('Convert Currency').should('be.visible')
  })

  it('should show desktop navigation on larger screens', () => {
    cy.login('test@example.com', 'password123')
    cy.viewport(1280, 720)
    cy.visit('/convert')
    
    cy.get('.tabs').should('not.exist')
    cy.get('a').contains('View History').should('be.visible')
    
    cy.visit('/conversions')
    cy.get('a').contains('Convert Currency').should('be.visible')
  })

  it('should handle browser back/forward navigation', () => {
    cy.login('test@example.com', 'password123')
    
    cy.visit('/convert')
    cy.get('a').contains('View History').click()
    cy.url().should('include', '/conversions')
    
    cy.go('back')
    cy.url().should('include', '/convert')
    
    cy.go('forward')
    cy.url().should('include', '/conversions')
  })

  it('should prevent access to login/register when already authenticated', () => {
    cy.login('test@example.com', 'password123')
    
    cy.visit('/login')
    cy.url().should('include', '/convert')
    
    cy.visit('/register')
    cy.url().should('include', '/convert')
  })
}) 