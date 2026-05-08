'use client'

import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { useState } from 'react'
import projectConfig from '@/config/project.json'
import { Reveal } from '@/components/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import { ConversionLinks } from '@/components/ConversionLinks'

const trustBadges = [
  {
    src: '/logos/grasl.svg',
    alt: 'GRASL Immobilien',
  },
  {
    src: '/logos/immobilientreuhaender.svg',
    alt: 'Beh. konz. Immobilientreuhänder',
  },
  {
    src: '/logos/sachverstaendiger.svg',
    alt: 'Allg. beeideter & gerichtlich zertifizierter Sachverständiger',
  },
  {
    src: '/logos/oevi.svg',
    alt: 'ÖVI – Österreichischer Verband der Immobilienwirtschaft',
  },
]

export function Bautraeger() {
  const { company, contact } = projectConfig

  return (
    <section id="bautraeger" className="border-y border-line bg-surface py-28 md:py-36">
      <div className="section-shell">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <Reveal>
            <p className="eyebrow">Exklusiver Vertriebspartner</p>
            <h2 className="mt-4 text-balance break-words font-serif text-[2.45rem] leading-[1.02] text-ink sm:text-5xl md:text-6xl">
              GRASL Immobilien — Ihr Begleiter aus Schwaz.
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-8 text-muted">
              <p>
                Den Vertrieb der Wohnanlage am Feldweg übernimmt GRASL Immobilien
                aus Schwaz. Als behördlich konzessionierter Immobilientreuhänder
                und allgemein beeideter Sachverständiger für Immobilienbewertung
                begleiten wir Sie persönlich – von der ersten Besichtigung bis zur
                Schlüsselübergabe.
              </p>
              <p>
                Neben der Vermittlung bieten wir alle Leistungen rund um Ihren
                Immobilienkauf aus einer Hand: Liegenschaftsbewertung,
                Finanzierungsberatung, Vertragsservice und Energieausweis. Ein
                Ansprechpartner, klare Zuständigkeiten.
              </p>
            </div>
            <ButtonLink
              href="https://www.grasl-immobilien.at/de"
              className="mt-8"
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={17} />
              GRASL Immobilien kennenlernen
            </ButtonLink>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-md border border-line bg-bg p-4 sm:p-6">
              <div className="logo-carousel">
                <div className="logo-carousel-set">
                  {trustBadges.map((badge) => (
                    <TrustBadge key={badge.src} src={badge.src} alt={badge.alt} />
                  ))}
                </div>
                <div className="logo-carousel-set" aria-hidden="true">
                  {trustBadges.map((badge) => (
                    <TrustBadge key={`${badge.src}-clone`} src={badge.src} alt={badge.alt} />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-muted">
              {company.name} · Münchner Straße 11 / 2. Stock,{' '}
              <span className="block whitespace-nowrap sm:inline">A-6130 Schwaz</span>
              {' '}· Tel. {contact.telefonDisplay}
            </p>
            <ConversionLinks className="mt-8" />
          </Reveal>
        </div>

      </div>
    </section>
  )
}

function TrustBadge({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="flex h-20 min-w-0 items-center justify-center rounded-sm border border-line bg-surface px-3 py-3">
      {failed ? (
        <span className="text-center text-xs font-semibold leading-5 text-muted">{alt}</span>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={140}
          height={80}
          className="max-h-12 w-auto max-w-[140px] object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
