export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    name: string; // full_name
  };
  token: string;
}

export interface RegisterResponse {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
  };
  message: string;
}

export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  symbol_native: string;
}

export interface Conversion {
  transaction_id: number;
  user_id: number;
  from_currency: string;
  to_currency: string;
  from_value: string | number;
  to_value: string | number;
  rate: string | number;
  timestamp: string;
}

export interface ConversionHistory {
  conversions: Conversion[];
  pagination: {
    page: number;
    count: number;
    limit: number;
    pages: number;
  };
}

export interface ConversionRequest {
  from_currency: string;
  to_currency: string;
  from_value: number;
  force_refresh?: boolean;
}

export interface LoginRequest {
  user: {
    email: string;
    password: string;
  };
}

export interface RegisterRequest {
  user: {
    email: string;
    password: string;
    password_confirmation: string;
    first_name: string;
    last_name: string;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
} 