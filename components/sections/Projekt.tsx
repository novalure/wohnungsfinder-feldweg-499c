'use client'

import { BedDouble, Download, Home, Leaf, Ruler, type LucideIcon } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import { trackPdfDownload } from '@/lib/analytics'
import { ProjectGallery } from './ProjectGallery'
import projectConfig from '@/config/project.json'

const facts: Array<{ icon: LucideIcon; title: string; subline: string }> = [
  {
    icon: Home,
    title: '6',
    subline: 'Eigentumswohnungen',
  },
  {
    icon: Ruler,
    title: '57–65 m²',
    subline: 'Wohnfläche',
  },
  {
    icon: BedDouble,
    title: '2 Zimmer',
    subline: 'Schlafzimmer + Wohnküche',
  },
  {
    icon: Leaf,
    title: 'Energieklasse A/B',
    subline: 'HWB 44 · fGEE 0,70',
  },
]

export function Projekt() {
  const { downloads } = projectConfig

  return (
    <section id="projekt" className="border-y border-line bg-surface py-28 md:py-36">
      <div className="section-shell">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Projekt</p>
          <h2 className="mt-4 text-balance break-words font-serif text-[2.45rem] leading-[1.02] text-ink sm:text-5xl md:text-6xl">
            Ein kleines Ensemble mit klarem Anspruch.
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted">
            Sechs Eigentumswohnungen, bewusst proportioniert und auf ein
            hochwertiges Wohnen in Tirol ausgerichtet. Die Planung setzt auf
            helle Räume, private Freiflächen und eine Architektur, die sich
            ruhig in den alpinen Kontext einfügt.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal>
            <div className="space-y-5 text-lg leading-8 text-muted">
              <p>
                Der Wohnbau verbindet reduzierte Linien mit warmen Oberflächen und
                solider Bauqualität. Jede Einheit ist auf dauerhafte Nutzbarkeit
                ausgelegt: Kompakte Wege, gut möblierbare Räume, Außenflächen für
                Morgenkaffee, Abendlicht und stille Stunden.
              </p>
              <p>
                Käufer:innen erhalten eine überschaubare Projektgröße mit persönlicher
                Betreuung, transparenten Unterlagen und klaren Entscheidungswegen.
              </p>
              <p className="text-base leading-7 text-muted/85">
                Innenvisualisierungen zeigen beispielhafte Einrichtungsvorschläge
                und Stimmungen; Ausführung, Ausstattung und Möblierung richten sich
                nach den finalen Vertragsunterlagen und können ohne Gewähr
                abweichen.
              </p>
            </div>
            <ButtonLink
              href={downloads.expose}
              className="mt-8"
              onClick={() => trackPdfDownload('Expose Projekt', downloads.expose)}
            >
              <Download size={18} />
              Exposé herunterladen
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.1}>
            <ProjectGallery />
          </Reveal>
        </div>

        <Reveal className="mt-14 border-y border-line py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {facts.map(({ icon: Icon, title, subline }, index) => (
              <div
                key={title}
                className={`flex min-h-[9.5rem] flex-col items-center justify-center gap-3 px-3 py-6 text-center sm:min-h-40 sm:px-6 lg:min-h-28 lg:flex-row lg:justify-start lg:gap-4 lg:px-10 lg:py-5 lg:text-left ${
                  index % 2 === 1 ? '' : 'border-r border-line'
                } ${index > 1 ? 'border-t border-line lg:border-t-0' : ''} ${
                  index < 3 ? 'lg:border-r lg:border-line' : 'lg:border-r-0'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0 text-accent2" />
                <div className="min-w-0">
                  <p className="text-balance break-words text-xl font-bold leading-tight text-ink lg:text-xl">{title}</p>
                  <p className="mt-2 text-balance break-words text-base leading-snug text-muted lg:mt-1 lg:text-sm lg:leading-5">{subline}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
