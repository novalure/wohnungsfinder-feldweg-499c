export type WohnungsStatus = 'verfuegbar' | 'reserviert' | 'verkauft'

export const WOHNUNG_STATUS_LABELS: Record<WohnungsStatus, string> = {
  verfuegbar: 'verfügbar',
  reserviert: 'reserviert',
  verkauft: 'verkauft',
}

export interface Wohnung {
  nr: 1 | 2 | 3 | 4 | 5 | 6
  top: string
  zimmer: number
  wohnflaeche: number
  terrasse: number | null
  balkon: number | null
  garten: number
  nflGewichtet: number
  parkplaetze: number
  kpWohnung: number
  kpParkplaetze: number
  kpGesamt: number
  status: WohnungsStatus
  highlights: string[]
  hotspot: { top: string; left: string; width: string; height: string }
  grundriss: string
}

export function getWohnungSlug(wohnung: Pick<Wohnung, 'nr'>): string {
  return `wohnung-${wohnung.nr}`
}

export function getWohnungDetailPath(wohnung: Pick<Wohnung, 'nr'>): string {
  return `/wohnungen/${getWohnungSlug(wohnung)}`
}

export function getWohnungBySlug(slug: string): Wohnung | undefined {
  return WOHNUNGEN.find((wohnung) => getWohnungSlug(wohnung) === slug)
}

export function getWohnungFloorLabel(wohnung: Wohnung): string {
  return wohnung.terrasse !== null ? 'Erdgeschoss' : 'Obergeschoss'
}

export function getWohnungOutdoorLabel(wohnung: Wohnung): string {
  const parts: string[] = []
  if (wohnung.terrasse !== null) parts.push(`Terrasse ${wohnung.terrasse.toLocaleString('de-AT')} m²`)
  if (wohnung.balkon !== null) parts.push(`Balkon ${wohnung.balkon.toLocaleString('de-AT')} m²`)
  if (wohnung.garten > 0) parts.push(`Garten ${wohnung.garten.toLocaleString('de-AT')} m²`)
  return parts.join(', ')
}

export const WOHNUNGEN: Wohnung[] = [
  {
    nr: 1,
    top: 'Top 1',
    zimmer: 2,
    wohnflaeche: 56.37,
    terrasse: 14.31,
    balkon: null,
    garten: 143.1,
    nflGewichtet: 64.96,
    parkplaetze: 2,
    kpWohnung: 357258,
    kpParkplaetze: 25000,
    kpGesamt: 382258,
    status: 'verkauft',
    highlights: ['Privater Garten', 'Zwei Stellplätze', 'Ruhige Orientierung'],
    hotspot: { top: '61.4%', left: '72.5%', width: '18.6%', height: '21.8%' },
    grundriss: '/grundrisse/wohnung-1.png',
  },
  {
    nr: 2,
    top: 'Top 2',
    zimmer: 2,
    wohnflaeche: 57.07,
    terrasse: 14.31,
    balkon: null,
    garten: 45.5,
    nflGewichtet: 60.78,
    parkplaetze: 1,
    kpWohnung: 328190.4,
    kpParkplaetze: 12500,
    kpGesamt: 340690.4,
    status: 'verfuegbar',
    highlights: ['Kompakter Garten', 'Effizienter Grundriss', 'Ein Stellplatz'],
    hotspot: { top: '61.4%', left: '47.1%', width: '18.7%', height: '21.8%' },
    grundriss: '/grundrisse/wohnung-2.png',
  },
  {
    nr: 3,
    top: 'Top 3',
    zimmer: 2,
    wohnflaeche: 56.13,
    terrasse: 14.31,
    balkon: null,
    garten: 95.8,
    nflGewichtet: 62.35,
    parkplaetze: 2,
    kpWohnung: 342930.5,
    kpParkplaetze: 25000,
    kpGesamt: 367930.5,
    status: 'verkauft',
    highlights: ['Großzügiger Garten', 'Zwei Stellplätze', 'Kurze Wege ins Freie'],
    hotspot: { top: '61.4%', left: '22.4%', width: '19.4%', height: '21.8%' },
    grundriss: '/grundrisse/wohnung-3.png',
  },
  {
    nr: 4,
    top: 'Top 4',
    zimmer: 2,
    wohnflaeche: 56.53,
    terrasse: null,
    balkon: 8.4,
    garten: 0,
    nflGewichtet: 57.37,
    parkplaetze: 2,
    kpWohnung: 338483,
    kpParkplaetze: 25000,
    kpGesamt: 363483,
    status: 'verfuegbar',
    highlights: ['Balkon', 'Zwei Stellplätze', 'Blick in die Umgebung'],
    hotspot: { top: '38.0%', left: '72.5%', width: '18.6%', height: '23.4%' },
    grundriss: '/grundrisse/wohnung-4.png',
  },
  {
    nr: 5,
    top: 'Top 5',
    zimmer: 2,
    wohnflaeche: 57.23,
    terrasse: null,
    balkon: 8.4,
    garten: 0,
    nflGewichtet: 58.07,
    parkplaetze: 1,
    kpWohnung: 333902.5,
    kpParkplaetze: 12500,
    kpGesamt: 346402.5,
    status: 'verfuegbar',
    highlights: ['Balkon', 'Ein Stellplatz', 'Klar zonierter Wohnbereich'],
    hotspot: { top: '38.0%', left: '47.1%', width: '18.7%', height: '23.4%' },
    grundriss: '/grundrisse/wohnung-5.png',
  },
  {
    nr: 6,
    top: 'Top 6',
    zimmer: 2,
    wohnflaeche: 56.32,
    terrasse: null,
    balkon: 8.4,
    garten: 0,
    nflGewichtet: 57.16,
    parkplaetze: 2,
    kpWohnung: 337244,
    kpParkplaetze: 25000,
    kpGesamt: 362244,
    status: 'verfuegbar',
    highlights: ['Balkon', 'Zwei Stellplätze', 'Ruhige Obergeschosslage'],
    hotspot: { top: '38.0%', left: '22.4%', width: '19.4%', height: '23.4%' },
    grundriss: '/grundrisse/wohnung-6.png',
  },
]
