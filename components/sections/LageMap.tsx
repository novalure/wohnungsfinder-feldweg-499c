'use client'

/* eslint-disable @next/next/no-img-element */
import { useEffect } from 'react'

const center: [number, number] = [47.4308, 11.7329]

export function LageMap() {
  useEffect(() => {
    let map: import('leaflet').Map | null = null

    async function init() {
      const L = await import('leaflet')
      map = L.map('lage-map', {
        center,
        zoom: 12,
        scrollWheelZoom: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map)

      const points = [
        ['Projekt', center],
        ['Achenseeufer', [47.4364, 11.7108]],
        ['Karwendel-Bergbahn', [47.4393, 11.7019]],
        ['Rofanbahn', [47.4215, 11.7532]],
        ['Bahnhof Jenbach', [47.3885, 11.7734]],
      ] as const

      const icon = L.divIcon({
        className: '',
        html: '<span style="display:block;width:18px;height:18px;border-radius:999px;background:#2F4A3A;border:3px solid #B89968;box-shadow:0 8px 18px rgba(31,42,46,.25)"></span>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      })

      points.forEach(([label, coords]) => {
        L.marker(coords as [number, number], { icon }).addTo(map!).bindPopup(label)
      })
    }

    init()
    return () => {
      map?.remove()
    }
  }, [])

  return (
    <div className="relative overflow-hidden rounded-md border border-line bg-surface">
      <div id="lage-map" className="h-[420px] w-full" aria-label="Interaktive Karte Achensee" />
      <noscript>
        <img src="/img/lage-karte.jpg" alt="Statische Karte der Lage am Achensee" />
      </noscript>
    </div>
  )
}
