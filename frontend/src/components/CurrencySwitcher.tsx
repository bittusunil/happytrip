'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { apiService } from '@/services/api';

const CURRENCIES = [
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
];

interface CurrencySwitcherProps {
  compact?: boolean;
}

export const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({
  compact = false,
}) => {
  const { user, updateUser } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentCurrency = CURRENCIES.find((curr) => curr.code === user?.currency) || CURRENCIES[0];

  const handleCurrencyChange = async (currencyCode: string) => {
    try {
      setLoading(true);
      await apiService.put(`/users/${user?.id}/preferences`, {
        currency: currencyCode,
      });

      // Update local storage
      localStorage.setItem('currency', currencyCode);

      // Update user store
      if (user) {
        updateUser({ ...user, currency: currencyCode });
      }

      setIsOpen(false);
    } catch (error) {
      console.error('Failed to change currency:', error);
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          disabled={loading}
        >
          <span className="text-sm font-medium">{currentCurrency.symbol}</span>
          <span className="text-sm font-medium">{currentCurrency.code}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto min-w-max">
            {CURRENCIES.map((curr) => (
              <button
                key={curr.code}
                onClick={() => handleCurrencyChange(curr.code)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                  curr.code === user?.currency ? 'bg-blue-50 text-blue-600' : ''
                }`}
                disabled={loading}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{curr.code}</span>
                  <span className="text-sm text-gray-600">{curr.name}</span>
                </div>
                {curr.code === user?.currency && (
                  <span className="text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Currency</label>
      <select
        value={user?.currency || 'EUR'}
        onChange={(e) => handleCurrencyChange(e.target.value)}
        disabled={loading}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {CURRENCIES.map((curr) => (
          <option key={curr.code} value={curr.code}>
            {curr.symbol} {curr.code} - {curr.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySwitcher;
