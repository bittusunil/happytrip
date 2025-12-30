import { useCallback, useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { apiService } from '@/services/api';

interface ExchangeRates {
  [key: string]: number;
}

export const useCurrency = () => {
  const { user } = useAuthStore();
  const currency = user?.currency || 'EUR';
  const [rates, setRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(false);

  // Fetch exchange rates on mount
  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/currency/rates');
      setRates(response.data.rates);
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      // Use fallback rates
      setRates(getFallbackRates());
    } finally {
      setLoading(false);
    }
  }, []);

  const convertCurrency = useCallback(
    async (
      amount: number,
      fromCurrency: string,
      toCurrency: string,
    ): Promise<number> => {
      if (fromCurrency === toCurrency) {
        return amount;
      }

      try {
        const response = await apiService.get('/currency/convert', {
          params: {
            amount,
            from: fromCurrency,
            to: toCurrency,
          },
        });
        return response.data.converted.amount;
      } catch (error) {
        console.error('Failed to convert currency:', error);
        return amount;
      }
    },
    [],
  );

  const formatPrice = useCallback(
    (amount: number, currencyCode?: string): string => {
      const curr = currencyCode || currency;
      const symbols: Record<string, string> = {
        EUR: '€',
        GBP: '£',
        USD: '$',
        CHF: 'CHF',
        SEK: 'kr',
        NOK: 'kr',
        DKK: 'kr',
        CZK: 'Kč',
        PLN: 'zł',
        HUF: 'Ft',
        RON: 'lei',
      };

      const symbol = symbols[curr] || curr;
      const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);

      return `${symbol} ${formatted}`;
    },
    [currency],
  );

  const getCurrencySymbol = useCallback((curr?: string): string => {
    const c = curr || currency;
    const symbols: Record<string, string> = {
      EUR: '€',
      GBP: '£',
      USD: '$',
      CHF: 'CHF',
      SEK: 'kr',
      NOK: 'kr',
      DKK: 'kr',
      CZK: 'Kč',
      PLN: 'zł',
      HUF: 'Ft',
      RON: 'lei',
    };
    return symbols[c] || c;
  }, [currency]);

  const getSupportedCurrencies = useCallback((): string[] => {
    return ['EUR', 'GBP', 'USD', 'CHF', 'SEK', 'NOK', 'DKK', 'CZK', 'PLN', 'HUF', 'RON'];
  }, []);

  const getFallbackRates = (): ExchangeRates => {
    return {
      'EUR/GBP': 0.86,
      'EUR/USD': 1.1,
      'EUR/CHF': 0.95,
      'EUR/SEK': 11.5,
      'EUR/NOK': 11.2,
      'EUR/DKK': 7.44,
      'EUR/CZK': 24.5,
      'EUR/PLN': 4.3,
      'EUR/HUF': 360,
      'EUR/RON': 4.97,
    };
  };

  return {
    currency,
    rates,
    loading,
    convertCurrency,
    formatPrice,
    getCurrencySymbol,
    getSupportedCurrencies,
    fetchExchangeRates,
  };
};
