// Currency Converter Utility for A9 Global
// ============================================

const baseRates = {
  USD: 1,
  MMK: 2100,
  SGD: 1.35,
  THB: 35,
  EUR: 0.92,
};

/**
 * Convert an amount from one currency to another.
 * @param {number} amount - The amount to convert
 * @param {string} from - Source currency code (e.g. "USD")
 * @param {string} to - Target currency code (e.g. "MMK")
 * @returns {number} Converted amount
 */
function convertCurrency(amount, from, to) {
  if (from === to) return amount;
  if (!baseRates[from] || !baseRates[to]) {
    throw new Error(`Unsupported currency: ${!baseRates[from] ? from : to}`);
  }
  const amountInUSD = amount / baseRates[from];
  return Math.round(amountInUSD * baseRates[to] * 100) / 100;
}

/**
 * Format a price with the appropriate currency symbol.
 * @param {number} amount - The price amount
 * @param {string} currency - Currency code ("MMK", "USD", "SGD", "THB", "EUR")
 * @returns {string} Formatted price string (e.g. "MMK 210,000" or "$100.00")
 */
function formatPrice(amount, currency) {
  const symbols = {
    USD: '$',
    MMK: 'MMK ',
    SGD: 'SGD ',
    THB: '฿',
    EUR: '€',
  };

  const symbol = symbols[currency] || currency + ' ';

  if (currency === 'MMK') {
    return symbol + amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  return symbol + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

module.exports = {
  baseRates,
  convertCurrency,
  formatPrice,
};
