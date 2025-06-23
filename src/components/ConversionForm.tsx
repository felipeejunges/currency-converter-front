import React from 'react';
import { Currency } from '../types';
import { Alert } from './Alert';
import { LoadingSpinner } from './LoadingSpinner';

interface ConversionFormProps {
  currencies: Currency[];
  isConverting: boolean;
  error: string;
  success: string;
  formData: {
    fromCurrency: string;
    toCurrency: string;
    fromValue: string;
    forceRefresh: boolean;
  };
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onErrorClose: () => void;
  onSuccessClose: () => void;
}

export const ConversionForm: React.FC<ConversionFormProps> = ({
  currencies,
  isConverting,
  error,
  success,
  formData,
  onFormChange,
  onSubmit,
  onErrorClose,
  onSuccessClose
}) => {
  return (
    <div className="card bg-base-100 shadow-xl h-full">
      <div className="card-body">
        <h2 className="card-title text-xl mb-6">Convert Currency</h2>

        {error && (
          <Alert type="error" message={error} onClose={onErrorClose} />
        )}

        {success && (
          <Alert type="success" message={success} onClose={onSuccessClose} />
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">From Currency</span>
              </label>
              <select
                name="fromCurrency"
                className="select select-bordered"
                value={formData.fromCurrency}
                onChange={onFormChange}
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
                onChange={onFormChange}
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
              onChange={onFormChange}
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
                onChange={onFormChange}
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
}; 