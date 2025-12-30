import { Controller, Get, Query } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('currency')
export class CurrencyController {
  constructor(private currencyService: CurrencyService) {}

  @Get('convert')
  convertCurrency(
    @Query('amount') amount: number,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const converted = this.currencyService.convertCurrency(amount, from, to);
    return {
      original: {
        amount,
        currency: from,
      },
      converted: {
        amount: converted,
        currency: to,
      },
      rate: this.currencyService.getExchangeRate(from, to),
    };
  }

  @Get('supported')
  getSupportedCurrencies() {
    return {
      currencies: this.currencyService.getSupportedCurrencies(),
    };
  }

  @Get('rates')
  getExchangeRates() {
    const currencies = this.currencyService.getSupportedCurrencies();
    const rates: Record<string, number> = {};

    currencies.forEach((currency) => {
      if (currency !== 'EUR') {
        rates[`EUR/${currency}`] = this.currencyService.getExchangeRate(
          'EUR',
          currency,
        );
      }
    });

    return {
      base: 'EUR',
      rates,
      timestamp: Date.now(),
    };
  }
}
