import Link from 'next/link'
import projectConfig from '@/config/project.json'

export const metadata = {
  title: 'Datenschutz',
  alternates: { canonical: '/datenschutz' },
}

export default function DatenschutzPage() {
  const { company, contact } = projectConfig

  return (
    <main className="section-shell py-20">
      <Link href="/" className="text-sm font-semibold text-accent">
        Zurück zur Projektseite
      </Link>
      <article className="mt-10 max-w-3xl space-y-8 leading-8 text-muted">
        <div>
          <p className="eyebrow">Datenschutz</p>
          <h1 className="mt-4 font-serif text-6xl leading-tight text-ink">Datenschutzerklärung</h1>
          <p className="mt-5">
            Dieses Template enthält Standardklauseln für Österreich und muss vor
            Live-Gang juristisch geprüft und auf die tatsächlich eingesetzten Dienste
            angepasst werden.
          </p>
        </div>
        <section>
          <h2 className="font-serif text-3xl text-ink">Verantwortlicher</h2>
          <p>
            {company.legalName}, {company.address}. Kontakt: {contact.email}.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-ink">Kontaktaufnahme</h2>
          <p>
            Wenn Sie per Formular, Telefon oder E-Mail Kontakt aufnehmen, verarbeiten
            wir Ihre Angaben zur Bearbeitung der Anfrage und für Anschlussfragen auf
            Basis von Art. 6 Abs. 1 lit. b DSGVO.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-ink">Cookies und Webanalyse</h2>
          <p>
            Essenzielle Cookies dienen dem Betrieb der Website. Marketing- und
            Analyse-Cookies werden erst nach Zustimmung gesetzt. Die Zustimmung kann
            über die Cookie-Einstellungen widerrufen werden. Rechtsgrundlagen sind
            DSGVO, DSG 2018 und TKG 2003.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-ink">Ihre Rechte</h2>
          <p>
            Ihnen stehen Auskunft, Berichtigung, Löschung, Einschränkung,
            Datenübertragbarkeit, Widerruf und Widerspruch zu. Beschwerden können an
            die österreichische Datenschutzbehörde gerichtet werden.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-ink">Auftragsverarbeiter</h2>
          <p>
            Eingesetzte Dienste wie Hosting, E-Mail-Versand, reCAPTCHA, Karten,
            Analytics und Meta Pixel sind vor Live-Gang konkret zu benennen und mit
            passenden Rechtsgrundlagen zu dokumentieren.
          </p>
        </section>
      </article>
    </main>
  )
}
