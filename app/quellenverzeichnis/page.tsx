import Link from 'next/link'

export const metadata = {
  title: 'Quellenverzeichnis',
  alternates: { canonical: '/quellenverzeichnis' },
}

const achenseeImageCreditTemplate = [
  'Bildslot/Datei auf der Website',
  'Motiv oder Titel des Assets',
  'Quelle: Medien- und Presseportal Achensee Tourismus',
  'Fotocredit: © Achensee Tourismus oder der beim Asset angegebene Credit',
  'Falls zutreffend: © Karwendelmarsch',
]

export default function QuellenverzeichnisPage() {
  return (
    <main className="section-shell py-20">
      <Link href="/" className="text-sm font-semibold text-accent">
        Zurück zur Projektseite
      </Link>

      <article className="mt-10 max-w-4xl space-y-10 leading-8 text-muted">
        <div>
          <p className="eyebrow">Quellenverzeichnis</p>
          <h1 className="mt-4 font-serif text-[2.75rem] leading-tight text-ink sm:text-6xl">
            Quellen, Bildnachweise und Nutzungshinweise
          </h1>
          <p className="mt-5">
            Diese Seite sammelt Textquellen, Bildquellen und erforderliche Credits
            für die Website. Bildnachweise werden ergänzt, sobald finale Bilder
            hochgeladen und freigegeben sind.
          </p>
        </div>

        <section>
          <h2 className="font-serif text-3xl text-ink">Textquellen</h2>
          <p className="mt-4">
            Storytelling-Text: Martin Bitschnau / Hannes Obermair, Tiroler
            Urkundenbuch, II. Abteilung: Die Urkunden zur Geschichte des Inn-,
            Eisack- und Pustertals. Band 2: 1140–1200, Universitätsverlag
            Wagner, Innsbruck 2012.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-ink">Bildquellen</h2>
          <dl className="mt-4 rounded-md border border-line bg-surface p-5">
            <dt className="font-semibold text-ink">Intro-/Achensee-Bild</dt>
            <dd className="mt-2">
              Segelregatta am Achensee. Quelle: Medien- und Presseportal
              Achensee Tourismus, Ordner „Segeln“. Fotocredit: © Achensee
              Tourismus. Datei: Segelregatta am Achensee Sailing regatta at Lake
              Achensee.jpg.
            </dd>
          </dl>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-ink">
            Bilder aus dem Medien- und Presseportal Achensee Tourismus
          </h2>
          <p className="mt-4">
            Für Assets aus der Datenbank „Medien- und Presseportal Achensee
            Tourismus“ (MPAT) ist ein eindeutiger Agentur- und Urhebervermerk
            erforderlich. Als Urhebervermerk gilt laut Nutzungsbedingungen
            „Achensee Tourismus“ bzw. „© Achensee Tourismus“. Bilder aus der
            Kollektion „Karwendelmarsch“ sind mit „© Karwendelmarsch“ zu
            kennzeichnen.
          </p>
          <div className="mt-5 rounded-md border border-line bg-surface p-5">
            <p className="font-semibold text-ink">Format für künftige Bildnachweise</p>
            <ul className="mt-3 space-y-2">
              {achenseeImageCreditTemplate.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <p className="mt-5 text-sm leading-7">
            Anbieter: Tourismusverband Achensee, Achenseestraße 63, 6212 Maurach
            am Achensee, Telefon +43 5 95300-0, E-Mail info@achensee.com,
            UID ATU49900102. Die Nutzung erfolgt nach den jeweils gültigen
            Nutzungsbedingungen des MPAT; insbesondere sind Zweckbindung,
            Bearbeitungsverbote und korrekte Fotocredits zu beachten.
          </p>
        </section>
      </article>
    </main>
  )
}
