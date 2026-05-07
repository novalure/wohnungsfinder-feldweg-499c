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
      <div className="section-shell grid h-20 grid-cols-[auto_1fr_auto] items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <a href="#hero" className="flex items-center gap-3 lg:hidden" aria-label={`${project.name} Start`}>
          <span className="rounded-md bg-white/95 px-2 py-1 shadow-sm">
            <Image src={company.logoSvg} width={82} height={60} alt={company.name} priority />
          </span>
          <span
            className={`hidden text-sm font-semibold md:block ${solid ? 'text-ink' : 'text-white'}`}
          >
            {project.name}
          </span>
        </a>

        <nav className="hidden items-center justify-end gap-8 lg:flex" aria-label="Hauptnavigation links">
          {leftNavItems.map(([label, href]) => (
            <a key={href} href={href} className={`text-sm font-medium transition ${linkClasses}`}>
              {label}
            </a>
          ))}
        </nav>

        <a
          href="#hero"
          className={`hidden min-w-[220px] text-center transition duration-300 lg:block ${
            solid ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0 pointer-events-none'
          }`}
          aria-label={`${project.name} Start`}
        >
          <span className="block font-serif text-2xl font-semibold leading-none text-ink">
            {project.name}
          </span>
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-accent2">
            {project.ortKurz}
          </span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          <nav className="flex items-center gap-8" aria-label="Hauptnavigation rechts">
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
            <Image src={company.logoSvg} width={90} height={66} alt={company.name} />
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
