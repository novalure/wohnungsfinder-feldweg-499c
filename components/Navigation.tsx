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
      <div className="section-shell flex h-20 items-center justify-between">
        <a href="#hero" className="flex items-center gap-3" aria-label={`${project.name} Start`}>
          <Image src={company.logoSvg} width={118} height={38} alt={company.name} priority />
          <span
            className={`hidden text-sm font-semibold md:block ${
              solid ? 'text-ink' : 'text-white'
            }`}
          >
            {project.name}
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Hauptnavigation">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} className={`text-sm font-medium transition ${linkClasses}`}>
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href="#kontakt">Exposé anfragen</ButtonLink>
        </div>

        <button
          type="button"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-md lg:hidden ${
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
            <Image src={company.logoSvg} width={130} height={42} alt={company.name} />
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
