# Cypress E2E Testing

This directory contains comprehensive end-to-end tests for the Currency Converter application using Cypress.

## Test Structure

### Fixtures
- `auth.json` - Authentication responses (login, register, logout)
- `currencies.json` - Currency listing responses
- `conversions.json` - Currency conversion and history responses

### Test Files
- `login.cy.ts` - Login page functionality and validation
- `register.cy.ts` - Registration page functionality and validation
- `convert.cy.ts` - Currency conversion functionality
- `conversions.cy.ts` - Conversion history page
- `navigation.cy.ts` - Routing and navigation behavior

### Support
- `commands.ts` - Custom Cypress commands for common operations

## Running Tests

### Prerequisites
1. Start the development server:
   ```bash
   npm start
   ```

2. The app should be running on `http://localhost:3001`

### Running Tests

#### Open Cypress Test Runner (Interactive)
```bash
npm run cypress:open
# or
npm run test:e2e:open
```

#### Run Tests Headlessly
```bash
npm run cypress:run
# or
npm run test:e2e
```

#### Run Specific Test File
```bash
npx cypress run --spec "cypress/e2e/login.cy.ts"
```

## Test Coverage

### Authentication
- Login form validation
- Registration form validation
- Authentication state management
- Protected route access
- Logout functionality

### Currency Conversion
- Form validation
- API integration
- Error handling
- Loading states
- Success scenarios

### Navigation
- Route protection
- Responsive design
- Browser navigation
- Authentication redirects

## API Mocking

All backend API requests are mocked using `cy.intercept()`:

- `POST /api/v1/login` - User authentication
- `POST /api/v1/register` - User registration
- `DELETE /api/v1/logout` - User logout
- `GET /api/v1/currencies` - Currency listing
- `POST /api/v1/currencies/conversions` - Currency conversion
- `GET /api/v1/currencies/conversions` - Conversion history

## Custom Commands

- `cy.login(email, password)` - Login with credentials
- `cy.logout()` - Logout user
- `cy.mockAuth()` - Mock authentication endpoints
- `cy.mockCurrencies()` - Mock currency endpoints
- `cy.mockConversions()` - Mock conversion endpoints
- `cy.mockConversionHistory()` - Mock history endpoints

## Configuration

The Cypress configuration is in `cypress.config.ts`:
- Base URL: `http://localhost:3001`
- Viewport: 1280x720
- Timeouts: 10 seconds
- Screenshots on failure enabled

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Mocking**: All API calls are mocked to ensure consistent test results
3. **Validation**: Tests cover both success and error scenarios
4. **Responsive**: Tests include mobile and desktop viewport testing
5. **Accessibility**: Tests verify proper form validation and error messages

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure the app is running on port 3001
2. **Timeout errors**: Increase timeout in `cypress.config.ts` if needed
3. **Selector issues**: Use data-cy attributes for reliable element selection
4. **Mock failures**: Verify fixture files exist and are properly formatted

### Debug Mode

Run tests with debug output:
```bash
DEBUG=cypress:* npm run cypress:run
```

### Video Recording

Videos are disabled by default. Enable in `cypress.config.ts`:
```typescript
video: true
``` 