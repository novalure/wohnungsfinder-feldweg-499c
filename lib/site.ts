export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vallis-achen.at'
).replace(/\/$/, '')

export const SOCIAL_IMAGE_PATH = '/img/social-preview-rendering.jpg'

export const absUrl = (path = '/') => new URL(path, SITE_URL).toString()
