export function formatCurrency(priceCents) {
  if (typeof priceCents !== 'number' || isNaN(priceCents)) {
    return '0.00';
  }
  return (Math.round(priceCents) / 100).toFixed(2);
}
