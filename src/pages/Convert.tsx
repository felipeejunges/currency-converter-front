import React, { useState, useEffect } from 'react';
import { currencyApi } from '../api/currency';
import { Currency, Conversion } from '../types';
import { Navbar } from '../components/Navbar';
import { ConversionForm } from '../components/ConversionForm';
import { ConversionResult } from '../components/ConversionResult';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt, faChartLine } from '@fortawesome/free-solid-svg-icons';

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

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar title="Currency Converter" showHistoryButton={true} />

      <div className="container mx-auto px-4 py-8">
        {/* Mobile Tabs */}
        <div className="lg:hidden tabs tabs-boxed bg-base-200 mb-4" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'convert'}
            aria-controls="convert-panel"
            className={`tab grow ${activeTab === 'convert' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('convert')}
          >
            <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
            Convert
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'result'}
            aria-controls="result-panel"
            className={`tab grow ${activeTab === 'result' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('result')}
          >
            <FontAwesomeIcon icon={faChartLine} className="mr-2" />
            Result
          </button>
        </div>

        {/* Mobile Content */}
        <div className="lg:hidden flex-1 min-h-0">
          <div
            role="tabpanel"
            id="convert-panel"
            aria-labelledby="convert-tab"
            hidden={activeTab !== 'convert'}
          >
            <ConversionForm
              currencies={currencies}
              isConverting={isConverting}
              error={error}
              success={success}
              formData={formData}
              onFormChange={handleFormChange}
              onSubmit={handleConvert}
              onErrorClose={() => setError('')}
              onSuccessClose={() => setSuccess('')}
            />
          </div>
          <div
            role="tabpanel"
            id="result-panel"
            aria-labelledby="result-tab"
            hidden={activeTab !== 'result'}
          >
            <ConversionResult
              conversionResult={conversionResult}
              currencies={currencies}
            />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8">
          <ConversionForm
            currencies={currencies}
            isConverting={isConverting}
            error={error}
            success={success}
            formData={formData}
            onFormChange={handleFormChange}
            onSubmit={handleConvert}
            onErrorClose={() => setError('')}
            onSuccessClose={() => setSuccess('')}
          />
          <ConversionResult
            conversionResult={conversionResult}
            currencies={currencies}
          />
        </div>
      </div>
    </div>
  );
}; 