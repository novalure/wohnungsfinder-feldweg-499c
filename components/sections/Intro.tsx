import Image from 'next/image'
import { Mountain } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { ConversionLinks } from '@/components/ConversionLinks'

export function Intro() {
  return (
    <section id="intro" className="py-28 md:py-40">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:items-center">
        <Reveal className="order-2 lg:order-1">
          <figure className="rounded-md">
            <Image
              src="/img/achensee-segelregatta.jpg"
              alt="Segelregatta am Achensee mit Blick auf Wasser und Berge"
              width={5280}
              height={2970}
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="h-auto w-full rounded-md border border-line bg-surface"
            />
          </figure>
        </Reveal>
        <Reveal className="order-1 lg:order-2" delay={0.1}>
          <div className="max-w-reading">
            <p className="eyebrow">Vallis Achen Residenzen</p>
            <h2 className="mt-4 text-balance break-words font-serif text-[2.45rem] leading-[1.02] text-ink sm:text-5xl md:text-6xl">
              Eine Adresse mit über 800 Jahren tirolischer Talgeschichte.
            </h2>
            <div className="my-8 flex items-center gap-4 text-accent2">
              <span className="h-px w-16 bg-line" />
              <Mountain size={20} />
              <span className="h-px flex-1 bg-line" />
            </div>
            <div className="space-y-5 text-lg leading-8 text-muted">
              <p>
                Das Achental gehört zu den ältesten urkundlich dokumentierten
                Tälern Tirols. Bereits um 1140 hielten lateinische
                Schenkungsurkunden des Klosters St. Georgenberg-Fiecht das Gebiet
                rund um den heutigen Achensee fest - jene Urkundentradition, in
                der das Tal später als „Vallis Achen“ überliefert wurde.
              </p>
              <p>
                Mit den Vallis Achen Residenzen kehrt dieser historische Name
                zurück an seinen Ursprungsort: ins Herz von Achenkirch, dorthin,
                wo die dokumentierte Geschichte der Region ihren Anfang nahm.
              </p>
              <p>
                Eine Adresse mit über 800 Jahren tirolischer Talgeschichte.
              </p>
            </div>
            <ConversionLinks className="mt-8" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
