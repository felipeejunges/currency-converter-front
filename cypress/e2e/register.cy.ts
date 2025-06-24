describe('Register Page', () => {
  beforeEach(() => {
    cy.mockAuth()
  })

  it('should display registration form', () => {
    cy.visit('/register')
    
    cy.get('h2').should('contain', 'Create Account')
    cy.get('input[name="firstName"]').should('be.visible')
    cy.get('input[name="lastName"]').should('be.visible')
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('input[name="passwordConfirmation"]').should('be.visible')
    cy.get('button[type="submit"]').should('contain', 'Create Account')
    cy.get('a').should('contain', 'Sign in here')
  })

  it('should show validation errors for empty fields', () => {
    cy.visit('/register')
    
    cy.get('button[type="submit"]').click()
    
    cy.get('.label-text-alt.text-error').should('contain', 'First name is required')
    cy.get('.label-text-alt.text-error').should('contain', 'Last name is required')
    cy.get('.label-text-alt.text-error').should('contain', 'Email is required')
    cy.get('.label-text-alt.text-error').should('contain', 'Password must be at least 6 characters long')
  })

  it('should show validation error for invalid email', () => {
    cy.visit('/register')
    
    cy.get('input[name="firstName"]').type('John')
    cy.get('input[name="lastName"]').type('Doe')
    cy.get('input[name="email"]').type('not-an-email')
    cy.get('input[name="password"]').type('password123')
    cy.get('input[name="passwordConfirmation"]').type('password123')
    cy.get('button[type="submit"]').click()
    
    cy.get('.label-text-alt.text-error').should('contain', 'Please enter a valid email address')
  })

  it('should show validation error for password mismatch', () => {
    cy.visit('/register')
    
    cy.get('input[name="firstName"]').type('John')
    cy.get('input[name="lastName"]').type('Doe')
    cy.get('input[name="email"]').type('john@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('input[name="passwordConfirmation"]').type('differentpassword')
    cy.get('button[type="submit"]').click()
    
    cy.get('input[name="passwordConfirmation"]').should('have.class', 'input-error')
    cy.get('.label-text-alt.text-error').should('contain', 'Passwords do not match')
  })

  it('should show validation error for short password', () => {
    cy.visit('/register')
    
    cy.get('input[name="firstName"]').type('John')
    cy.get('input[name="lastName"]').type('Doe')
    cy.get('input[name="email"]').type('john@example.com')
    cy.get('input[name="password"]').type('123')
    cy.get('input[name="passwordConfirmation"]').type('123')
    cy.get('button[type="submit"]').click()
    
    cy.get('input[name="password"]').should('have.class', 'input-error')
    cy.get('.label-text-alt.text-error').should('contain', 'Password must be at least 6 characters long')
  })

  it('should successfully register with valid data', () => {
    cy.intercept('POST', '/api/v1/register', {
      statusCode: 200,
      body: {
        message: 'User registered successfully'
      }
    }).as('registerSuccess')
    
    cy.visit('/register')
    
    cy.get('input[name="firstName"]').type('John')
    cy.get('input[name="lastName"]').type('Doe')
    cy.get('input[name="email"]').type('john@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('input[name="passwordConfirmation"]').type('password123')
    cy.get('button[type="submit"]').click()
    
    cy.wait('@registerSuccess')
    
    cy.get('.alert-success').should('contain', 'User registered successfully')
    
    cy.url().should('include', '/login', { timeout: 5000 })
  })

  it('should show error message for existing email', () => {
    cy.intercept('POST', '/api/v1/register', {
      statusCode: 422,
      body: { message: 'Email has already been taken' }
    }).as('registerError')
    
    cy.visit('/register')
    
    cy.get('input[name="firstName"]').type('John')
    cy.get('input[name="lastName"]').type('Doe')
    cy.get('input[name="email"]').type('existing@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('input[name="passwordConfirmation"]').type('password123')
    cy.get('button[type="submit"]').click()
    
    cy.wait('@registerError')
    cy.get('.alert-error').should('be.visible')
  })

  it('should navigate to login page', () => {
    cy.visit('/register')
    
    cy.get('a').contains('Sign in here').click()
    cy.url().should('include', '/login')
  })

  it('should redirect to convert page if already logged in', () => {
    cy.intercept('GET', '/api/v1/currencies', { fixture: 'currencies.json' }).as('getCurrencies')
    
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'test-token')
      win.localStorage.setItem('user', JSON.stringify({
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        full_name: 'Test User'
      }))
    })
    
    cy.visit('/register')
    
    cy.url().should('include', '/convert')
  })

  it('should show loading state during registration', () => {
    cy.intercept('POST', '/api/v1/register', (req) => {
      req.reply({ 
        statusCode: 200,
        body: { message: 'User registered successfully' },
        delay: 1000 
      })
    }).as('registerWithDelay')
    
    cy.visit('/register')
    
    cy.get('input[name="firstName"]').type('John')
    cy.get('input[name="lastName"]').type('Doe')
    cy.get('input[name="email"]').type('john@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('input[name="passwordConfirmation"]').type('password123')
    cy.get('button[type="submit"]').click()
    
    cy.get('button[type="submit"]').should('be.disabled')
    cy.get('button[type="submit"]').should('contain', 'Creating account...')
    
    cy.wait('@registerWithDelay')
    
    cy.get('button[type="submit"]').should('not.be.disabled')
    cy.get('button[type="submit"]').should('contain', 'Create Account')
  })
}) 