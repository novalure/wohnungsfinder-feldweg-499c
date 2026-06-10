'use client'

import { useCallback, useEffect, useState } from 'react'
import { Navigation } from './Navigation'
import { ExitIntent } from './ExitIntent'
import { StickyCtaBar } from './StickyCtaBar'
import { Hero } from './sections/Hero'
import { Intro } from './sections/Intro'
import { Projekt } from './sections/Projekt'
import { Lage } from './sections/Lage'
import Wohnungsfinder from './sections/Wohnungsfinder'
import { Ausstattung } from './sections/Ausstattung'
import { Bautraeger } from './sections/Bautraeger'
import { Kontakt } from './sections/Kontakt'
import { trackEvent } from '@/lib/analytics'

function focusSection(id: string) {
  const target = document.getElementById(id)
  if (!target) return

  target.setAttribute('tabindex', '-1')
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  window.setTimeout(() => target.focus({ preventScroll: true }), 250)
}

export function OnePager() {
  const [prefillTop, setPrefillTop] = useState<string | null>(null)

  const handleWohnungAnfrage = useCallback((top: string, nr: number) => {
    setPrefillTop(top)
    trackEvent('wohnung_anfrage', { top, wohnung_nr: nr })
    window.requestAnimationFrame(() => {
      focusSection('kontakt')
    })
  }, [])

  const handleGeneralAnfrage = useCallback(() => {
    setPrefillTop('noch unentschlossen')
    focusSection('kontakt')
  }, [])

  useEffect(() => {
    const seen = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || seen.has(entry.target.id)) return
          seen.add(entry.target.id)
          trackEvent('view_section', { section_id: entry.target.id })
        })
      },
      { threshold: 0.4 },
    )

    document
      .querySelectorAll('section[id]')
      .forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <a href="#main-content" className="skip-link">
        Zum Inhalt springen
      </a>
      <Navigation />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Intro />
        <Projekt />
        <Lage />
        <Wohnungsfinder onAnfrage={handleWohnungAnfrage} />
        <Ausstattung />
        <Bautraeger />
        <Kontakt prefillTop={prefillTop} />
      </main>
      <StickyCtaBar onInquiryClick={handleGeneralAnfrage} />
      <ExitIntent />
    </>
  )
}
