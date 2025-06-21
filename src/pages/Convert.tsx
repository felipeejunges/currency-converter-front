import React, { useState, useEffect } from 'react';
import { currencyApi } from '../api/currency';
import { Currency, Conversion } from '../types';
import { Alert } from '../components/Alert';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Navbar } from '../components/Navbar';
import { formatCurrency, formatRate, getCurrencySymbol } from '../utils/formatters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

export const Convert: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'convert' | 'result'>('convert');

  const [formData, setFormData] = useState({
    fromCurrency: '',
    toCurrency: '',
    fromValue: '',
    forceRefresh: false
  });

  const [conversionResult, setConversionResult] = useState<Conversion | null>(null);

  useEffect(() => {
    loadCurrencies();
  }, []);

  const loadCurrencies = async () => {
    try {
      const response = await currencyApi.getCurrencies();
      setCurrencies(response.currencies);
      
      if (response.currencies.length >= 2) {
        setFormData(prev => ({
          ...prev,
          fromCurrency: response.currencies[0].code,
          toCurrency: response.currencies[1].code
        }));
      }
    } catch (err: any) {
      setError('Failed to load currencies');
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setConversionResult(null);

    if (!formData.fromCurrency || !formData.toCurrency || !formData.fromValue) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.fromCurrency === formData.toCurrency) {
      setError('Please select different currencies for conversion');
      return;
    }

    const amount = parseFloat(formData.fromValue);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsConverting(true);

    try {
      const result = await currencyApi.convertCurrency({
        from_currency: formData.fromCurrency,
        to_currency: formData.toCurrency,
        from_value: amount,
        force_refresh: formData.forceRefresh
      });

      setConversionResult(result);
      setSuccess('Currency converted successfully!');
      setFormData(prev => ({ ...prev, fromValue: '' }));
      
      if (window.innerWidth < 1024) {
        setActiveTab('result');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Conversion failed. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const swapCurrencies = () => {
    setFormData(prev => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency
    }));
  };

  const ConversionForm = () => (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-xl mb-6">Convert Currency</h2>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}

        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess('')}
          />
        )}

        <form onSubmit={handleConvert} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">From Currency</span>
              </label>
              <select
                name="fromCurrency"
                className="select select-bordered"
                value={formData.fromCurrency}
                onChange={handleFormChange}
                disabled={isConverting}
              >
                <option value="">Select currency</option>
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">To Currency</span>
              </label>
              <select
                name="toCurrency"
                className="select select-bordered"
                value={formData.toCurrency}
                onChange={handleFormChange}
                disabled={isConverting}
              >
                <option value="">Select currency</option>
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={swapCurrencies}
              className="btn btn-circle btn-sm"
              disabled={isConverting}
            >
              ⇄
            </button>
            <span className="text-sm opacity-70">Swap currencies</span>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Amount</span>
            </label>
            <input
              type="number"
              name="fromValue"
              placeholder="Enter amount"
              className="input input-bordered"
              value={formData.fromValue}
              onChange={handleFormChange}
              disabled={isConverting}
              step="0.01"
            />
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Force Refresh Rate</span>
              <input
                type="checkbox"
                name="forceRefresh"
                className="checkbox"
                checked={formData.forceRefresh}
                onChange={handleFormChange}
                disabled={isConverting}
              />
            </label>
          </div>

          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isConverting}
            >
              {isConverting ? (
                <>
                  <LoadingSpinner size="sm" />
                  Converting...
                </>
              ) : (
                'Convert'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const ConversionResult = () => (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-xl mb-6">Conversion Result</h2>

        {conversionResult ? (
          <div className="space-y-6">
            <div className="p-6 bg-success/10 border border-success/20 rounded-lg">
              <h3 className="font-semibold text-success mb-4 text-lg">Result</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">From:</span>
                  <span className="font-medium text-lg">
                    {formatCurrency(conversionResult.from_value, getCurrencySymbol(currencies, conversionResult.from_currency))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">To:</span>
                  <span className="font-medium text-lg text-success">
                    {formatCurrency(conversionResult.to_value, getCurrencySymbol(currencies, conversionResult.to_currency))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Rate:</span>
                  <span className="font-medium">{formatRate(conversionResult.rate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Transaction ID:</span>
                  <span className="font-medium">#{conversionResult.transaction_id}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-20">
              <FontAwesomeIcon icon={faExchangeAlt} />
            </div>
            <h3 className="text-lg font-medium mb-2">Ready to Convert</h3>
            <p className="text-base-content/70">
              Fill out the form on the left to convert currencies
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <Navbar 
        title="Currency Converter" 
        showHistoryButton={true}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Mobile/Tablet: Tabs */}
        <div className="lg:hidden">
          <div className="tabs tabs-boxed mb-6">
            <button
              className={`tab ${activeTab === 'convert' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('convert')}
            >
              Convert Currency
            </button>
            <button
              className={`tab ${activeTab === 'result' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('result')}
            >
              Result
            </button>
          </div>

          {activeTab === 'convert' && <ConversionForm />}
          {activeTab === 'result' && <ConversionResult />}
        </div>

        {/* Desktop: Two Column Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8">
          <ConversionForm />
          <ConversionResult />
        </div>
      </div>
    </div>
  );
}; 