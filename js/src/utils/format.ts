export function formatAmount(value: number): string {
  if (!isFinite(value) || isNaN(value)) return "0";
  const maxDecimals = Math.abs(value) < 1 ? 8 : 4;
  return value.toFixed(maxDecimals).replace(/\.?0+$/, "");
}
