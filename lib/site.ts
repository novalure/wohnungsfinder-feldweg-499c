export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohnungsfinder-feldweg-499c.vercel.app'
).replace(/\/$/, '')

export const absUrl = (path = '/') => new URL(path, SITE_URL).toString()
