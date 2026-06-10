'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  applyConsent,
  createConsentState,
  DEFAULT_CONSENT,
  getCurrentConsent,
  getTrackingConfig,
  hasFunctionalServices,
  hasMarketingServices,
  hasStatisticsServices,
  isConfigured,
  onOpenConsentSettings,
  saveConsent,
  type ConsentCategory,
  type ConsentState,
} from '@/lib/consent'
import { LEGAL } from '@/lib/legal-config'

type CategoryConfig = {
  key: ConsentCategory
  title: string
  description: string
  locked?: boolean
  services: Array<{
    name: string
    provider: string
    purpose: string
    duration: string
    thirdCountry: string
  }>
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettings] = useState<ConsentState>(DEFAULT_CONSENT)
  const [expanded, setExpanded] = useState<ConsentCategory | null>('necessary')
  const dialogRef = useRef<HTMLDivElement>(null)

  const categories = useConsentCategories()

  useEffect(() => {
    const stored = getCurrentConsent()
    setSettings(stored)

    if (stored.timestamp) {
      applyConsent(stored)
      setVisible(false)
    } else {
      setVisible(true)
    }

    return onOpenConsentSettings(() => {
      setSettings(getCurrentConsent())
      setSettingsOpen(true)
      setVisible(true)
    })
  }, [])

  useEffect(() => {
    if (!visible) return

    const focusable = getFocusableElements(dialogRef.current)
    focusable[0]?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSettingsOpen(false)
        return
      }

      if (event.key !== 'Tab') return

      const elements = getFocusableElements(dialogRef.current)
      if (!elements.length) return

      const first = elements[0]
      const last = elements[elements.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [visible, settingsOpen])

  if (!visible) return null

  function persist(next: ConsentState) {
    saveConsent(next)
    setSettings(next)
    setVisible(false)
    setSettingsOpen(false)
  }

  function acceptAll() {
    persist(
      createConsentState({
        functional: hasFunctionalServices(),
        statistics: hasStatisticsServices(),
        marketing: hasMarketingServices(),
      }),
    )
  }

  function rejectAll() {
    persist(createConsentState({ functional: false, statistics: false, marketing: false }))
  }

  function saveSelection() {
    persist(
      createConsentState({
        functional: settings.functional,
        statistics: settings.statistics,
        marketing: settings.marketing,
      }),
    )
  }

  function updateCategory(category: ConsentCategory, active: boolean) {
    if (category === 'necessary') return
    setSettings((current) => ({ ...current, [category]: active }))
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-bg/96 shadow-[0_-18px_60px_rgba(31,42,46,0.2)] backdrop-blur"
    >
      <div className="section-shell max-h-[88vh] overflow-y-auto py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        {!settingsOpen ? (
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p id="cookie-consent-title" className="text-xl font-semibold text-ink sm:text-2xl">
                Cookie-Einstellungen
              </p>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-ink/80 sm:text-base sm:leading-7">
                Wir verwenden Cookies und ähnliche Technologien. Notwendige sind für
                den Betrieb der Website erforderlich. Mit Ihrer Einwilligung nutzen
                wir zusätzlich Komfortfunktionen
                {hasStatisticsServices() || hasMarketingServices()
                  ? ', Statistik- und Marketing-Dienste'
                  : ''}{' '}
                {hasStatisticsServices() || hasMarketingServices()
                  ? 'um die Website zu verbessern und Reichweite zu messen'
                  : 'wie die interaktive Karte'}
                . Dabei können Daten auch in Drittländer (z. B. USA) übermittelt
                werden. Sie können jederzeit widerrufen.
              </p>
              <p className="mt-3 text-sm leading-6 text-muted">
                Mehr in der{' '}
                <Link href="/cookie-richtlinie" className="font-semibold text-accent underline-offset-4 hover:underline">
                  Cookie-Richtlinie
                </Link>{' '}
                und{' '}
                <Link href="/datenschutz" className="font-semibold text-accent underline-offset-4 hover:underline">
                  Datenschutzerklärung
                </Link>
                .
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
              <button
                type="button"
                className="min-h-12 rounded-md border border-accent bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#263f31] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={acceptAll}
              >
                Alle akzeptieren
              </button>
              <button
                type="button"
                className="min-h-12 rounded-md border border-accent bg-surface px-4 py-3 text-sm font-semibold text-accent transition hover:bg-accent/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={rejectAll}
              >
                Alle ablehnen
              </button>
              <button
                type="button"
                className="min-h-12 rounded-md border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={() => setSettingsOpen(true)}
              >
                Einstellungen
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="max-w-4xl">
              <p id="cookie-consent-title" className="text-xl font-semibold text-ink sm:text-2xl">
                Privatsphäre-Einstellungen
              </p>
              <p className="mt-3 text-sm leading-6 text-muted sm:text-base sm:leading-7">
                Wählen Sie aus, welche optionalen Dienste geladen werden dürfen.
                Notwendige Cookies bleiben immer aktiv.
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              {categories.map((category) => {
                const active = category.locked ? true : Boolean(settings[category.key])
                const isExpanded = expanded === category.key

                return (
                  <section key={category.key} className="rounded-md border border-line bg-surface">
                    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between">
                      <button
                        type="button"
                        className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        onClick={() => setExpanded(isExpanded ? null : category.key)}
                        aria-expanded={isExpanded}
                      >
                        <span className="block font-semibold text-ink">{category.title}</span>
                        <span className="mt-1 block text-sm leading-6 text-muted">{category.description}</span>
                      </button>
                      {category.locked ? (
                        <span className="inline-flex min-h-10 shrink-0 items-center rounded-full bg-accent/10 px-4 text-sm font-semibold text-accent">
                          Immer aktiv
                        </span>
                      ) : (
                        <label className="inline-flex min-h-10 shrink-0 items-center gap-3 text-sm font-semibold text-ink">
                          <span>{active ? 'Aktiv' : 'Inaktiv'}</span>
                          <input
                            type="checkbox"
                            className="h-5 w-5 accent-accent"
                            checked={active}
                            onChange={(event) => updateCategory(category.key, event.target.checked)}
                            aria-label={`${category.title} ${active ? 'deaktivieren' : 'aktivieren'}`}
                          />
                        </label>
                      )}
                    </div>
                    {isExpanded && (
                      <div className="border-t border-line px-4 py-4">
                        <div className="grid gap-3">
                          {category.services.map((service) => (
                            <div key={`${category.key}-${service.name}`} className="rounded-md bg-bg p-4 text-sm leading-6">
                              <p className="font-semibold text-ink">{service.name}</p>
                              <dl className="mt-2 grid gap-1 text-muted sm:grid-cols-[9rem_1fr]">
                                <dt>Anbieter</dt>
                                <dd>{service.provider}</dd>
                                <dt>Zweck</dt>
                                <dd>{service.purpose}</dd>
                                <dt>Speicherdauer</dt>
                                <dd>{service.duration}</dd>
                                <dt>Drittland</dt>
                                <dd>{service.thirdCountry}</dd>
                              </dl>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                )
              })}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                className="min-h-12 rounded-md border border-accent bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#263f31] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={saveSelection}
              >
                Auswahl speichern
              </button>
              <button
                type="button"
                className="min-h-12 rounded-md border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={acceptAll}
              >
                Alle akzeptieren
              </button>
              <button
                type="button"
                className="min-h-12 rounded-md border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={rejectAll}
              >
                Alle ablehnen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function useConsentCategories(): CategoryConfig[] {
  return useMemo(() => {
    const tracking = getTrackingConfig()
    const categories: CategoryConfig[] = [
      {
        key: 'necessary',
        title: 'Notwendig',
        description:
          'Erforderlich für Betrieb, Sicherheit und Speicherung Ihrer Cookie-Entscheidung.',
        locked: true,
        services: [
          {
            name: 'cookie_consent',
            provider: 'First Party',
            purpose: 'Speichert Ihre Cookie-Auswahl mit Zeitstempel und Version.',
            duration: `${LEGAL.consent.reConsentMonths} Monate`,
            thirdCountry: 'Nein',
          },
        ],
      },
    ]

    if (hasFunctionalServices()) {
      categories.push({
        key: 'functional',
        title: 'Funktional',
        description:
          'Erweiterte Komfortfunktionen wie die interaktive Karte in der Lage-Sektion.',
        services: [
          {
            name: 'OpenStreetMap-Kartenkacheln',
            provider: 'OpenStreetMap Foundation / Tile-Server',
            purpose: 'Darstellung der interaktiven Lagekarte.',
            duration: 'Sitzung / abhängig vom Browser-Cache',
            thirdCountry: 'Mögliche Übermittlung an Server außerhalb Österreichs',
          },
        ],
      })
    }

    const statisticsServices: CategoryConfig['services'] = []
    if (isConfigured(tracking.ga4)) {
      statisticsServices.push({
        name: 'Google Analytics 4',
        provider: 'Google Ireland Ltd.',
        purpose: 'Reichweitenmessung und Nutzungsauswertung.',
        duration: 'Bis zu 14 Monate',
        thirdCountry: 'Mögliche Übermittlung in die USA',
      })
    }
    if (isConfigured(tracking.hotjar)) {
      statisticsServices.push({
        name: 'Hotjar',
        provider: 'Hotjar Ltd.',
        purpose: 'Heatmaps und Nutzungsanalyse.',
        duration: 'Bis zu 12 Monate',
        thirdCountry: 'Mögliche Übermittlung in die USA',
      })
    }
    if (statisticsServices.length) {
      categories.push({
        key: 'statistics',
        title: 'Statistik / Performance',
        description: 'Reichweitenmessung und Verbesserung der Website.',
        services: statisticsServices,
      })
    }

    if (isConfigured(tracking.metaPixel)) {
      categories.push({
        key: 'marketing',
        title: 'Marketing',
        description: 'Conversion-Messung und Retargeting.',
        services: [
          {
            name: 'Meta Pixel',
            provider: 'Meta Platforms Ireland Ltd.',
            purpose: 'Kampagnenmessung und Remarketing.',
            duration: 'Bis zu 3 Monate',
            thirdCountry: 'Mögliche Übermittlung in die USA',
          },
        ],
      })
    }

    return categories
  }, [])
}

function getFocusableElements(root: HTMLElement | null) {
  if (!root) return []

  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute('aria-hidden'))
}
