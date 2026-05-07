import Image from 'next/image'
import { ExternalLink, ShieldCheck } from 'lucide-react'
import projectConfig from '@/config/project.json'
import { Reveal } from '@/components/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import { ConversionLinks } from '@/components/ConversionLinks'

const references = [
  ['/img/referenz-01.jpg', 'Referenzprojekt mit ruhiger Wohnarchitektur'],
  ['/img/referenz-02.jpg', 'Referenzprojekt in alpinem Kontext'],
  ['/img/referenz-03.jpg', 'Detail eines realisierten Wohnprojekts'],
]

export function Bautraeger() {
  const { bautraeger, company } = projectConfig

  return (
    <section id="bautraeger" className="border-y border-line bg-surface py-28 md:py-36">
      <div className="section-shell">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <p className="eyebrow">Bauträger</p>
            <h2 className="mt-4 text-balance break-words font-serif text-[2.45rem] leading-[1.02] text-ink sm:text-5xl md:text-6xl">
              Verlässlichkeit, klare Zuständigkeiten, persönliche Begleitung.
            </h2>
            <div className="mt-8 rounded-md border border-line bg-bg p-6">
              <Image src={bautraeger.logo} width={180} height={64} alt={bautraeger.name} />
              <p className="mt-5 leading-7 text-muted">
                {bautraeger.name} steht als Bauträger für die Umsetzung des
                Projekts. Unterlagen, Ausstattungsdetails und Verfügbarkeiten werden
                im Vertrieb transparent aufbereitet.
              </p>
              <ButtonLink href={bautraeger.url} variant="secondary" className="mt-5">
                <ExternalLink size={17} />
                Bauträger ansehen
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid gap-4 md:grid-cols-3">
              {references.map(([src, alt]) => (
                <div key={src} className="relative aspect-[4/5] overflow-hidden rounded-md">
                  <Image src={src} alt={alt} fill sizes="(min-width: 768px) 24vw, 100vw" className="object-cover" />
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-start">
              <Image src={company.logoSvg} width={104} height={76} alt={company.name} />
              <div>
                <h3 className="flex items-center gap-2 font-serif text-3xl text-ink">
                  <ShieldCheck className="h-5 w-5 text-accent2" />
                  Vertrieb durch {company.name}
                </h3>
                <p className="mt-3 leading-7 text-muted">
                  {company.address}. USt- und firmenbuchrelevante Angaben werden in
                  den zentralen Projektdaten gepflegt und im Impressum ausgespielt.
                </p>
              </div>
            </div>
            <ConversionLinks className="mt-8" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
