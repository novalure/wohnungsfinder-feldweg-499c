import projectConfig from '@/config/project.json'
import {
  CONTENT_UPDATED_AT,
  getAvailableWohnungen,
  getWohnungDetailPath,
  getWohnungOutdoorLabel,
  WOHNUNGEN,
  WOHNUNG_STATUS_LABELS,
} from '@/components/sections/data'
import { formatEUR, formatM2 } from '@/components/sections/format'
import { LEGAL } from '@/lib/legal-config'
import { absUrl } from '@/lib/site'

function buildUnitRows() {
  return WOHNUNGEN.map((wohnung) => {
    const price =
      wohnung.status === 'verkauft' ? 'verkauft' : formatEUR(wohnung.kpGesamt)

    return [
      wohnung.top,
      WOHNUNG_STATUS_LABELS[wohnung.status],
      `${wohnung.zimmer}`,
      formatM2(wohnung.wohnflaeche),
      getWohnungOutdoorLabel(wohnung) || '-',
      `${wohnung.parkplaetze}`,
      price,
      absUrl(getWohnungDetailPath(wohnung)),
    ].join(' | ')
  }).join('\n')
}

export function GET() {
  const available = getAvailableWohnungen()
  const minPrice = Math.min(...available.map((wohnung) => wohnung.kpGesamt))
  const body = `# ${projectConfig.project.name} - Eigentumswohnungen am Achensee

> Wohnbauprojekt mit ${WOHNUNGEN.length} Eigentumswohnungen am Feldweg 499c, 6215 Achenkirch am Achensee, Tirol. ${available.length} von ${WOHNUNGEN.length} Wohnungen sind verfügbar. Kaufpreise ab ${formatEUR(minPrice)} inklusive Stellplatz. Stand: ${CONTENT_UPDATED_AT}.

## Projekt
- Adresse: ${projectConfig.project.address}
- Einheiten: ${projectConfig.project.anzahlWohnungen} Eigentumswohnungen, ${projectConfig.project.zimmerRange}, ${projectConfig.project.wohnflaecheRange}
- Energie: ${LEGAL.energy.hwb}, fGEE ${LEGAL.energy.fgee}
- Fertigstellung: ${projectConfig.project.fertigstellung}
- Vertrieb: ${LEGAL.controller.businessDesignation}, ${LEGAL.controller.officeName}

## Wohnungen und Preise
Top | Status | Zimmer | Wohnfläche | Freifläche | Stellplätze | Kaufpreis gesamt | Detailseite
--- | --- | ---: | ---: | --- | ---: | ---: | ---
${buildUnitRows()}

## Kontakt
- Ansprechpartner: ${projectConfig.contact.ansprechpartner}
- Telefon: ${projectConfig.contact.telefonDisplay}
- Mobil: ${projectConfig.contact.mobilDisplay}
- E-Mail: ${projectConfig.contact.email}
- Büro: ${LEGAL.controller.street}, ${LEGAL.controller.city}, ${LEGAL.controller.country}

## Wichtige Links
- Website: ${absUrl('/')}
- Wohnungsfinder: ${absUrl('/#wohnungen')}
- Exposé: ${absUrl(projectConfig.downloads.expose)}
- Bau- und Ausstattungsbeschreibung: ${absUrl(projectConfig.downloads.bab)}
- Energieausweis: ${absUrl(projectConfig.downloads.energieausweis)}
- Impressum: ${absUrl('/impressum')}
- Datenschutz: ${absUrl('/datenschutz')}
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex',
    },
  })
}
