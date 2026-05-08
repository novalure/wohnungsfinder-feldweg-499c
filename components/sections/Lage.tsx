import Image from 'next/image'
import { Car, MapPin, Mountain, Utensils } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { ConversionLinks } from '@/components/ConversionLinks'
import { LageMap } from './LageMap'

const clusters = [
  {
    title: 'Natur & Aktiv',
    image: '/img/lage-rofan-wandern.jpg',
    icon: Mountain,
    text: 'Wandern, Segeln, Skifahren und Mountainbike-Routen liegen hier nicht als Wochenendprogramm fern, sondern gehören zum direkten Umfeld.',
  },
  {
    title: 'Genuss & Kultur',
    image: '/img/lage-huetteneinkehr.jpg',
    icon: Utensils,
    text: 'Hütten, Gasthäuser, regionale Produzenten und Veranstaltungen rund um den Achensee geben dem Ort seine gewachsene Qualität.',
  },
  {
    title: 'Erreichbarkeit',
    image: '/img/lage-achenseebahn-seespitz.jpg',
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
          <h2 className="mt-4 text-balance break-words font-serif text-[2.45rem] leading-[1.02] text-ink sm:text-5xl md:text-6xl">
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
            <Reveal key={cluster.title} className="h-full" delay={index * 0.08}>
              <article className="flex h-full flex-col overflow-hidden rounded-md border border-line bg-surface">
                <div className="relative aspect-[3/2] bg-bg">
                  <Image
                    src={cluster.image}
                    alt={cluster.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 md:min-h-[290px]">
                  <cluster.icon className="h-5 w-5 text-accent2" />
                  <h3 className="mt-4 font-serif text-3xl text-ink">{cluster.title}</h3>
                  <p className="mt-3 leading-7 text-muted">{cluster.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 border-y border-line py-8">
          <div className="max-w-3xl">
            <h3 className="flex items-center gap-2 font-serif text-3xl text-ink">
              <MapPin className="h-5 w-5 text-accent2" />
              Mit dem Auto
            </h3>
            <ul className="mt-5 grid gap-3 text-muted sm:grid-cols-2">
              <li>zum See: ca. 5 km</li>
              <li>Jenbach: ca. 26,5 km</li>
              <li>Innsbruck: ca. 58 km</li>
              <li>München: ca. 83 km</li>
              <li>Flughafen München: ca. 119 km</li>
              <li>Tegernsee: ca. 31 km</li>
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
