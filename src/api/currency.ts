import api from './axios';
import { Currency, Conversion, ConversionHistory, ConversionRequest } from '../types';

export const currencyApi = {
  getCurrencies: async (): Promise<{ currencies: Currency[] }> => {
    const response = await api.get('/api/v1/currencies');
    return response.data;
  },

  convertCurrency: async (conversionData: ConversionRequest): Promise<Conversion> => {
    const response = await api.post('/api/v1/currencies/conversions', conversionData);
    return response.data;
  },

  getConversionHistory: async (page: number = 1, limit: number = 10): Promise<ConversionHistory> => {
    const response = await api.get(`/api/v1/currencies/conversions`, {
      params: {
        page: {
          limit,
          page
        }
      }
    });
    return response.data;
  },
}; 