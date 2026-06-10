'use client'

import { Mail, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { trackEvent } from '@/lib/analytics'

type StickyCtaBarProps = {
  onInquiryClick?: () => void
}

const PHONE_HREF = 'tel:+43524266666'

export function StickyCtaBar({ onInquiryClick }: StickyCtaBarProps) {
  const [heroVisible, setHeroVisible] = useState(true)
  const [contactVisible, setContactVisible] = useState(false)
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false)

  const visible = isMobileOrTablet && !heroVisible && !contactVisible

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)')

    const updateBreakpoint = () => {
      setIsMobileOrTablet(mediaQuery.matches)
    }

    updateBreakpoint()
    mediaQuery.addEventListener('change', updateBreakpoint)

    return () => mediaQuery.removeEventListener('change', updateBreakpoint)
  }, [])

  useEffect(() => {
    const hero = document.getElementById('hero')
    const contact = document.getElementById('kontakt')

    if (!hero || !contact) return

    const heroObserver = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0 },
    )

    const contactObserver = new IntersectionObserver(
      ([entry]) => setContactVisible(entry.isIntersecting),
      { threshold: 0.01 },
    )

    heroObserver.observe(hero)
    contactObserver.observe(contact)

    return () => {
      heroObserver.disconnect()
      contactObserver.disconnect()
    }
  }, [])

  function handleInquiryClick(event: React.MouseEvent<HTMLAnchorElement>) {
    trackEvent('cta_sticky_anfrage', { target: 'kontakt' })

    if (onInquiryClick) {
      event.preventDefault()
      onInquiryClick()
      return
    }

    event.preventDefault()
    document.getElementById('kontakt')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  function handleCallClick() {
    trackEvent('cta_sticky_call', { target: PHONE_HREF })
  }

  return (
    <nav
      aria-label="Schnellkontakt"
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-18px_60px_rgba(31,42,46,0.12)] backdrop-blur-sm lg:hidden motion-safe:transition motion-safe:duration-200 motion-safe:ease-out motion-reduce:transition-none ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-full opacity-0'
      }`}
    >
      <div className="mx-auto grid max-w-content grid-cols-2 gap-3">
        <a
          href="#kontakt"
          aria-label="Anfrage senden"
          tabIndex={visible ? 0 : -1}
          onClick={handleInquiryClick}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          <Mail size={18} aria-hidden="true" />
          Anfrage senden
        </a>
        <a
          href={PHONE_HREF}
          aria-label="Jetzt anrufen"
          tabIndex={visible ? 0 : -1}
          onClick={handleCallClick}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-accent bg-surface px-4 py-3 text-sm font-semibold text-accent transition hover:bg-accent/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          <Phone size={18} aria-hidden="true" />
          Anrufen
        </a>
      </div>
    </nav>
  )
}
