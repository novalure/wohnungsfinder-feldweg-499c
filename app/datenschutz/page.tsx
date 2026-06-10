import Link from 'next/link'
import { LEGAL } from '@/lib/legal-config'

export const metadata = {
  title: 'Datenschutz',
  alternates: { canonical: '/datenschutz' },
}

export default function DatenschutzPage() {
  return (
    <main className="section-shell py-20">
      <Link href="/" className="text-sm font-semibold text-accent">
        Zurück zur Projektseite
      </Link>

      <article className="mt-10 max-w-3xl space-y-8 leading-8 text-muted">
        <div>
          <p className="eyebrow">Datenschutz</p>
          <h1 className="mt-4 font-serif text-[2.75rem] leading-tight text-ink sm:text-6xl">
            Datenschutzerklärung
          </h1>
        </div>

        <section>
          <h2 className="font-serif text-3xl text-ink">1. Verantwortlicher</h2>
          <p className="mt-4">
            {LEGAL.controller.name}, {LEGAL.controller.street},{' '}
            {LEGAL.controller.city}, {LEGAL.controller.country}.{' '}
            {LEGAL.controller.email}, {LEGAL.controller.phone}. Über Zweck und
            Mittel der Verarbeitung im Rahmen der Immobilienvermittlung entscheidet
            ausschließlich der Verantwortliche.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-ink">
            2. Auftragsverarbeitung (technischer Betrieb)
          </h2>
          <p className="mt-4">
            Betrieb der Website, Entgegennahme der Formularanfragen und technische
            Weiterleitung an den Verantwortlichen erfolgen durch {LEGAL.processor.name},{' '}
            {LEGAL.processor.address} ({LEGAL.processor.email}). NovaLure handelt
            ausschließlich als Auftragsverarbeiterin (Art. 28 DSGVO) auf Grundlage
            eines schriftlichen AVV und ausschließlich nach Weisung des
            Verantwortlichen. Eine Nutzung Ihrer Daten zu eigenen Zwecken erfolgt
            nicht.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-ink">
            3. Verarbeitung bei Kontaktaufnahme
          </h2>
          <p className="mt-4">
            Bei Nutzung des Kontaktformulars bzw. Kontakt per E-Mail/Telefon
            verarbeiten wir Anrede, Name, E-Mail, Telefon, Objektinteresse und
            Nachricht zur Bearbeitung Ihrer Anfrage und für Anschlussfragen.
          </p>
          <ul className="mt-4 space-y-1">
            <li>
              - Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche
              Maßnahmen) bzw. lit. f (berechtigtes Interesse an
              Anfragebeantwortung).
            </li>
            <li>- Eine gesonderte Einwilligung ist hierfür nicht erforderlich.</li>
            <li>
              - Speicherdauer: bis zur abschließenden Bearbeitung, darüber hinaus im
              Rahmen gesetzlicher Aufbewahrungspflichten {LEGAL.dataRetention}.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-ink">4. Empfänger</h2>
          <p className="mt-4">
            Verantwortlicher (GRASL); {LEGAL.processor.name} (IE) als
            Auftragsverarbeiter; Hosting: {LEGAL.hosting.provider} (Region{' '}
            {LEGAL.hosting.region}); E-Mail-Zustellung: Resend (serverseitig, keine
            Browser-Cookies).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-ink">5. Drittlandübermittlung</h2>
          <p className="mt-4">
            Soweit Dienste eine Verarbeitung außerhalb der EU/des EWR (z. B. USA)
            bewirken, erfolgt diese auf Grundlage von Art. 44 ff. DSGVO
            (EU-Standardvertragsklauseln bzw. EU-U.S. Data Privacy Framework).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-ink">
            6. Cookies und Reichweitenmessung
          </h2>
          <p className="mt-4">
            Technisch notwendige Cookies (inkl. Speicherung Ihrer
            Cookie-Entscheidung) auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO / §
            165 Abs. 3 TKG 2021. Statistik- und Marketing-Dienste werden
            ausschließlich nach aktiver Einwilligung geladen (Art. 6 Abs. 1 lit. a
            DSGVO). Eingesetzte Dienste, Zwecke, Anbieter und Speicherdauern siehe{' '}
            <Link href="/cookie-richtlinie" className="font-semibold text-accent underline-offset-4 hover:underline">
              Cookie-Richtlinie
            </Link>
            . Widerruf jederzeit über &quot;Cookie-Einstellungen&quot; im Footer.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-ink">7. Ihre Rechte</h2>
          <p className="mt-4">
            Auskunft (Art. 15), Berichtigung (16), Löschung (17), Einschränkung
            (18), Datenübertragbarkeit (20), Widerspruch (21), Widerruf (Art. 7
            Abs. 3) - per Nachricht an {LEGAL.controller.email}. Beschwerderecht
            bei der {LEGAL.supervisoryAuthority.name},{' '}
            {LEGAL.supervisoryAuthority.address},{' '}
            {LEGAL.supervisoryAuthority.email}.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-ink">8. Stand</h2>
          <p className="mt-4">Stand: Juni 2026.</p>
        </section>
      </article>
    </main>
  )
}
