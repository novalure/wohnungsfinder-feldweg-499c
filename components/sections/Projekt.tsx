'use client'

import {
  Building2,
  Download,
  Home,
  Leaf,
  Mountain,
  ParkingCircle,
  Ruler,
  type LucideIcon,
} from 'lucide-react'
import projectConfig from '@/config/project.json'
import { Reveal } from '@/components/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import { trackPdfDownload } from '@/lib/analytics'
import { ProjectGallery } from './ProjectGallery'

export function Projekt() {
  const { project, downloads } = projectConfig
  const facts: Array<[LucideIcon, string]> = [
    [Home, `${project.anzahlWohnungen} Eigentumswohnungen`],
    [Ruler, project.wohnflaecheRange],
    [Building2, project.zimmerRange],
    [Leaf, `HWB ${project.hwb}`],
    [ParkingCircle, 'Tiefgarage / Stellplätze'],
    [Mountain, 'Bergblick und Nähe zum See'],
    [Building2, `Fertigstellung ${project.fertigstellung}`],
  ]

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

        <Reveal className="mt-14 border-y border-line py-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {facts.map(([Icon, label]) => (
              <div key={String(label)} className="flex items-center gap-3 border-line xl:border-r xl:last:border-r-0">
                <Icon className="h-5 w-5 shrink-0 text-accent2" />
                <span className="text-sm font-semibold text-ink">{label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
