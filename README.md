# Currency Converter Frontend

A modern, responsive React application for currency conversion with real-time exchange rates, user authentication, and conversion history tracking.

## Backend Application
🌐 **[Currency Converter Backend](https://github.com/felipeejunges/currency-converter-back)**

## 📹 Video Demonstration

📹 **[Watch Demo Video](https://www.loom.com/share/3f97cd13bf5143e385ad0a8f48fa936a)**

## 🚀 Features

### 🔐 Authentication
- User registration and login with JWT authentication
- Protected routes and session management
- Secure logout functionality

### 💱 Currency Conversion
- Real-time currency conversion with live exchange rates
- Support for multiple currencies (USD, BRL, EUR, JPY, and more)
- Form validation and error handling
- Conversion result display with formatted values

### 📊 Conversion History
- Complete transaction history with pagination
- Detailed conversion records (amount, rate, timestamp)
- Responsive table design for all devices

### 🎨 User Interface
- Modern, responsive design with Tailwind CSS and DaisyUI
- Mobile-first approach with tab navigation on small screens
- Loading states and error handling
- Font Awesome icons for enhanced UX

### 🧪 Testing
- Comprehensive E2E testing with Cypress
- API mocking for consistent test results
- Automated testing pipeline with GitHub Actions

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API communication

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **Flowbite** - Additional UI components
- **Font Awesome** - Icon library

### Testing
- **Cypress** - End-to-end testing
- **React Testing Library** - Component testing
- **Jest** - Unit testing framework

### Development Tools
- **Create React App** - Development environment
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Rails Backend** running on port 3000

### Backend Setup

This frontend requires the Rails backend to be running. Please start the backend server first before running this frontend application.

The backend should be running on `http://localhost:3000` before starting the frontend.

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/felipeejunges/currency-converter-front.git
cd currency-converter-front
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm start
```

The application will start on `http://localhost:3001` (configured to avoid conflicts with the Rails backend on port 3000).

### 4. Open in Browser

Open [http://localhost:3001](http://localhost:3001) to view the application in your browser.

## 📱 Available Scripts

### Development
```bash
npm start          # Start development server on port 3001
npm test           # Run unit tests in watch mode
npm run build      # Build for production
```

### E2E Testing
```bash
npm run cypress:open    # Open Cypress test runner
npm run cypress:run     # Run tests headlessly
npm run test:e2e        # Run E2E tests
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3000/api/v1
REACT_APP_PORT=3001
```

### Port Configuration

The application is configured to run on port 3001 to avoid conflicts with the Rails backend. This is set in the `package.json` start script.

## 🧪 Testing

### Running Tests

1. **Unit Tests**: `npm test`
2. **E2E Tests**: `npm run cypress:open`
3. **All Tests**: `npm run test:e2e`

### Test Coverage

- **Login/Register**: Form validation, authentication flows
- **Currency Conversion**: API integration, error handling
- **History**: Data display, pagination, responsive design
- **Navigation**: Route protection, authentication redirects

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth)
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript interfaces
├── utils/              # Utility functions
└── App.tsx             # Main application component

cypress/
├── e2e/               # E2E test files
├── fixtures/          # Test data
├── support/           # Custom commands
└── README.md          # Testing documentation
```

## 🔌 API Integration

The frontend communicates with the Rails backend through these endpoints:

- `POST /api/v1/login` - User authentication
- `POST /api/v1/register` - User registration
- `DELETE /api/v1/logout` - User logout
- `GET /api/v1/currencies` - Currency listing
- `POST /api/v1/currencies/conversions` - Currency conversion
- `GET /api/v1/currencies/conversions` - Conversion history

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Tab navigation on small screens
- Desktop navigation on larger screens
- Optimized for all device sizes

### User Experience
- Loading states for all async operations
- Error messages with clear feedback
- Form validation with visual indicators
- Smooth transitions and animations

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Deployment Options

- **Netlify**: Drag and drop the `build/` folder
- **Vercel**: Connect your GitHub repository
- **AWS S3**: Upload the `build/` folder
- **Heroku**: Use the buildpack for Create React App

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy coding! 🚀**
