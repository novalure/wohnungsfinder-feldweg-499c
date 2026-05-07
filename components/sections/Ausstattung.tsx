'use client'

import Image from 'next/image'
import {
  BatteryCharging,
  Blinds,
  Download,
  Home,
  Layers,
  Sparkles,
  ThermometerSun,
  Waves,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import projectConfig from '@/config/project.json'
import { Reveal } from '@/components/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import { trackPdfDownload } from '@/lib/analytics'

const features: Array<[LucideIcon, string]> = [
  [Layers, 'Eichenparkett / Naturholzböden'],
  [ThermometerSun, 'Fußbodenheizung mit Wärmepumpe'],
  [Home, 'Dreifach-isolierverglaste Holz-Alu-Fenster'],
  [Blinds, 'Elektrische Beschattung'],
  [Waves, 'Markensanitär nach Ausstattungslinie'],
  [Zap, 'Smart-Home-Vorbereitung'],
  [BatteryCharging, 'E-Ladepunkte in der Tiefgarage'],
  [Sparkles, 'Lift in alle Etagen'],
]

export function Ausstattung() {
  const { downloads } = projectConfig

  return (
    <section id="ausstattung" className="py-28 md:py-36">
      <div className="section-shell">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <Reveal>
            <div className="relative aspect-[5/4] overflow-hidden rounded-md">
              <Image
                src="/img/ausstattung-01.jpg"
                alt="Hochwertiges Materialdetail einer alpin-eleganten Wohnung"
                fill
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">Ausstattung</p>
            <h2 className="mt-4 font-serif text-5xl leading-tight text-ink md:text-6xl">
              Materialien, die Ruhe ausstrahlen und im Alltag bestehen.
            </h2>
            <div className="mt-6 grid gap-5 text-lg leading-8 text-muted md:grid-cols-2">
              <p>
                Naturholz, helle Oberflächen und solide Haustechnik bilden die
                Grundlage für ein Wohngefühl, das sich hochwertig anfühlt, ohne laut
                zu werden.
              </p>
              <p>
                Die Ausführung ist auf Komfort, Energieeffizienz und langfristige
                Werthaltigkeit ausgerichtet. Details werden in der Bau- und
                Ausstattungsbeschreibung final festgelegt.
              </p>
            </div>
            <ButtonLink
              href={downloads.bab}
              className="mt-8"
              onClick={() => trackPdfDownload('BAB Ausstattung', downloads.bab)}
            >
              <Download size={18} />
              Bau- und Ausstattungsbeschreibung herunterladen
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(([Icon, label]) => (
            <div key={String(label)} className="border-t border-line pt-5">
              <Icon className="h-5 w-5 text-accent2" />
              <p className="mt-3 font-semibold leading-6 text-ink">{label}</p>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-md">
            <Image
              src="/img/ausstattung-02.jpg"
              alt="Detailfoto Bad und hochwertige Oberflächen"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex items-center border-y border-line py-8">
            <p className="font-serif text-3xl leading-tight text-ink">
              Reduzierte Formensprache, langlebige Komponenten und ein Farbklima,
              das den Bezug zur Landschaft aufnimmt.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
