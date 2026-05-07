const eurFormatter = new Intl.NumberFormat('de-AT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const m2Formatter = new Intl.NumberFormat('de-AT', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatEUR(value: number | null | undefined): string {
  if (value === null || value === undefined) return ''
  return `${eurFormatter.format(value)},–`
}

export function formatM2(value: number | null | undefined): string {
  if (value === null || value === undefined) return ''
  return `${m2Formatter.format(value)} m²`
}
