import React from 'react';
import { Currency, Conversion } from '../types';
import { formatCurrency, formatRate, getCurrencySymbol } from '../utils/formatters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

interface ConversionResultProps {
  conversionResult: Conversion | null;
  currencies: Currency[];
}

export const ConversionResult: React.FC<ConversionResultProps> = ({
  conversionResult,
  currencies
}) => {
  return (
    <div className="card bg-base-100 shadow-xl h-full">
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
              Fill out the form to convert currencies
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 