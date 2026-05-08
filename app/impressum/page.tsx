import Link from 'next/link'
import projectConfig from '@/config/project.json'

export const metadata = {
  title: 'Impressum',
  alternates: { canonical: '/impressum' },
}

export default function ImpressumPage() {
  const { company, contact } = projectConfig

  return (
    <main className="section-shell py-20">
      <Link href="/" className="text-sm font-semibold text-accent">
        Zurück zur Projektseite
      </Link>
      <article className="mt-10 max-w-3xl space-y-8 leading-8 text-muted">
        <div>
          <p className="eyebrow">Impressum</p>
          <h1 className="mt-4 font-serif text-6xl leading-tight text-ink">
            Angaben nach §5 ECG, §14 UGB, §25 MedienG
          </h1>
        </div>
        <section>
          <h2 className="font-serif text-3xl text-ink">Medieninhaber und Betreiber</h2>
          <p>
            {company.legalName}
            <br />
            {company.address}
            <br />
            UID: {company.uid}
            <br />
            Rechtsform: {company.fb}
            <br />
            Zuständige Behörde: {company.fbGericht}
            <br />
            Inhaber: {company.geschaeftsfuehrer}
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-ink">Kontakt</h2>
          <p>
            E-Mail: {contact.email}
            <br />
            Telefon: {contact.telefonDisplay}
            <br />
            Mobil: {contact.mobilDisplay}
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-ink">Unternehmensgegenstand</h2>
          <p>
            Immobilientreuhänder, Sachverständigenbüro und damit verbundene
            Dienstleistungen. Berufsrechtliche Detailangaben sind vor Live-Gang
            final rechtlich zu prüfen.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-ink">Haftung</h2>
          <p>
            Alle Angaben erfolgen nach bestem Wissen, jedoch ohne Gewähr. Änderungen,
            Irrtümer und Zwischenverkauf vorbehalten. Dieses Impressum ist ein
            Template und muss final rechtlich geprüft werden.
          </p>
        </section>
      </article>
    </main>
  )
}
