'use client'

import { useEffect, useState } from 'react'
import projectConfig from '@/config/project.json'
import { Button } from './ui/Button'

type Consent = 'essential' | 'marketing'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const tracking = projectConfig.tracking

  useEffect(() => {
    setVisible(!localStorage.getItem('cookie-consent'))
  }, [])

  function accept(consent: Consent) {
    localStorage.setItem('cookie-consent', consent)
    setVisible(false)
    if (consent === 'marketing') {
      window.dispatchEvent(new CustomEvent('marketing-consent'))
    }
  }

  useEffect(() => {
    const injectTracking = () => {
      if (tracking.ga4 && !tracking.ga4.includes('{{')) {
        const script = document.createElement('script')
        script.async = true
        script.src = `https://www.googletagmanager.com/gtag/js?id=${tracking.ga4}`
        document.head.appendChild(script)
        window.dataLayer = window.dataLayer || []
        window.gtag = function gtag() {
          window.dataLayer!.push(arguments)
        }
        window.gtag('js', new Date())
        window.gtag('config', tracking.ga4, { anonymize_ip: true })
      }
      if (tracking.metaPixel && !tracking.metaPixel.includes('{{')) {
        window.fbq?.('init', tracking.metaPixel)
      }
    }

    if (localStorage.getItem('cookie-consent') === 'marketing') injectTracking()
    window.addEventListener('marketing-consent', injectTracking)
    return () => window.removeEventListener('marketing-consent', injectTracking)
  }, [tracking.ga4, tracking.metaPixel])

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/95 shadow-soft backdrop-blur">
      <div className="section-shell grid gap-5 py-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="font-semibold text-ink">Cookie-Einstellungen</p>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-muted">
            Essenzielle Cookies sichern die Funktion der Website. Marketing-Cookies
            aktivieren Messung und Kampagnen-Optimierung erst nach Ihrer Zustimmung.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => accept('essential')}>
            Ablehnen
          </Button>
          <Button variant="secondary" onClick={() => accept('essential')}>
            Nur essenziell
          </Button>
          <Button onClick={() => accept('marketing')}>Alle akzeptieren</Button>
        </div>
      </div>
    </div>
  )
}

declare global {
  interface Window {
    dataLayer?: IArguments[]
  }
}
