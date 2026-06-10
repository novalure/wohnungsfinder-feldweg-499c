'use client'

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import { getCurrentConsent, openConsentSettings, subscribeConsent } from '@/lib/consent'

const projectLocation: [number, number] = [47.542, 11.7044]

export function LageMap() {
  const [functionalAllowed, setFunctionalAllowed] = useState(false)

  useEffect(() => {
    setFunctionalAllowed(getCurrentConsent().functional)
    return subscribeConsent((consent) => setFunctionalAllowed(consent.functional))
  }, [])

  useEffect(() => {
    if (!functionalAllowed) return

    let map: import('leaflet').Map | null = null

    async function init() {
      const L = await import('leaflet')
      map = L.map('lage-map', {
        center: projectLocation,
        zoom: 16,
        scrollWheelZoom: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map)

      const icon = L.divIcon({
        className: '',
        html: '<span style="display:block;width:18px;height:18px;border-radius:999px;background:#2F4A3A;border:3px solid #B89968;box-shadow:0 8px 18px rgba(31,42,46,.25)"></span>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      })

      L.marker(projectLocation, { icon })
        .addTo(map)
        .bindPopup('Vallis Achen Residenzen<br />A-6215 Achenkirch, Feldweg 499c')
    }

    init()
    return () => {
      map?.remove()
    }
  }, [functionalAllowed])

  return (
    <div className="relative overflow-hidden rounded-md border border-line bg-surface">
      {functionalAllowed ? (
        <div id="lage-map" className="h-[420px] w-full" aria-label="Interaktive Karte Achensee" />
      ) : (
        <div className="grid min-h-[420px] place-items-center bg-bg p-6 text-center">
          <div className="max-w-md">
            <p className="font-serif text-3xl text-ink">Interaktive Karte</p>
            <p className="mt-3 text-sm leading-6 text-muted">
              Die Karte wird erst geladen, wenn Sie funktionalen Diensten zustimmen.
            </p>
            <button
              type="button"
              className="mt-5 rounded-md border border-accent bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#263f31] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              onClick={openConsentSettings}
            >
              Cookie-Einstellungen öffnen
            </button>
          </div>
        </div>
      )}
      <noscript>
        <img src="/img/lage-karte.jpg" alt="Statische Karte der Lage am Achensee" />
      </noscript>
    </div>
  )
}
