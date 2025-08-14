export const formatCurrency = (amount: number, symbol: string = '₹') => {
  if (amount >= 10000000) {
    return `${symbol}${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `${symbol}${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(1)}K`;
  }
  return `${symbol}${amount.toLocaleString()}`;
};

export const formatPercentage = (value: number) => `${value.toFixed(2)}%`;
