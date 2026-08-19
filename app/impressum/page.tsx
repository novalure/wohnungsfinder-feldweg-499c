import Link from 'next/link'
import { LEGAL, PROVISION_TEXT } from '@/lib/legal-config'

export const metadata = {
  title: 'Impressum',
  alternates: { canonical: '/impressum' },
  robots: { index: false, follow: true },
}

export default function ImpressumPage() {
  return (
    <main className="section-shell py-20">
      <Link href="/" className="text-sm font-semibold text-accent">
        Zurück zur Projektseite
      </Link>

      <article className="mt-10 max-w-3xl space-y-8 leading-8 text-muted">
        <div>
          <p className="eyebrow">Impressum</p>
          <h1 className="mt-4 font-serif text-[2.75rem] leading-tight text-ink sm:text-6xl">
            Impressum
          </h1>
          <p className="mt-4 text-lg">
            Angaben nach § 5 ECG, § 14 UGB und § 25 Mediengesetz
          </p>
        </div>

        <section>
          <h2 className="font-serif text-3xl text-ink">
            Medieninhaber, Diensteanbieter und inhaltlich Verantwortlicher
          </h2>
          <p className="mt-4">
            {LEGAL.controller.name}
            <br />
            Geschäftsbezeichnung: {LEGAL.controller.businessDesignation}
            <br />
            {LEGAL.controller.officeName}
            <br />
            {LEGAL.controller.street}, {LEGAL.controller.city},{' '}
            {LEGAL.controller.country}
          </p>
          <ul className="mt-4 space-y-1">
            <li>- Rechtsform: Einzelunternehmen</li>
            <li>- Medieninhaber / Inhaber: {LEGAL.controller.name}</li>
            <li>- UID-Nr.: {LEGAL.controller.uid}</li>
            <li>- GISA-Zahl: {LEGAL.controller.gisa}</li>
            <li>
              - Telefon: {LEGAL.controller.phone} · Mobil: {LEGAL.controller.mobile}
            </li>
            <li>
              - E-Mail: {LEGAL.controller.email} · Web:{' '}
              {LEGAL.controller.webDisplay}
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-ink">Unternehmensgegenstand</h2>
          <p className="mt-4">
            Liegenschaftsbewertung, Immobilienvermittlung, Hausverwaltung. Allgemein
            beeideter und gerichtlich zertifizierter Sachverständiger für
            Immobilienbewertung.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-ink">Berufsrechtliche Angaben</h2>
          <ul className="mt-4 space-y-1">
            <li>
              - Berufsbezeichnung: Immobilientreuhänder gemäß § 94 Z 35 GewO
              1994, eingeschränkt auf Immobilienmakler und Immobilienverwalter,
              verliehen in Österreich
            </li>
            <li>
              - Fachgruppe: Immobilien- und Vermögenstreuhänder, Wirtschaftskammer
              Tirol
            </li>
            <li>
              - Anwendbare Vorschriften: GewO 1994, Maklergesetz (MaklerG),
              Standes- und Ausübungsregeln für Immobilienmakler,
              Immobilienmaklerverordnung (jeweils geltende Fassung,
              www.ris.bka.gv.at)
            </li>
            <li>- Behörde gem. ECG / Aufsicht: {LEGAL.controller.authority}</li>
            <li>- Mitgliedschaft: ÖVI – Österreichischer Verband der Immobilienwirtschaft</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-ink">
            Technische Umsetzung und Betrieb
          </h2>
          <p className="mt-4">
            Technische Konzeption, Umsetzung und laufender Betrieb dieser Website
            erfolgen im Auftrag und nach Weisung des Medieninhabers durch{' '}
            {LEGAL.processor.name}, {LEGAL.processor.address} (CRO{' '}
            {LEGAL.processor.cro}, VAT {LEGAL.processor.vat},{' '}
            {LEGAL.processor.email}). NovaLure CLG ist ausschließlich
            Auftragsverarbeiterin i. S. d. Art. 28 DSGVO und tritt selbst nicht als
            Immobilienvermittlerin auf. Die inhaltliche und vermittlungsbezogene
            Verantwortung liegt allein beim Medieninhaber.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-ink">Provision</h2>
          <p className="mt-4">{PROVISION_TEXT}</p>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-ink">Online-Streitbeilegung</h2>
          <p className="mt-4">
            OS-Plattform der EU-Kommission: https://ec.europa.eu/consumers/odr/.
            Wir sind nicht verpflichtet und nicht bereit, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-ink">Haftung & Urheberrecht</h2>
          <p className="mt-4">
            Alle Angaben ohne Gewähr; Änderungen, Irrtümer und Zwischenverkauf
            vorbehalten. Visualisierungen sind beispielhaft und nicht
            Vertragsbestandteil; maßgeblich sind die finalen Vertrags- und
            Ausstattungsunterlagen. Für Inhalte externer Links haftet der jeweilige
            Anbieter. Inhalte dieser Website unterliegen dem österreichischen
            Urheberrecht.
          </p>
        </section>
      </article>
    </main>
  )
}
