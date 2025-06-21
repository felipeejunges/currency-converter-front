// Format currency value with symbol
export const formatCurrency = (value: number | string, symbol: string): string => {
  if (value === undefined || value === null || value === '') {
    return `${symbol}0.00`;
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return `${symbol}0.00`;
  }
  
  return `${symbol}${numValue.toFixed(2)}`;
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format exchange rate
export const formatRate = (rate: number | string): string => {
  if (rate === undefined || rate === null || rate === '') {
    return '0.0000';
  }
  
  const numRate = typeof rate === 'string' ? parseFloat(rate) : rate;
  
  if (isNaN(numRate)) {
    return '0.0000';
  }
  
  return numRate.toFixed(4);
};

// Get currency symbol by code
export const getCurrencySymbol = (currencies: any[], code: string): string => {
  const currency = currencies.find(c => c.code === code);
  return currency?.symbol_native || currency?.symbol || code;
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  return { isValid: true, message: '' };
}; 