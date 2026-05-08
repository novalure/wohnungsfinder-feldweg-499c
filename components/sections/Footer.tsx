'use client'

import Image from 'next/image'
import Link from 'next/link'
import projectConfig from '@/config/project.json'

export function Footer() {
  const { project, company, contact } = projectConfig

  return (
    <footer className="bg-ink py-14 text-white">
      <div className="section-shell grid gap-10 md:grid-cols-3">
        <div>
          <p className="break-words font-serif text-3xl sm:text-4xl">{project.name}</p>
          <p className="mt-3 leading-7 text-white/70">{project.address}</p>
          <div className="mt-6 flex items-center gap-4">
            <ProjectWordmark />
            <Image src="/img/logo_weiss_grasl.png" width={92} height={67} alt={company.name} />
          </div>
        </div>
        <div>
          <p className="font-semibold">Kontakt</p>
          <div className="mt-4 grid gap-2 text-white/72">
            <p>{company.address}</p>
            <a href={`tel:${contact.telefon}`} className="hover:text-white">
              {contact.telefonDisplay}
            </a>
            {contact.mobil && contact.mobilDisplay && (
              <a href={`tel:${contact.mobil}`} className="hover:text-white">
                {contact.mobilDisplay}
              </a>
            )}
            <a href={`mailto:${contact.email}`} className="hover:text-white">
              {contact.email}
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
              className="w-fit text-left hover:text-white"
              onClick={() => {
                window.dispatchEvent(new Event('cookie-consent:open'))
              }}
            >
              Cookie-Einstellungen öffnen
            </button>
          </div>
        </div>
      </div>
      <div className="section-shell mt-10 border-t border-white/15 pt-6 text-xs leading-6 text-white/60">
        <p>
          Bei erfolgreichem Vertragsabschluss fällt eine Provision von 3 % des
          Kaufpreises zzgl. 20 % USt an, gemäß Immobilienmaklerverordnung BGBl.
          262 und 297/1996. Diese Provision gilt auch bei Weitergabe der
          Informationen an Dritte.
        </p>
        <p className="mt-4">
          © {new Date().getFullYear()} {company.name}. Website-Umsetzung:{' '}
          <a
            href="https://www.novalure.eu"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-white"
          >
            Novalure CLG
          </a>
          , 20 Harcourt Street, Dublin 2, D02 H364, Ireland, Registration number:
          796735, hello@novalure.eu.
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
