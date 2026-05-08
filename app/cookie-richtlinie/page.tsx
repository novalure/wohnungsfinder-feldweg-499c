import Link from 'next/link'
import projectConfig from '@/config/project.json'
import { CookieSettingsButton } from '@/components/CookieSettingsButton'

export const metadata = {
  title: 'Cookie-Richtlinie',
  alternates: { canonical: '/cookie-richtlinie' },
}

const cookieRows = [
  {
    name: 'cookie_consent',
    provider: 'First Party',
    purpose: 'Speichert Ihre Cookie-Auswahl.',
    duration: '180 Tage',
    thirdCountry: 'Nein',
  },
  {
    name: '_ga, _ga_*',
    provider: 'Google Analytics 4',
    purpose: 'Statistische Reichweitenmessung nach Einwilligung.',
    duration: 'Bis zu 14 Monate',
    thirdCountry: 'Mögliche Übermittlung in die USA',
  },
  {
    name: '_hjSession_*, _hjSessionUser_*',
    provider: 'Hotjar',
    purpose: 'Heatmaps und Nutzungsanalyse nach Einwilligung.',
    duration: 'Bis zu 12 Monate',
    thirdCountry: 'Mögliche Übermittlung in die USA',
  },
  {
    name: '_fbp, _fbc',
    provider: 'Meta Pixel',
    purpose: 'Kampagnenmessung und Remarketing nach Einwilligung.',
    duration: 'Bis zu 3 Monate',
    thirdCountry: 'Mögliche Übermittlung in die USA',
  },
]

export default function CookieRichtliniePage() {
  const { company, contact } = projectConfig

  return (
    <main className="section-shell py-20">
      <Link href="/" className="text-sm font-semibold text-accent">
        Zurück zur Projektseite
      </Link>
      <article className="mt-10 max-w-4xl space-y-8 leading-8 text-muted">
        <div>
          <p className="eyebrow">Cookie-Richtlinie</p>
          <h1 className="mt-4 font-serif text-6xl leading-tight text-ink">
            Cookies und Einwilligung
          </h1>
        </div>

        <section>
          <h2 className="font-serif text-3xl text-ink">1. Was sind Cookies?</h2>
          <p>
            Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert
            werden. Einige Cookies sind technisch notwendig, andere dienen erst nach
            Ihrer Einwilligung der Statistik oder dem Marketing.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-ink">2. Rechtsgrundlage</h2>
          <p>
            Für Statistik- und Marketing-Cookies ist Ihre Einwilligung nach Art. 6
            Abs. 1 lit. a DSGVO in Verbindung mit § 165 Abs. 3 TKG 2021 erforderlich.
            Technisch notwendige Cookies beruhen auf der gesetzlichen Ausnahme des
            § 165 Abs. 3 TKG 2021 sowie auf Art. 6 Abs. 1 lit. f DSGVO.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-ink">
            3. Kategorien und konkrete Cookies
          </h2>
          <div className="mt-5 overflow-x-auto rounded-md border border-line bg-surface">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-bg text-ink">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Anbieter</th>
                  <th className="px-4 py-3">Zweck</th>
                  <th className="px-4 py-3">Speicherdauer</th>
                  <th className="px-4 py-3">Drittland</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {cookieRows.map((row) => (
                  <tr key={`${row.provider}-${row.name}`}>
                    <td className="px-4 py-3 font-semibold text-ink">{row.name}</td>
                    <td className="px-4 py-3">{row.provider}</td>
                    <td className="px-4 py-3">{row.purpose}</td>
                    <td className="px-4 py-3">{row.duration}</td>
                    <td className="px-4 py-3">{row.thirdCountry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-ink">
            4. Verwaltung der Einwilligung
          </h2>
          <p>
            Sie können Ihre Auswahl jederzeit ändern. Die Änderung wirkt für die
            Zukunft und wird unmittelbar auf dieser Website angewendet.
          </p>
          <div className="mt-5">
            <CookieSettingsButton />
          </div>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-ink">
            5. Widerruf und Browser-Einstellungen
          </h2>
          <p>
            Zusätzlich können Sie Cookies in Ihrem Browser löschen oder blockieren:
            {' '}
            <a className="font-semibold text-accent underline-offset-4 hover:underline" href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer">
              Chrome
            </a>
            ,{' '}
            <a className="font-semibold text-accent underline-offset-4 hover:underline" href="https://support.mozilla.org/de/kb/cookies-und-website-daten-in-firefox-loschen" target="_blank" rel="noreferrer">
              Firefox
            </a>
            ,{' '}
            <a className="font-semibold text-accent underline-offset-4 hover:underline" href="https://support.apple.com/de-at/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer">
              Safari
            </a>
            ,{' '}
            <a className="font-semibold text-accent underline-offset-4 hover:underline" href="https://support.microsoft.com/de-de/microsoft-edge/cookies-in-microsoft-edge-l%C3%B6schen-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noreferrer">
              Edge
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-ink">6. Verantwortlicher / Kontakt</h2>
          <p>
            {company.legalName}, {company.address}. Kontakt: {contact.email},
            Telefon {contact.telefonDisplay}.
          </p>
        </section>
      </article>
    </main>
  )
}
