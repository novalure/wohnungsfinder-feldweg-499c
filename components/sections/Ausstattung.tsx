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
import { LEGAL } from '@/lib/legal-config'

const features: Array<{ icon: LucideIcon; title: string; subtitle: string }> = [
  {
    icon: Building2,
    title: 'Passivhauskonforme Massivwand',
    subtitle: 'Zusätzliches Wärmedämmsystem, u-Wert 0,15 W/m²K',
  },
  {
    icon: Flame,
    title: 'Luft-Wasser-Wärmepumpe & Fußbodenheizung',
    subtitle: 'Zentrales Wärmepumpen-System laut Energieausweis',
  },
  {
    icon: PanelsTopLeft,
    title: 'Passivhausgeeignete Fenster',
    subtitle: 'Ug ≤ 0,5 W/m²K, luftdichter Einbau nach ÖNORM B5320',
  },
  {
    icon: Leaf,
    title: LEGAL.energy.hwbShort,
    subtitle: `${LEGAL.energy.energyClass} laut Energieausweis vom ${LEGAL.energy.certificateDate}`,
  },
  {
    icon: BadgeCheck,
    title: 'Blower-Door-Test',
    subtitle: 'Winddichtigkeit nach OIB-Richtlinie 6 mit Zertifikat',
  },
  {
    icon: Droplets,
    title: 'Sanitärausstattung',
    subtitle: 'Dusche ca. 90 x 90, Waschtisch und WC',
  },
  {
    icon: ShieldCheck,
    title: 'Haustür & Sprechanlage',
    subtitle: '5-fach-Verriegelung, drei Schlüssel und Audio-Gegensprechanlage',
  },
  {
    icon: Trees,
    title: 'Terrasse/Garten oder Balkon',
    subtitle: 'EG mit Privatgarten, OG mit Balkon und Laubengang',
  },
]

const materialPanelItems: Array<{ icon: LucideIcon; label: string }> = [
  { icon: Building2, label: 'Massivwand + WDVS' },
  { icon: Flame, label: 'Wärmepumpe + Fußbodenheizung' },
  { icon: PanelsTopLeft, label: 'Fenster Ug ≤ 0,5' },
  { icon: Leaf, label: LEGAL.energy.hwbShort },
  { icon: BadgeCheck, label: 'Blower-Door-Test' },
]

export function Ausstattung() {
  const { downloads } = projectConfig

  return (
    <section id="ausstattung" className="py-28 md:py-36">
      <div className="section-shell">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <Reveal>
            <div className="relative flex min-h-[32rem] overflow-hidden rounded-md border border-line bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.92),rgba(250,247,242,0.72)_34%,rgba(47,74,58,0.72)_100%)] p-6 shadow-soft sm:aspect-[5/4] sm:min-h-0 sm:p-10">
              <div className="absolute inset-x-6 top-6 h-px bg-line/80 sm:inset-x-10 sm:top-8" />
              <div className="absolute inset-x-6 bottom-6 h-px bg-line/80 sm:inset-x-10 sm:bottom-8" />
              <div className="relative z-10 flex w-full flex-col">
                <div>
                  <p className="font-serif text-3xl leading-tight text-ink sm:text-5xl">
                    Bauweise & Material
                  </p>
                  <p className="mt-3 max-w-md text-sm leading-6 text-ink/75 sm:text-base sm:leading-7">
                    Die Bau- und Ausstattungsbeschreibung vom 17.08.2026 bildet
                    die Grundlage für Bauweise, Haustechnik und Ausführung.
                  </p>
                </div>
                <div className="mt-auto grid gap-3 pt-8 sm:grid-cols-2 sm:pt-10">
                  {materialPanelItems.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 border-t border-line/80 pt-3 text-sm font-semibold text-ink"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-accent2" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">Ausstattung</p>
            <h2 className="mt-4 text-balance break-words font-serif text-[2.45rem] leading-[1.02] text-ink sm:text-5xl md:text-6xl">
              Materialien, die Ruhe ausstrahlen und im Alltag bestehen.
            </h2>
            <div className="mt-6 grid gap-5 text-lg leading-8 text-muted md:grid-cols-2">
              <p>
                Die Ausführung sieht passivhauskonforme Massivwände mit
                zusätzlichem Wärmedämmsystem, passivhausgeeignete Fenster und
                geprüfte Winddichtigkeit per Blower-Door-Test vor.
              </p>
              <p>
                Heizung und Warmwasser erfolgen laut Energieausweis über ein
                zentrales Luft-Wasser-Wärmepumpen-System. Jede Wohnung erhält eine
                Audio-Gegensprechanlage; innen liegende Bäder oder WCs werden
                mechanisch be- und entlüftet.
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
            <ButtonLink
              href={downloads.energieausweis}
              variant="secondary"
              className="ml-0 mt-3 sm:ml-3 sm:mt-8"
              onClick={() => trackPdfDownload('Energieausweis Ausstattung', downloads.energieausweis)}
            >
              <Download size={18} />
              Energieausweis herunterladen
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
