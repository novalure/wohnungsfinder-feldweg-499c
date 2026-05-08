'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import projectConfig from '@/config/project.json'
import { Button } from './ui/Button'

type ConsentSettings = {
  necessary: true
  statistics: boolean
  marketing: boolean
}

type StoredConsent = ConsentSettings & {
  version: 1
  createdAt: string
}

const COOKIE_NAME = 'cookie_consent'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 180
const defaultSettings: ConsentSettings = {
  necessary: true,
  statistics: false,
  marketing: false,
}

function isConfigured(value?: string) {
  return Boolean(value && !value.includes('{{'))
}

function readCookie(name: string) {
  if (typeof document === 'undefined') return null
  return (
    document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith(`${name}=`))
      ?.split('=')
      .slice(1)
      .join('=') || null
  )
}

function readStoredConsent(): StoredConsent | null {
  const raw = readCookie(COOKIE_NAME)
  if (!raw) return null

  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as StoredConsent
    if (parsed.version !== 1) return null
    return {
      necessary: true,
      statistics: Boolean(parsed.statistics),
      marketing: Boolean(parsed.marketing),
      version: 1,
      createdAt: parsed.createdAt,
    }
  } catch {
    return null
  }
}

function writeStoredConsent(settings: ConsentSettings) {
  const value: StoredConsent = {
    ...settings,
    necessary: true,
    version: 1,
    createdAt: new Date().toISOString(),
  }

  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`
}

function updateGoogleConsent(settings: ConsentSettings) {
  window.gtag?.('consent', 'update', {
    analytics_storage: settings.statistics ? 'granted' : 'denied',
    ad_storage: settings.marketing ? 'granted' : 'denied',
    ad_user_data: settings.marketing ? 'granted' : 'denied',
    ad_personalization: settings.marketing ? 'granted' : 'denied',
  })
}

function ensureGoogleAnalytics(ga4Id: string) {
  if (!isConfigured(ga4Id) || document.querySelector(`script[data-cookie-tool="ga4"]`)) return

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
    wait_for_update: 500,
  })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`
  script.dataset.cookieTool = 'ga4'
  document.head.appendChild(script)

  window.gtag('js', new Date())
  window.gtag('config', ga4Id, { anonymize_ip: true })
}

function ensureHotjar(hotjarId?: string) {
  if (!isConfigured(hotjarId) || document.querySelector(`script[data-cookie-tool="hotjar"]`)) return

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

function ensureMetaPixel(pixelId: string) {
  if (!isConfigured(pixelId) || document.querySelector(`script[data-cookie-tool="meta-pixel"]`)) return

  window.fbq =
    window.fbq ||
    function fbq(...args: unknown[]) {
      window._fbqQueue = window._fbqQueue || []
      window._fbqQueue.push(args)
    }

  window.fbq('consent', 'revoke')
  window.fbq('init', pixelId)
  window.fbq('consent', 'grant')
  window.fbq('track', 'PageView')

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  script.dataset.cookieTool = 'meta-pixel'
  document.head.appendChild(script)
}

function applyConsent(settings: ConsentSettings) {
  const { tracking } = projectConfig

  if (settings.statistics) {
    ensureGoogleAnalytics(tracking.ga4)
    ensureHotjar(tracking.hotjar)
  }

  if (settings.marketing) {
    ensureMetaPixel(tracking.metaPixel)
  } else {
    window.fbq?.('consent', 'revoke')
  }

  updateGoogleConsent(settings)
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [settings, setSettings] = useState<ConsentSettings>(defaultSettings)

  const categories = useMemo(
    () => [
      {
        key: 'necessary',
        title: 'Notwendig',
        locked: true,
        active: true,
        description:
          'Erforderlich für Grundfunktionen der Website und zur Speicherung Ihrer Cookie-Entscheidung.',
        tools: [
          'cookie_consent: First-Party-Cookie zur Speicherung der Auswahl, Laufzeit 180 Tage, kein Drittlandtransfer.',
        ],
      },
      {
        key: 'statistics',
        title: 'Statistik',
        locked: false,
        active: settings.statistics,
        description:
          'Hilft uns zu verstehen, wie die Website genutzt wird. Erst aktiv nach Ihrer Zustimmung.',
        tools: [
          'Google Analytics 4: Reichweitenmessung, Anbieter Google Ireland/Google LLC, mögliche USA-Übermittlung, Laufzeit bis 14 Monate.',
          'Hotjar: Heatmaps und Nutzungsanalyse, Anbieter Hotjar Ltd., mögliche USA-Übermittlung, Laufzeit bis 12 Monate.',
        ],
      },
      {
        key: 'marketing',
        title: 'Marketing',
        locked: false,
        active: settings.marketing,
        description:
          'Ermöglicht Kampagnenmessung und Remarketing. Erst aktiv nach Ihrer Zustimmung.',
        tools: [
          'Meta Pixel: Kampagnenmessung und Remarketing, Anbieter Meta Platforms Ireland/Meta Platforms Inc., mögliche USA-Übermittlung, Laufzeit bis 3 Monate.',
        ],
      },
    ],
    [settings.marketing, settings.statistics],
  )

  useEffect(() => {
    const stored = readStoredConsent()
    if (stored) {
      setSettings(stored)
      applyConsent(stored)
      setVisible(false)
    } else {
      setVisible(true)
      setDetailsOpen(false)
    }

    function openSettings() {
      const latest = readStoredConsent()
      setSettings(latest || defaultSettings)
      setDetailsOpen(true)
      setVisible(true)
    }

    window.addEventListener('cookie-consent:open', openSettings)
    return () => window.removeEventListener('cookie-consent:open', openSettings)
  }, [])

  function save(next: ConsentSettings) {
    const normalized = { ...next, necessary: true as const }
    writeStoredConsent(normalized)
    setSettings(normalized)
    applyConsent(normalized)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/98 shadow-soft backdrop-blur">
      <div className="section-shell max-h-[86vh] overflow-y-auto py-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-semibold text-ink">Cookie-Einstellungen</p>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-muted">
              Wir verwenden notwendige Cookies für den Betrieb der Website. Statistik
              und Marketing werden erst nach Ihrer aktiven Einwilligung geladen. Die
              Einwilligung erfolgt nach Art. 6 Abs. 1 lit. a DSGVO i. V. m. § 165
              Abs. 3 TKG 2021 und kann jederzeit widerrufen werden. Details finden
              Sie in der{' '}
              <Link href="/cookie-richtlinie" className="font-semibold text-accent underline-offset-4 hover:underline">
                Cookie-Richtlinie
              </Link>
              .
            </p>
          </div>
          {!detailsOpen && (
            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
              <Button variant="secondary" className="w-full" onClick={() => save(defaultSettings)}>
                Alle ablehnen
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => save({ necessary: true, statistics: true, marketing: true })}
              >
                Alle akzeptieren
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => setDetailsOpen(true)}>
                Einstellungen
              </Button>
            </div>
          )}
        </div>

        {detailsOpen && (
          <div className="mt-5 border-t border-line pt-5">
            <div className="grid gap-3 md:grid-cols-3">
              {categories.map((category) => (
                <div key={category.key} className="rounded-md border border-line bg-bg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-ink">{category.title}</p>
                      <p className="mt-2 text-sm leading-6 text-muted">{category.description}</p>
                    </div>
                    <label className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-ink">
                      <input
                        type="checkbox"
                        checked={category.active}
                        disabled={category.locked}
                        onChange={(event) => {
                          if (category.key === 'statistics') {
                            setSettings((current) => ({
                              ...current,
                              statistics: event.target.checked,
                            }))
                          }
                          if (category.key === 'marketing') {
                            setSettings((current) => ({
                              ...current,
                              marketing: event.target.checked,
                            }))
                          }
                        }}
                        className="h-4 w-4 accent-accent disabled:opacity-60"
                      />
                      {category.locked ? 'Immer an' : 'Ein'}
                    </label>
                  </div>
                  <ul className="mt-4 space-y-2 text-xs leading-5 text-muted">
                    {category.tools.map((tool) => (
                      <li key={tool}>• {tool}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Button variant="secondary" className="w-full" onClick={() => save(defaultSettings)}>
                Alle ablehnen
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => save({ necessary: true, statistics: true, marketing: true })}
              >
                Alle akzeptieren
              </Button>
              <Button className="w-full" onClick={() => save(settings)}>
                Auswahl speichern
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

declare global {
  interface Window {
    dataLayer?: unknown[][]
    hj?: ((...args: unknown[]) => void) & { q?: unknown[][] }
    _hjSettings?: { hjid: number; hjsv: number }
    _fbqQueue?: unknown[][]
  }
}
