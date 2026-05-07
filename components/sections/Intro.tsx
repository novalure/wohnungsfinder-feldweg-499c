import Image from 'next/image'
import { Mountain } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { ConversionLinks } from '@/components/ConversionLinks'

export function Intro() {
  return (
    <section id="intro" className="py-28 md:py-40">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:items-center">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-md">
            <Image
              src="/img/intro-vertikal.jpg"
              alt="Ruhige Achensee-Stimmung mit Bergen und Wasser"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="max-w-reading">
            <p className="eyebrow">Ankommen am Achensee</p>
            <h2 className="mt-4 font-serif text-5xl leading-tight text-ink md:text-6xl">
              Wo Wasser, Wald und Karwendel den Alltag leiser machen.
            </h2>
            <div className="my-8 flex items-center gap-4 text-accent2">
              <span className="h-px w-16 bg-line" />
              <Mountain size={20} />
              <span className="h-px flex-1 bg-line" />
            </div>
            <div className="space-y-5 text-lg leading-8 text-muted">
              <p>
                Am Achensee entsteht ein kleines Wohnensemble für Menschen, die
                Rückzug und Qualität nicht als Gegensätze verstehen. Die Architektur
                bleibt ruhig, die Materialien sind bewusst gewählt, die Umgebung
                spricht für sich.
              </p>
              <p>
                Morgens liegt das Licht über dem Wasser, mittags öffnen sich Wege in
                Richtung Karwendel und Rofan, abends wird der Blick auf die Berge zum
                selbstverständlichen Teil des Wohnens.
              </p>
              <p>
                Sechs Eigentumswohnungen schaffen einen privaten Rahmen mit klarer
                Planung, hochwertiger Ausstattung und kurzen Wegen zu See, Natur und
                regionaler Infrastruktur.
              </p>
            </div>
            <ConversionLinks className="mt-8" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
