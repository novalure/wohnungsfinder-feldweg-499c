import Image from 'next/image'
import { Bike, Car, MapPin, Mountain, Utensils } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { ConversionLinks } from '@/components/ConversionLinks'
import { LageMap } from './LageMap'

const clusters = [
  {
    title: 'Natur & Aktiv',
    image: '/img/lage-natur.jpg',
    icon: Mountain,
    text: 'Wandern, Segeln, Skifahren und Mountainbike-Routen liegen hier nicht als Wochenendprogramm fern, sondern gehören zum direkten Umfeld.',
  },
  {
    title: 'Genuss & Kultur',
    image: '/img/lage-genuss.jpg',
    icon: Utensils,
    text: 'Hütten, Gasthäuser, regionale Produzenten und Veranstaltungen rund um den Achensee geben dem Ort seine gewachsene Qualität.',
  },
  {
    title: 'Erreichbarkeit',
    image: '/img/lage-erreichbarkeit.jpg',
    icon: Car,
    text: 'Innsbruck, München und Salzburg bleiben gut erreichbar. Jenbach bindet die Region zusätzlich an Bahnverbindungen an.',
  },
]

export function Lage() {
  return (
    <section id="lage" className="py-28 md:py-36">
      <div className="section-shell">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Lage & Umgebung</p>
          <h2 className="mt-4 font-serif text-5xl leading-tight text-ink md:text-6xl">
            Achensee vor der Tür, Karwendel im Blick.
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted">
            Die Lage verbindet alpine Ruhe mit guter Anbindung. Seeufer, Wege in die
            Berge und regionale Infrastruktur sind schnell erreichbar.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <LageMap />
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {clusters.map((cluster, index) => (
            <Reveal key={cluster.title} delay={index * 0.08}>
              <article className="overflow-hidden rounded-md border border-line bg-surface">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={cluster.image}
                    alt={cluster.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <cluster.icon className="h-5 w-5 text-accent2" />
                  <h3 className="mt-4 font-serif text-3xl text-ink">{cluster.title}</h3>
                  <p className="mt-3 leading-7 text-muted">{cluster.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 grid gap-8 border-y border-line py-8 md:grid-cols-2">
          <div>
            <h3 className="flex items-center gap-2 font-serif text-3xl text-ink">
              <Bike className="h-5 w-5 text-accent2" />
              Zu Fuß
            </h3>
            <ul className="mt-5 space-y-3 text-muted">
              <li>Seeufer Achensee: {'{{DISTANZ_SEEUFER_FUSS}}'}</li>
              <li>Nahversorgung: {'{{DISTANZ_NAHVERSORGUNG_FUSS}}'}</li>
              <li>Bus: {'{{DISTANZ_BUS_FUSS}}'}</li>
            </ul>
          </div>
          <div>
            <h3 className="flex items-center gap-2 font-serif text-3xl text-ink">
              <MapPin className="h-5 w-5 text-accent2" />
              Mit dem Auto
            </h3>
            <ul className="mt-5 space-y-3 text-muted">
              <li>Jenbach: {'{{DISTANZ_JENBACH_AUTO}}'}</li>
              <li>Innsbruck: {'{{DISTANZ_INNSBRUCK_AUTO}}'}</li>
              <li>München: {'{{DISTANZ_MUENCHEN_AUTO}}'}</li>
            </ul>
          </div>
        </Reveal>
        <Reveal>
          <ConversionLinks className="mt-8" />
        </Reveal>
      </div>
    </section>
  )
}
