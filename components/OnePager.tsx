'use client'

import { useCallback, useEffect, useState } from 'react'
import { Navigation } from './Navigation'
import { CookieBanner } from './CookieBanner'
import { ExitIntent } from './ExitIntent'
import { StickyCta } from './StickyCta'
import { Hero } from './sections/Hero'
import { Intro } from './sections/Intro'
import { Projekt } from './sections/Projekt'
import { Lage } from './sections/Lage'
import Wohnungsfinder from './sections/Wohnungsfinder'
import { Ausstattung } from './sections/Ausstattung'
import { Bautraeger } from './sections/Bautraeger'
import { Kontakt } from './sections/Kontakt'
import { Footer } from './sections/Footer'
import { trackEvent } from '@/lib/analytics'

export function OnePager() {
  const [prefillTop, setPrefillTop] = useState<string | null>(null)

  const handleWohnungAnfrage = useCallback((top: string, nr: number) => {
    setPrefillTop(top)
    trackEvent('wohnung_anfrage', { top, wohnung_nr: nr })
    window.requestAnimationFrame(() => {
      document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  const handleGeneralAnfrage = useCallback(() => {
    setPrefillTop('noch unentschlossen')
    document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
      <Navigation />
      <main>
        <Hero />
        <Intro />
        <Projekt />
        <Lage />
        <Wohnungsfinder onAnfrage={handleWohnungAnfrage} />
        <Ausstattung />
        <Bautraeger />
        <Kontakt prefillTop={prefillTop} />
      </main>
      <Footer />
      <StickyCta onClick={handleGeneralAnfrage} />
      <ExitIntent />
      <CookieBanner />
    </>
  )
}
