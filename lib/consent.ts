import projectConfig from '@/config/project.json'
import { LEGAL } from './legal-config'

export type ConsentCategory = 'necessary' | 'functional' | 'statistics' | 'marketing'

export type ConsentState = {
  necessary: true
  functional: boolean
  statistics: boolean
  marketing: boolean
  timestamp: string
  version: number
}

type TrackingConfig = {
  ga4: string
  hotjar: string
  metaPixel: string
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    hj?: ((...args: unknown[]) => void) & { q?: unknown[][] }
    _hjSettings?: { hjid: number; hjsv: number }
    fbq?: (...args: unknown[]) => void
    _fbqQueue?: unknown[][]
  }
}

const COOKIE_NAME = 'cookie_consent'
const CONSENT_EVENT = 'cookie-consent:changed'
const OPEN_EVENT = 'cookie-consent:open'
const MAX_AGE_SECONDS = LEGAL.consent.reConsentMonths * 31 * 24 * 60 * 60
const OPTIONAL_COOKIE_NAMES = [
  '_ga',
  '_gid',
  '_gat',
  '_fbp',
  '_fbc',
  '_hjSession',
  '_hjSessionUser',
]

export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  functional: false,
  statistics: false,
  marketing: false,
  timestamp: '',
  version: LEGAL.consent.version,
}

export function isConfigured(value?: string) {
  return Boolean(value && !value.includes('{{') && !value.includes('}}'))
}

export function getTrackingConfig(): TrackingConfig {
  return projectConfig.tracking
}

export function hasStatisticsServices() {
  const tracking = getTrackingConfig()
  return isConfigured(tracking.ga4) || isConfigured(tracking.hotjar)
}

export function hasMarketingServices() {
  return isConfigured(getTrackingConfig().metaPixel)
}

export function hasFunctionalServices() {
  return true
}

export function createConsentState(
  values: Partial<Omit<ConsentState, 'necessary' | 'timestamp' | 'version'>>,
): ConsentState {
  return {
    necessary: true,
    functional: Boolean(values.functional),
    statistics: Boolean(values.statistics && hasStatisticsServices()),
    marketing: Boolean(values.marketing && hasMarketingServices()),
    timestamp: new Date().toISOString(),
    version: LEGAL.consent.version,
  }
}

export function readConsent(): ConsentState | null {
  if (typeof document === 'undefined') return null

  const raw =
    document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith(`${COOKIE_NAME}=`))
      ?.split('=')
      .slice(1)
      .join('=') || null

  if (!raw) return null

  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as ConsentState
    if (parsed.version !== LEGAL.consent.version || !parsed.timestamp) return null

    const createdAt = new Date(parsed.timestamp).getTime()
    if (!Number.isFinite(createdAt)) return null

    const ageMs = Date.now() - createdAt
    if (ageMs > MAX_AGE_SECONDS * 1000) return null

    return {
      necessary: true,
      functional: Boolean(parsed.functional),
      statistics: Boolean(parsed.statistics && hasStatisticsServices()),
      marketing: Boolean(parsed.marketing && hasMarketingServices()),
      timestamp: parsed.timestamp,
      version: LEGAL.consent.version,
    }
  } catch {
    return null
  }
}

export function saveConsent(consent: ConsentState) {
  if (typeof document === 'undefined') return

  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(consent))}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`
  applyConsent(consent)
  window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_EVENT, { detail: consent }))
}

export function getCurrentConsent() {
  return readConsent() || DEFAULT_CONSENT
}

export function subscribeConsent(callback: (consent: ConsentState) => void) {
  if (typeof window === 'undefined') return () => {}

  const listener = (event: Event) => {
    callback((event as CustomEvent<ConsentState>).detail)
  }
  window.addEventListener(CONSENT_EVENT, listener)
  return () => window.removeEventListener(CONSENT_EVENT, listener)
}

export function openConsentSettings() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(OPEN_EVENT))
}

export function onOpenConsentSettings(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(OPEN_EVENT, callback)
  return () => window.removeEventListener(OPEN_EVENT, callback)
}

export function applyConsent(consent: ConsentState) {
  if (typeof window === 'undefined') return

  if (consent.statistics) {
    ensureGoogleAnalytics()
    ensureHotjar()
  } else {
    window.gtag?.('consent', 'update', {
      analytics_storage: 'denied',
    })
  }

  if (consent.marketing) {
    ensureMetaPixel()
  } else {
    window.fbq?.('consent', 'revoke')
  }

  if (!consent.statistics && !consent.marketing) {
    clearOptionalCookies()
  }
}

function ensureGoogleAnalytics() {
  const ga4Id = getTrackingConfig().ga4
  if (!isConfigured(ga4Id) || document.querySelector('script[data-cookie-tool="ga4"]')) return

  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args)
    }

  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`
  script.dataset.cookieTool = 'ga4'
  document.head.appendChild(script)

  window.gtag('js', new Date())
  window.gtag('config', ga4Id, { anonymize_ip: true })
  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
  })
}

function ensureHotjar() {
  const hotjarId = getTrackingConfig().hotjar
  if (!isConfigured(hotjarId) || document.querySelector('script[data-cookie-tool="hotjar"]')) return

  const id = Number(hotjarId)
  if (!Number.isFinite(id)) return

  window.hj =
    window.hj ||
    function hj(...args: unknown[]) {
      window.hj!.q = window.hj!.q || []
      window.hj!.q.push(args)
    }
  window._hjSettings = { hjid: id, hjsv: 6 }

  const script = document.createElement('script')
  script.async = true
  script.src = `https://static.hotjar.com/c/hotjar-${id}.js?sv=6`
  script.dataset.cookieTool = 'hotjar'
  document.head.appendChild(script)
}

function ensureMetaPixel() {
  const pixelId = getTrackingConfig().metaPixel
  if (!isConfigured(pixelId) || document.querySelector('script[data-cookie-tool="meta-pixel"]')) return

  window.fbq =
    window.fbq ||
    function fbq(...args: unknown[]) {
      window._fbqQueue = window._fbqQueue || []
      window._fbqQueue.push(args)
    }

  window.fbq('consent', 'grant')
  window.fbq('init', pixelId)
  window.fbq('track', 'PageView')

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  script.dataset.cookieTool = 'meta-pixel'
  document.head.appendChild(script)
}

function clearOptionalCookies() {
  const hostParts = window.location.hostname.split('.')
  const domains = [
    window.location.hostname,
    hostParts.length > 1 ? `.${hostParts.slice(-2).join('.')}` : window.location.hostname,
  ]

  OPTIONAL_COOKIE_NAMES.forEach((name) => {
    document.cookie
      .split('; ')
      .filter((cookie) => cookie.startsWith(name))
      .forEach((cookie) => {
        const cookieName = cookie.split('=')[0]
        domains.forEach((domain) => {
          document.cookie = `${cookieName}=; Max-Age=0; Path=/; Domain=${domain}`
        })
        document.cookie = `${cookieName}=; Max-Age=0; Path=/`
      })
  })
}
