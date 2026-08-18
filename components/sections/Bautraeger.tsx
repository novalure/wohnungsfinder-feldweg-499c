'use client'

import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { useState } from 'react'
import projectConfig from '@/config/project.json'
import { Reveal } from '@/components/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import { ConversionLinks } from '@/components/ConversionLinks'

type TrustBadgeItem =
  | {
      src: string
      alt: string
      label?: never
    }
  | {
      label: string
      src?: never
      alt?: never
    }

const trustBadges: TrustBadgeItem[] = [
  {
    src: '/logos/grasl-immobilien.png',
    alt: 'GRASL Immobilien',
  },
  {
    src: '/logos/sachverstaendiger.svg',
    alt: 'Allgemein beeideter und gerichtlich zertifizierter Sachverständiger',
  },
  {
    label: 'Logo folgt',
  },
  {
    label: 'Logo folgt',
  },
]

export function Bautraeger() {
  const { company, contact, bautraeger } = projectConfig

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
              <p>
                Bauwerber und Grundeigentümer des Projekts ist laut Bau- und
                Ausstattungsbeschreibung die {bautraeger.name},{' '}
                {bautraeger.address}.
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
                  {trustBadges.map((badge, index) => (
                    <TrustBadge key={badge.src ?? `placeholder-${index}`} badge={badge} />
                  ))}
                </div>
                <div className="logo-carousel-set" aria-hidden="true">
                  {trustBadges.map((badge, index) => (
                    <TrustBadge key={`${badge.src ?? `placeholder-${index}`}-clone`} badge={badge} />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-muted">
              {company.name} · Münchner Straße 11 / 2. Stock,{' '}
              <span className="whitespace-nowrap">A-6130 Schwaz · Tel. {contact.telefonDisplay}</span>
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              {bautraeger.role}: {bautraeger.name}, {bautraeger.address}.
            </p>
            <ConversionLinks className="mt-8" />
          </Reveal>
        </div>

      </div>
    </section>
  )
}

function TrustBadge({ badge }: { badge: TrustBadgeItem }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="flex h-20 min-w-0 items-center justify-center rounded-sm border border-line bg-white px-2 py-3 sm:px-3">
      {'label' in badge || failed ? (
        <span className="text-center text-sm font-medium leading-none text-muted">
          {badge.label ?? 'Logo folgt'}
        </span>
      ) : (
        <Image
          src={badge.src}
          alt={badge.alt}
          width={180}
          height={120}
          className="max-h-14 w-auto max-w-[160px] object-contain"
          onError={() => setFailed(true)}
          unoptimized={badge.src.endsWith('.svg')}
        />
      )}
    </div>
  )
}
