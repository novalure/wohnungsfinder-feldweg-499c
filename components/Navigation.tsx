'use client'

import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type MouseEvent } from 'react'
import projectConfig from '@/config/project.json'
import { ButtonLink } from './ui/Button'

const navItems = [
  { label: 'Projekt', sectionId: 'projekt' },
  { label: 'Lage', sectionId: 'lage' },
  { label: 'Wohnungen', sectionId: 'wohnungen' },
  { label: 'Ausstattung', sectionId: 'ausstattung' },
  { label: 'Vertrieb', sectionId: 'bautraeger' },
  { label: 'Kontakt', sectionId: 'kontakt' },
] as const

const leftNavItems = navItems.slice(0, 3)
const rightNavItems = navItems.slice(3)

function ProjectWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`block font-serif font-semibold uppercase text-ink ${
        compact ? 'text-[1.25rem] leading-[0.82]' : 'text-[1.45rem] leading-[0.82]'
      }`}
    >
      <span className="block">Vallis</span>
      <span className="block">
        <span>Achen</span>
      </span>
      <span className="block">Residenzen</span>
    </span>
  )
}

export function Navigation() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { project } = projectConfig
  const isHome = pathname === '/'
  const getSectionHref = (sectionId: string) => (isHome ? `#${sectionId}` : `/#${sectionId}`)
  const heroHref = isHome ? '#hero' : '/#hero'

  function focusAnchor(
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
    closeMenu = false,
  ) {
    if (!href.startsWith('#')) return

    event.preventDefault()
    if (closeMenu) setOpen(false)

    window.requestAnimationFrame(() => {
      const target = document.getElementById(href.slice(1))
      if (!target) return

      target.setAttribute('tabindex', '-1')
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.setTimeout(() => target.focus({ preventScroll: true }), 250)
    })
  }

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.dataset.menuOpen = open ? 'true' : 'false'
    return () => {
      document.body.dataset.menuOpen = 'false'
    }
  }, [open])

  const linkClasses = solid
    ? 'text-ink hover:text-accent'
    : 'text-white/90 hover:text-white'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition ${
        solid ? 'bg-transparent lg:bg-bg/95 lg:shadow-header lg:backdrop-blur' : 'bg-transparent'
      }`}
    >
      <div
        className={`section-shell grid h-20 grid-cols-[44px_1fr_44px] items-center gap-2 transition-[grid-template-columns] duration-500 ease-out lg:grid-cols-[1fr_minmax(0,var(--nav-center-width))_1fr] lg:gap-4 ${
          solid ? '[--nav-center-width:250px]' : '[--nav-center-width:0px]'
        }`}
      >
        <span className="lg:hidden" aria-hidden="true" />

        <nav
          className={`hidden items-center justify-end transition-[gap] duration-500 ease-out lg:flex ${
            solid ? 'gap-8' : 'gap-10'
          }`}
          aria-label="Hauptnavigation links"
        >
          {leftNavItems.map(({ label, sectionId }) => {
            const href = getSectionHref(sectionId)
            return (
              <a
                key={href}
                href={href}
                className={`text-sm font-medium transition ${linkClasses}`}
                onClick={(event) => focusAnchor(event, href)}
              >
                {label}
              </a>
            )
          })}
        </nav>

        <a
          href={heroHref}
          className={`hidden overflow-hidden text-center transition-all duration-500 ease-out lg:block ${
            solid ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
          }`}
          aria-label={`${project.name} Start`}
          onClick={(event) => focusAnchor(event, heroHref)}
        >
          <ProjectWordmark compact />
        </a>

        <a
          href={heroHref}
          className={`min-w-0 overflow-hidden text-center transition-all duration-500 ease-out lg:hidden ${
            solid ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
          }`}
          aria-label={`${project.name} Start`}
          onClick={(event) => focusAnchor(event, heroHref)}
        >
          <ProjectWordmark compact />
        </a>

        <div
          className={`hidden items-center justify-start transition-[gap] duration-500 ease-out lg:flex ${
            solid ? 'gap-8' : 'gap-10'
          }`}
        >
          <nav
            className={`flex items-center transition-[gap] duration-500 ease-out ${
              solid ? 'gap-8' : 'gap-10'
            }`}
            aria-label="Hauptnavigation rechts"
          >
            {rightNavItems.map(({ label, sectionId }) => {
              const href = getSectionHref(sectionId)
              return (
                <a
                  key={href}
                  href={href}
                  className={`text-sm font-medium transition ${linkClasses}`}
                  onClick={(event) => focusAnchor(event, href)}
                >
                  {label}
                </a>
              )
            })}
          </nav>
          <ButtonLink
            href={getSectionHref('kontakt')}
            className="px-4 py-2.5"
            onClick={(event) => focusAnchor(event, getSectionHref('kontakt'))}
          >
            Exposé anfragen
          </ButtonLink>
        </div>

        <button
          type="button"
          className={`inline-flex h-11 w-11 items-center justify-center justify-self-end rounded-md lg:hidden ${
            solid ? 'text-ink' : 'text-white'
          }`}
          onClick={() => setOpen(true)}
          aria-label="Menü öffnen"
        >
          <Menu />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-white px-6 py-6 lg:hidden">
          <div className="flex items-center justify-between">
            <ProjectWordmark />
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink"
              onClick={() => setOpen(false)}
              aria-label="Menü schließen"
            >
              <X />
            </button>
          </div>
          <nav className="mt-14 grid gap-7" aria-label="Mobile Navigation">
            {navItems.map(({ label, sectionId }) => {
              const href = getSectionHref(sectionId)
              return (
                <a
                  key={href}
                  href={href}
                  className="font-serif text-4xl text-ink"
                  onClick={(event) => focusAnchor(event, href, true)}
                >
                  {label}
                </a>
              )
            })}
            <ButtonLink
              href={getSectionHref('kontakt')}
              className="mt-4"
              onClick={(event) => focusAnchor(event, getSectionHref('kontakt'), true)}
            >
              Exposé anfragen
            </ButtonLink>
          </nav>
        </div>
      )}
    </header>
  )
}
