'use client'

import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import projectConfig from '@/config/project.json'
import { ButtonLink } from './ui/Button'

const navItems = [
  ['Projekt', '#projekt'],
  ['Lage', '#lage'],
  ['Wohnungen', '#wohnungen'],
  ['Ausstattung', '#ausstattung'],
  ['Bauträger', '#bautraeger'],
  ['Kontakt', '#kontakt'],
]

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
  const { project, company } = projectConfig

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
        solid ? 'bg-bg/95 shadow-header backdrop-blur' : 'bg-transparent'
      }`}
    >
      <div
        className={`section-shell grid h-20 grid-cols-[auto_1fr_auto] items-center gap-4 transition-[grid-template-columns] duration-500 ease-out lg:grid-cols-[1fr_minmax(0,var(--nav-center-width))_1fr] ${
          solid ? '[--nav-center-width:250px]' : '[--nav-center-width:0px]'
        }`}
      >
        <a href="#hero" className="flex items-center gap-3 lg:hidden" aria-label={`${project.name} Start`}>
          <span className="rounded-md bg-white/95 px-2 py-1 shadow-sm">
            <Image src={company.logoSvg} width={82} height={60} alt={company.name} priority />
          </span>
        </a>

        <nav
          className={`hidden items-center justify-end transition-[gap] duration-500 ease-out lg:flex ${
            solid ? 'gap-8' : 'gap-10'
          }`}
          aria-label="Hauptnavigation links"
        >
          {leftNavItems.map(([label, href]) => (
            <a key={href} href={href} className={`text-sm font-medium transition ${linkClasses}`}>
              {label}
            </a>
          ))}
        </nav>

        <a
          href="#hero"
          className={`hidden overflow-hidden text-center transition-all duration-500 ease-out lg:block ${
            solid ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
          }`}
          aria-label={`${project.name} Start`}
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
            {rightNavItems.map(([label, href]) => (
              <a key={href} href={href} className={`text-sm font-medium transition ${linkClasses}`}>
                {label}
              </a>
            ))}
          </nav>
          <ButtonLink href="#kontakt" className="px-4 py-2.5">
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
        <div className="fixed inset-0 z-50 bg-bg px-6 py-6 lg:hidden">
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
            {navItems.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="font-serif text-4xl text-ink"
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
            <ButtonLink href="#kontakt" className="mt-4" onClick={() => setOpen(false)}>
              Exposé anfragen
            </ButtonLink>
          </nav>
        </div>
      )}
    </header>
  )
}
