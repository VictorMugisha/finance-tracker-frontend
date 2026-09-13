export function formatMoney(value: string): string {
  const amount = Number(value)
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
  return `${formatted} RWF`
}
