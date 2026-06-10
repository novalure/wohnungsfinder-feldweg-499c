'use client'

import Image from 'next/image'
import Link from 'next/link'
import { LEGAL, PROVISION_TEXT } from '@/lib/legal-config'
import { openConsentSettings } from '@/lib/consent'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink py-14 text-white">
      <div className="section-shell grid gap-10 md:grid-cols-3">
        <div>
          <p className="break-words font-serif text-3xl sm:text-4xl">
            {LEGAL.project.name}
          </p>
          <p className="mt-3 leading-7 text-white/70">{LEGAL.project.address}</p>
          <div className="mt-6 flex items-center gap-4">
            <ProjectWordmark />
            <Image
              src="/img/logo_weiss_grasl.png"
              width={92}
              height={67}
              alt={LEGAL.controller.name}
            />
          </div>
        </div>

        <div>
          <p className="font-semibold">Kontakt GRASL</p>
          <div className="mt-4 grid gap-2 text-white/72">
            <p>
              {LEGAL.controller.name}
              <br />
              {LEGAL.controller.street}
              <br />
              {LEGAL.controller.city}, {LEGAL.controller.country}
            </p>
            <a href={`tel:${LEGAL.controller.phoneHref}`} className="hover:text-white">
              {LEGAL.controller.phone}
            </a>
            <a href={`tel:${LEGAL.controller.mobileHref}`} className="hover:text-white">
              {LEGAL.controller.mobile}
            </a>
            <a href={`mailto:${LEGAL.controller.email}`} className="hover:text-white">
              {LEGAL.controller.email}
            </a>
          </div>
        </div>

        <div>
          <p className="font-semibold">Rechtliches</p>
          <div className="mt-4 grid gap-2 text-white/72">
            <Link href="/datenschutz" className="hover:text-white">
              Datenschutz
            </Link>
            <Link href="/impressum" className="hover:text-white">
              Impressum
            </Link>
            <Link href="/quellenverzeichnis" className="hover:text-white">
              Quellenverzeichnis
            </Link>
            <Link href="/cookie-richtlinie" className="hover:text-white">
              Cookie-Richtlinie
            </Link>
            <button
              type="button"
              className="w-fit text-left underline-offset-4 hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              onClick={openConsentSettings}
            >
              Cookie-Einstellungen öffnen
            </button>
          </div>
        </div>
      </div>

      <div className="section-shell mt-10 border-t border-white/15 pt-6 text-xs leading-6 text-white/60">
        <p>{PROVISION_TEXT}</p>
        <p className="mt-4">
          © {year} {LEGAL.controller.name}. Website-Umsetzung und technischer Betrieb
          (Auftragsverarbeiter gem. Art. 28 DSGVO): {LEGAL.processor.name},{' '}
          {LEGAL.processor.address}.
        </p>
      </div>
    </footer>
  )
}

function ProjectWordmark() {
  return (
    <span className="block font-serif text-[1.5rem] font-semibold uppercase leading-[0.82] text-white">
      <span className="block">Vallis</span>
      <span className="block">Achen</span>
      <span className="block">Residenzen</span>
    </span>
  )
}
