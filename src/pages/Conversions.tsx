import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { currencyApi } from '../api/currency';
import { Currency, Conversion } from '../types';
import { Alert } from '../components/Alert';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Navbar } from '../components/Navbar';
import { formatCurrency, formatDate, formatRate, getCurrencySymbol } from '../utils/formatters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';

export const Conversions: React.FC = () => {
  const { user, logout } = useAuth();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [conversionHistory, setConversionHistory] = useState<Conversion[]>([]);
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCurrencies();
    loadConversionHistory();
  }, []);

  const loadCurrencies = async () => {
    try {
      const response = await currencyApi.getCurrencies();
      setCurrencies(response.currencies);
    } catch (err: any) {
      setError('Failed to load currencies');
    }
  };

  const loadConversionHistory = async (newPage?: number) => {
    setIsLoading(true);
    try {
      const response = await currencyApi.getConversionHistory(newPage || page);
      setConversionHistory(response.conversions);
      setMaxPage(response.pagination.pages);
    } catch (err: any) {
      setError('Failed to load conversion history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar 
        title="Conversion History" 
        showConvertButton={true}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Your Conversions</h2>
            <p className="text-base-content/70">Track all your currency conversion history</p>
          </div>

          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError('')}
            />
          )}

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : conversionHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-20">
                    <FontAwesomeIcon icon={faChartBar} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Conversions Yet</h3>
                  <p className="text-base-content/70 mb-6">
                    Start converting currencies to see your history here
                  </p>
                  <a href="/convert" className="btn btn-primary">
                    Convert Currency
                  </a>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {conversionHistory.map((conversion) => (
                      <div key={conversion.transaction_id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl font-bold text-primary">
                              {conversion.from_currency} → {conversion.to_currency}
                            </div>
                            <div className="badge badge-outline">
                              #{conversion.transaction_id}
                            </div>
                          </div>
                          <div className="text-sm text-base-content/70">
                            {formatDate(conversion.timestamp)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-base-200 rounded-lg">
                            <div className="text-sm text-base-content/70 mb-1">Amount</div>
                            <div className="text-lg font-semibold">
                              {formatCurrency(conversion.from_value, getCurrencySymbol(currencies, conversion.from_currency))}
                            </div>
                          </div>
                          
                          <div className="text-center p-4 bg-success/10 rounded-lg">
                            <div className="text-sm text-base-content/70 mb-1">Converted</div>
                            <div className="text-lg font-semibold text-success">
                              {formatCurrency(conversion.to_value, getCurrencySymbol(currencies, conversion.to_currency))}
                            </div>
                          </div>
                          
                          <div className="text-center p-4 bg-info/10 rounded-lg">
                            <div className="text-sm text-base-content/70 mb-1">Rate</div>
                            <div className="text-lg font-semibold text-info">
                              {formatRate(conversion.rate)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {maxPage > 1 && (
                    <div className="bg-base-100 py-6 border-t mt-6">
                      <div className="flex justify-center">
                        <div className="join">
                          <button 
                            className="join-item btn btn-sm lg:btn-md" 
                            onClick={() => {
                              if (page > 1) {
                                const newPage = page - 1;
                                loadConversionHistory(newPage);
                                setPage(newPage);
                              }
                            }}
                            disabled={page <= 1}
                          >
                            «
                          </button>
                          <button className="join-item btn btn-sm lg:btn-md">Page {page}</button>
                          <button 
                            className="join-item btn btn-sm lg:btn-md" 
                            onClick={() => {
                              if (page < maxPage) {
                                const newPage = page + 1;
                                loadConversionHistory(newPage);
                                setPage(newPage);
                              }
                            }}
                            disabled={page >= maxPage}
                          >
                            »
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 