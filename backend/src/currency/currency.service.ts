import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  timestamp: number;
}

@Injectable()
export class CurrencyService {
  private exchangeRates: Map<string, ExchangeRate> = new Map();
  private readonly BASE_CURRENCY = 'EUR';
  private readonly CACHE_DURATION = 3600000; // 1 hour in milliseconds

  constructor(private configService: ConfigService) {
    this.initializeExchangeRates();
  }

  private initializeExchangeRates() {
    // Mock exchange rates for EMEA currencies (relative to EUR)
    const rates = {
      'EUR/EUR': 1.0,
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

    Object.entries(rates).forEach(([pair, rate]) => {
      this.exchangeRates.set(pair, {
        from: pair.split('/')[0],
        to: pair.split('/')[1],
        rate: rate as number,
        timestamp: Date.now(),
      });
    });
  }

  /**
   * Convert amount from one currency to another
   */
  convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
  ): number {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const pairKey = `${fromCurrency}/${toCurrency}`;
    const reversePairKey = `${toCurrency}/${fromCurrency}`;

    // Try direct conversion
    if (this.exchangeRates.has(pairKey)) {
      const rate = this.exchangeRates.get(pairKey).rate;
      return parseFloat((amount * rate).toFixed(2));
    }

    // Try reverse conversion
    if (this.exchangeRates.has(reversePairKey)) {
      const rate = this.exchangeRates.get(reversePairKey).rate;
      return parseFloat((amount / rate).toFixed(2));
    }

    // Try conversion through EUR
    const toEurKey = `${toCurrency}/${this.BASE_CURRENCY}`;
    const fromEurKey = `${this.BASE_CURRENCY}/${fromCurrency}`;

    if (this.exchangeRates.has(fromEurKey) && this.exchangeRates.has(toEurKey)) {
      const fromRate = this.exchangeRates.get(fromEurKey).rate;
      const toRate = this.exchangeRates.get(toEurKey).rate;
      const amountInEur = amount / fromRate;
      return parseFloat((amountInEur * toRate).toFixed(2));
    }

    // Fallback: return original amount
    console.warn(
      `No exchange rate found for ${fromCurrency}/${toCurrency}`,
    );
    return amount;
  }

  /**
   * Get exchange rate between two currencies
   */
  getExchangeRate(fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) {
      return 1;
    }

    const pairKey = `${fromCurrency}/${toCurrency}`;
    const reversePairKey = `${toCurrency}/${fromCurrency}`;

    if (this.exchangeRates.has(pairKey)) {
      return this.exchangeRates.get(pairKey).rate;
    }

    if (this.exchangeRates.has(reversePairKey)) {
      return 1 / this.exchangeRates.get(reversePairKey).rate;
    }

    return 1;
  }

  /**
   * Get all supported currencies
   */
  getSupportedCurrencies(): string[] {
    const currencies = new Set<string>();
    this.exchangeRates.forEach((rate) => {
      currencies.add(rate.from);
      currencies.add(rate.to);
    });
    return Array.from(currencies).sort();
  }

  /**
   * Format price with currency symbol
   */
  formatPrice(amount: number, currency: string): string {
    const currencySymbols: Record<string, string> = {
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

    const symbol = currencySymbols[currency] || currency;
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return `${symbol} ${formatted}`;
  }

  /**
   * Get currency symbol
   */
  getCurrencySymbol(currency: string): string {
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

    return symbols[currency] || currency;
  }

  /**
   * Update exchange rates (would call external API in production)
   */
  async updateExchangeRates(): Promise<void> {
    // In production, this would call an external API like:
    // - Open Exchange Rates
    // - Fixer.io
    // - European Central Bank API

    // For now, we'll just update the timestamp
    this.exchangeRates.forEach((rate) => {
      rate.timestamp = Date.now();
    });

    console.log('Exchange rates updated');
  }

  /**
   * Check if rates are stale
   */
  isRatesStale(): boolean {
    const oldestRate = Array.from(this.exchangeRates.values()).reduce(
      (oldest, current) =>
        current.timestamp < oldest.timestamp ? current : oldest,
    );

    return Date.now() - oldestRate.timestamp > this.CACHE_DURATION;
  }
}
