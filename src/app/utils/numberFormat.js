// Utility functions for number formatting

/**
 * Formats a number to display with proper decimal places
 * @param {number} value - The number to format
 * @param {number} maxDecimals - Maximum decimal places to show (default: 2)
 * @param {number} minDecimals - Minimum decimal places to show (default: 2)
 * @returns {string} Formatted number string
 */
export const formatBalance = (value, maxDecimals = 2, minDecimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00';
  }
  
  const num = Number(value);
  
  // Convert to string with fixed decimals
  const formatted = num.toFixed(maxDecimals);
  
  // Remove trailing zeros beyond minDecimals
  const parts = formatted.split('.');
  if (parts.length === 2) {
    const decimalPart = parts[1];
    let significantDecimals = '';
    
    // Find the last non-zero digit
    for (let i = decimalPart.length - 1; i >= 0; i--) {
      if (decimalPart[i] !== '0') {
        significantDecimals = decimalPart.substring(0, i + 1);
        break;
      }
    }
    
    // Ensure minimum decimal places
    if (significantDecimals.length < minDecimals) {
      significantDecimals = significantDecimals.padEnd(minDecimals, '0');
    }
    
    return `${parts[0]}.${significantDecimals}`;
  }
  
  return formatted;
};

/**
 * Formats a number for display with USDT currency
 * @param {number} value - The number to format
 * @returns {string} Formatted number with USDT
 */
export const formatUSDT = (value) => {
  return `${formatBalance(value)} USDT`;
};

/**
 * Formats a range of numbers (for daily income display)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {string} Formatted range
 */
export const formatRange = (min, max) => {
  if (!min || !max || isNaN(min) || isNaN(max)) {
    return '-';
  }
  return `${formatBalance(min)} - ${formatBalance(max)} USDT`;
}; 