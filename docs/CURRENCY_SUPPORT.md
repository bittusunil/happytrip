# Currency Support Documentation

## Overview

HappyTrip now supports 13 global currencies including EMEA, Middle East, and Asia-Pacific regions. Users can select their preferred currency for all pricing and transactions.

## Supported Currencies

### European Currencies (9)

| Code | Name | Symbol | Region |
|------|------|--------|--------|
| EUR | Euro | € | Eurozone |
| GBP | British Pound | £ | United Kingdom |
| CHF | Swiss Franc | CHF | Switzerland |
| SEK | Swedish Krona | kr | Sweden |
| NOK | Norwegian Krone | kr | Norway |
| DKK | Danish Krone | kr | Denmark |
| CZK | Czech Koruna | Kč | Czech Republic |
| PLN | Polish Zloty | zł | Poland |
| HUF | Hungarian Forint | Ft | Hungary |
| RON | Romanian Leu | lei | Romania |

### Global Currencies (3)

| Code | Name | Symbol | Region |
|------|------|--------|--------|
| USD | US Dollar | $ | United States |
| SAR | Saudi Riyal | ر.س | Saudi Arabia |
| INR | Indian Rupee | ₹ | India |

## Exchange Rates

### Base Currency: EUR (Euro)

All exchange rates are calculated relative to EUR (Euro) as the base currency.

**Current Exchange Rates (EUR = 1.0):**

```
EUR/GBP: 0.86
EUR/USD: 1.1
EUR/CHF: 0.95
EUR/SEK: 11.5
EUR/NOK: 11.2
EUR/DKK: 7.44
EUR/CZK: 24.5
EUR/PLN: 4.3
EUR/HUF: 360
EUR/RON: 4.97
EUR/SAR: 4.15
EUR/INR: 92.5
```

**Example Conversions:**

| Amount | From | To | Result |
|--------|------|----|----|
| 100 | EUR | GBP | 86 |
| 100 | EUR | USD | 110 |
| 100 | EUR | SAR | 415 |
| 100 | EUR | INR | 9,250 |
| 100 | GBP | EUR | 116.28 |
| 100 | USD | EUR | 90.91 |

## Backend Implementation

### Currency Service

**File:** `backend/src/currency/currency.service.ts`

**Key Methods:**

```typescript
// Convert currency
convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number

// Get exchange rate
getExchangeRate(fromCurrency: string, toCurrency: string): number

// Format price with symbol
formatPrice(amount: number, currency: string): string

// Get currency symbol
getCurrencySymbol(currency: string): string

// Get all supported currencies
getSupportedCurrencies(): string[]

// Update exchange rates
updateExchangeRates(): Promise<void>
```

### API Endpoints

#### Convert Currency

```
GET /currency/convert?amount=100&from=EUR&to=GBP
```

**Response:**
```json
{
  "original": {
    "amount": 100,
    "currency": "EUR"
  },
  "converted": {
    "amount": 86,
    "currency": "GBP"
  },
  "rate": 0.86
}
```

#### Get Exchange Rates

```
GET /currency/rates
```

**Response:**
```json
{
  "base": "EUR",
  "rates": {
    "EUR/GBP": 0.86,
    "EUR/USD": 1.1,
    "EUR/CHF": 0.95,
    "EUR/SEK": 11.5,
    "EUR/NOK": 11.2,
    "EUR/DKK": 7.44,
    "EUR/CZK": 24.5,
    "EUR/PLN": 4.3,
    "EUR/HUF": 360,
    "EUR/RON": 4.97,
    "EUR/SAR": 4.15,
    "EUR/INR": 92.5
  },
  "timestamp": 1705334400000
}
```

#### Get Supported Currencies

```
GET /currency/supported
```

**Response:**
```json
{
  "currencies": [
    "CHF",
    "CZK",
    "DKK",
    "EUR",
    "GBP",
    "HUF",
    "INR",
    "NOK",
    "PLN",
    "RON",
    "SAR",
    "SEK",
    "USD"
  ]
}
```

## Frontend Implementation

### useCurrency Hook

**File:** `frontend/src/hooks/useCurrency.ts`

**Usage:**

```typescript
import { useCurrency } from '@/hooks/useCurrency';

function MyComponent() {
  const { 
    currency, 
    convertCurrency, 
    formatPrice, 
    getCurrencySymbol,
    getSupportedCurrencies
  } = useCurrency();

  // Get current user currency
  console.log(currency); // 'EUR'

  // Format price
  const formatted = formatPrice(100, 'EUR'); // '€ 100.00'

  // Get currency symbol
  const symbol = getCurrencySymbol('GBP'); // '£'

  // Convert currency
  const gbpAmount = await convertCurrency(100, 'EUR', 'GBP'); // 86

  // Get all supported currencies
  const currencies = getSupportedCurrencies(); // ['EUR', 'GBP', 'USD', ...]
}
```

### CurrencySwitcher Component

**File:** `frontend/src/components/CurrencySwitcher.tsx`

**Usage:**

```tsx
import CurrencySwitcher from '@/components/CurrencySwitcher';

// Compact mode (in header)
<CurrencySwitcher compact={true} />

// Full mode (in settings page)
<CurrencySwitcher compact={false} />
```

**Features:**
- Dropdown with all 13 currencies
- Currency codes and names
- Automatic preference saving
- API integration for persistence
- Compact and full-size modes

## User Preferences

### Storage

Currency preference is stored in multiple locations:

1. **User Database** - Primary storage in PostgreSQL
2. **Local Storage** - Browser cache for quick access
3. **Session** - Current session preference

### Priority

When determining user's currency:

1. User preference (if logged in)
2. Local storage (if saved)
3. Default: EUR (Euro)

### API Integration

**Update Currency Preference:**

```
PUT /users/:id/preferences
Content-Type: application/json

{
  "currency": "GBP"
}
```

**Response:**
```json
{
  "currency": "GBP"
}
```

## Price Display

### Format Examples

| Amount | Currency | Display |
|--------|----------|---------|
| 100 | EUR | € 100.00 |
| 100 | GBP | £ 100.00 |
| 100 | USD | $ 100.00 |
| 100 | SAR | ر.س 100.00 |
| 100 | INR | ₹ 100.00 |

### Decimal Handling

- All prices display with 2 decimal places
- Rounding: Standard banker's rounding
- Thousands separator: Automatic based on locale

## Real-Time Updates

### Exchange Rate Updates

**Current Implementation:**
- Mock exchange rates (static)
- Updated on service initialization

**Production Implementation:**
- Integrate with external API (e.g., Open Exchange Rates, Fixer.io)
- Update rates daily or hourly
- Cache rates for 1 hour
- Fallback to cached rates if API unavailable

**Update Method:**

```typescript
// Call periodically (e.g., every hour)
await currencyService.updateExchangeRates();

// Check if rates are stale
if (currencyService.isRatesStale()) {
  await currencyService.updateExchangeRates();
}
```

## Integration Points

### Flight Search

All flight prices are displayed in user's preferred currency:

```typescript
// Backend
const priceInUserCurrency = await currencyService.convertCurrency(
  flightPrice,
  'EUR',
  userCurrency
);

// Frontend
const formatted = formatPrice(priceInUserCurrency, userCurrency);
```

### Accommodation Search

All accommodation prices are displayed in user's preferred currency:

```typescript
// Backend
const priceInUserCurrency = await currencyService.convertCurrency(
  accommodationPrice,
  'EUR',
  userCurrency
);

// Frontend
const formatted = formatPrice(priceInUserCurrency, userCurrency);
```

### Booking Confirmation

Booking totals displayed in currency at time of booking:

```typescript
// Store booking currency
booking.currency = userCurrency;
booking.totalPrice = convertedPrice;
```

## Testing

### Unit Tests

```typescript
// Test conversion
const result = currencyService.convertCurrency(100, 'EUR', 'GBP');
expect(result).toBe(86);

// Test formatting
const formatted = currencyService.formatPrice(100, 'EUR');
expect(formatted).toBe('€ 100.00');

// Test symbol
const symbol = currencyService.getCurrencySymbol('GBP');
expect(symbol).toBe('£');
```

### Integration Tests

```typescript
// Test API endpoint
const response = await request(app.getHttpServer())
  .get('/currency/convert')
  .query({ amount: 100, from: 'EUR', to: 'GBP' });

expect(response.status).toBe(200);
expect(response.body.converted.amount).toBe(86);
```

### Manual Testing

1. Login to application
2. Navigate to profile settings
3. Select different currency
4. Verify currency preference saved
5. Navigate to flights/accommodations
6. Verify prices displayed in selected currency
7. Logout and login again
8. Verify currency preference persisted

## Performance Optimization

### Caching

- Exchange rates cached for 1 hour
- Conversion results cached in browser
- Lazy load currency data

### API Optimization

- Batch currency conversions
- Minimize API calls
- Use CDN for currency data

## Error Handling

### Invalid Currency

```typescript
// Fallback to EUR if invalid
if (!supportedCurrencies.includes(currency)) {
  currency = 'EUR';
}
```

### API Failures

```typescript
// Use fallback rates if API unavailable
try {
  rates = await fetchRatesFromAPI();
} catch (error) {
  rates = getFallbackRates();
}
```

### Conversion Errors

```typescript
// Return original amount if conversion fails
try {
  converted = convertCurrency(amount, from, to);
} catch (error) {
  converted = amount;
}
```

## Future Enhancements

- [ ] Real-time exchange rates
- [ ] Historical exchange rates
- [ ] Currency conversion calculator
- [ ] Multi-currency wallet
- [ ] Cryptocurrency support
- [ ] Dynamic pricing based on currency
- [ ] Regional pricing strategies
- [ ] Tax calculation by currency

## References

- [Open Exchange Rates API](https://openexchangerates.org/)
- [Fixer.io API](https://fixer.io/)
- [European Central Bank](https://www.ecb.europa.eu/)
- [ISO 4217 Currency Codes](https://www.iso.org/iso-4217-currency-codes.html)

---

**Last Updated:** January 2024
**Total Currencies Supported:** 13
**Base Currency:** EUR (Euro)
