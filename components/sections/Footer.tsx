'use client'

import Image from 'next/image'
import Link from 'next/link'
import projectConfig from '@/config/project.json'

export function Footer() {
  const { project, company, contact, bautraeger } = projectConfig

  return (
    <footer className="bg-ink py-14 text-white">
      <div className="section-shell grid gap-10 md:grid-cols-3">
        <div>
          <p className="break-words font-serif text-3xl sm:text-4xl">{project.name}</p>
          <p className="mt-3 leading-7 text-white/70">{project.address}</p>
          <div className="mt-6 flex items-center gap-4">
            <Image src={bautraeger.logo} width={130} height={48} alt={bautraeger.name} />
            <Image src="/img/logo_weiss_grasl.png" width={92} height={67} alt={company.name} />
          </div>
        </div>
        <div>
          <p className="font-semibold">Kontakt</p>
          <div className="mt-4 grid gap-2 text-white/72">
            <a href={`tel:${contact.telefon}`} className="hover:text-white">
              {contact.telefonDisplay}
            </a>
            <a href={`tel:${contact.mobil}`} className="hover:text-white">
              {contact.mobilDisplay}
            </a>
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
            <button
              type="button"
              className="w-fit text-left hover:text-white"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('cookie-consent')
                  window.location.reload()
                }
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
        <div className="mt-5 max-w-4xl">
          <p className="font-semibold text-white/75">Quellenverzeichnis</p>
          <p className="mt-2 break-words">
            Storytelling-Text: Martin Bitschnau / Hannes Obermair, Tiroler
            Urkundenbuch, II. Abteilung: Die Urkunden zur Geschichte des Inn-,
            Eisack- und Pustertals. Band 2: 1140–1200, Universitätsverlag
            Wagner, Innsbruck 2012.
          </p>
        </div>
        <p className="mt-4">
          © {new Date().getFullYear()} {company.name}. Website-Konzept und Umsetzung
          für Immobilienmarketing.
        </p>
      </div>
    </footer>
  )
}
