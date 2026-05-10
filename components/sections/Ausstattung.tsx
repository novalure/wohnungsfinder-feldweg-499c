'use client'

import Image from 'next/image'
import {
  BadgeCheck,
  Building2,
  Download,
  Droplets,
  Flame,
  Leaf,
  PanelsTopLeft,
  ShieldCheck,
  Trees,
  type LucideIcon,
} from 'lucide-react'
import projectConfig from '@/config/project.json'
import { Reveal } from '@/components/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import { trackPdfDownload } from '@/lib/analytics'

const features: Array<{ icon: LucideIcon; title: string; subtitle: string }> = [
  {
    icon: Building2,
    title: 'Massivbau in Ziegel und Beton',
    subtitle: 'Solide Substanz für Generationen',
  },
  {
    icon: Flame,
    title: 'Fernwärme & Fußbodenheizung',
    subtitle: 'Behagliche Wärme aus regionaler Quelle',
  },
  {
    icon: PanelsTopLeft,
    title: '3-fach-Verglasung, passivhausgeeignet',
    subtitle: 'Ug ≤ 0,5 W/m²K, ruhige Räume',
  },
  {
    icon: Leaf,
    title: 'Energieklasse A+',
    subtitle: 'fGEE 0,70 lt. Energieausweis',
  },
  {
    icon: BadgeCheck,
    title: 'Blower-Door-zertifiziert',
    subtitle: 'Geprüfte Winddichtigkeit nach OIB-RL 6',
  },
  {
    icon: Droplets,
    title: 'Markensanitär, bodengleiche Dusche',
    subtitle: 'Ausstattung nach Ausstattungslinie',
  },
  {
    icon: ShieldCheck,
    title: 'Sicherheits-Haustür, 5-fach-Verriegelung',
    subtitle: 'Inkl. Sicherheitskarte und drei Schlüsseln',
  },
  {
    icon: Trees,
    title: 'Privatgarten oder Balkon',
    subtitle: 'Eigener Freiraum für jede Einheit',
  },
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
            <h2 className="mt-4 text-balance break-words font-serif text-[2.45rem] leading-[1.02] text-ink sm:text-5xl md:text-6xl">
              Materialien, die Ruhe ausstrahlen und im Alltag bestehen.
            </h2>
            <div className="mt-6 grid gap-5 text-lg leading-8 text-muted md:grid-cols-2">
              <p>
                Massive Bauweise, hochwertige Dämmung und solide Haustechnik bilden
                die Grundlage für ein Wohngefühl, das sich wertbeständig anfühlt,
                ohne laut zu werden.
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
          {features.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="border-t border-line pt-5">
              <Icon className="h-5 w-5 text-accent2" />
              <p className="mt-3 font-semibold leading-6 text-ink">{title}</p>
              <p className="mt-1 text-sm leading-6 text-muted">{subtitle}</p>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-12 grid gap-6 md:grid-cols-2">
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-md">
              <Image
                src="/img/ausstattung-02.jpg"
                alt="Visualisierung eines Badezimmers mit bodengleicher Dusche und Holzoberflächen"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">
              Visualisierung als beispielhafte Einrichtungsidee: Die dargestellte
              Möblierung und Ausstattung zeigt eine mögliche Variante und ist nicht
              Vertragsbestandteil; die tatsächliche Einrichtung liegt in der
              Verantwortung der jeweiligen Eigentümer:innen.
            </p>
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
