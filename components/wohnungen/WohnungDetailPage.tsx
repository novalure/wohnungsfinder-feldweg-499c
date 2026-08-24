import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Building2,
  Car,
  Download,
  Home,
  Image as ImageIcon,
  Leaf,
  Mail,
  MapPin,
  Ruler,
  Send,
  Trees,
  type LucideIcon,
} from 'lucide-react'
import projectConfig from '@/config/project.json'
import { Navigation } from '@/components/Navigation'
import { InvestorFinancingNote, PriceAmount, PriceModeToggle } from '@/components/price/PriceMode'
import { ButtonLink } from '@/components/ui/Button'
import {
  getWohnungDetailPath,
  getWohnungFloorLabel,
  getWohnungOutdoorLabel,
  getWohnungSlug,
  WOHNUNGEN,
  WOHNUNG_STATUS_LABELS,
  type Wohnung,
} from '@/components/sections/data'
import { formatM2 } from '@/components/sections/format'
import { buildWohnungDetailJsonLd } from '@/lib/jsonld'
import { LEGAL } from '@/lib/legal-config'
import { WohnungDetailGallery, type WohnungGalleryItem } from './WohnungDetailGallery'

const galleryImages: WohnungGalleryItem[] = [
  {
    src: '/img/projekt-visualisierung-neu.jpg',
    alt: 'Tagesvisualisierung der Vallis Achen Residenzen mit Bergpanorama',
    width: 1344,
    height: 672,
  },
  {
    src: '/img/projekt-wohnen.jpg',
    alt: 'Wohn- und Essbereich mit natürlichem Materialkonzept',
    width: 3840,
    height: 4416,
  },
  {
    src: '/img/projekt-schlafzimmer.jpg',
    alt: 'Schlafzimmer mit Holzoberflächen und ruhiger Atmosphäre',
    width: 2688,
    height: 1598,
  },
  {
    src: '/img/projekt-bad.jpg',
    alt: 'Badezimmer mit Glasdusche und hellen Oberflächen',
    width: 2057,
    height: 1376,
  },
  {
    src: '/img/projekt-01.jpg',
    alt: 'Projektansicht der Wohnanlage Feldweg 499c',
    width: 1800,
    height: 1050,
  },
  {
    src: '/img/ausstattung-02.jpg',
    alt: 'Badvisualisierung als Ausstattungsbeispiel',
    width: 2057,
    height: 1376,
  },
]

const statusClasses: Record<Wohnung['status'], string> = {
  verfuegbar: 'bg-success/10 text-success',
  reserviert: 'bg-warn/15 text-[#8A6A18]',
  verkauft: 'bg-danger text-white',
}

function buildInquiryHref(wohnung: Wohnung) {
  const interest = wohnung.status === 'verkauft' ? 'noch unentschlossen' : wohnung.top
  return `/?wohnung=${encodeURIComponent(interest)}#kontakt`
}

function getGalleryItems(wohnung: Wohnung): WohnungGalleryItem[] {
  return galleryImages.map((item) => ({
    ...item,
    alt: `${wohnung.top}: ${item.alt}`,
  }))
}

function getApartmentCopy(wohnung: Wohnung) {
  const floor = getWohnungFloorLabel(wohnung)
  const outdoor = getWohnungOutdoorLabel(wohnung)

  if (floor === 'Erdgeschoss') {
    return {
      lead: `${wohnung.top} verbindet eine kompakte 2-Zimmer-Aufteilung mit privater Terrasse und Gartenfläche. Die Wohnung eignet sich für Käuferinnen und Käufer, die kurze Wege ins Freie, klare Räume und einen ruhigen Rückzugsort in Achenkirch suchen.`,
      layout:
        'Die Raumfolge ist auf Wohnen, Schlafen und einen funktionalen Sanitärbereich konzentriert. Der Wohn- und Essbereich öffnet sich zur privaten Freifläche; der Garten erweitert die Wohnung im Alltag spürbar nach außen.',
      target:
        'Ideal für Singles, Paare oder als wertbeständige Ferien- und Rückzugswohnung mit eigenem Außenbereich.',
      outdoor,
    }
  }

  return {
    lead: `${wohnung.top} liegt im Obergeschoss und bietet eine helle 2-Zimmer-Struktur mit privatem Balkon. Die Wohnung richtet sich an Interessenten, die eine klare Grundrisslogik, Bergnähe und eine pflegeleichte Freifläche suchen.`,
    layout:
      'Der Grundriss trennt Wohnküche, Schlafbereich und Bad kompakt voneinander. Der Balkon ergänzt den Wohnbereich als geschützter Außenraum mit Bezug zur Umgebung.',
    target:
      'Ideal für Singles, Paare oder Käuferinnen und Käufer, die ein ruhiges Eigentum mit überschaubarem Pflegeaufwand bevorzugen.',
    outdoor,
  }
}

function JsonLd({ wohnung }: { wohnung: Wohnung }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildWohnungDetailJsonLd(wohnung)),
      }}
    />
  )
}

export function WohnungDetailPage({ wohnung }: { wohnung: Wohnung }) {
  const { project, contact, downloads } = projectConfig
  const sortedWohnungen = [...WOHNUNGEN].sort((a, b) => a.nr - b.nr)
  const availableUnits = sortedWohnungen.filter((item) => item.status === 'verfuegbar')
  const switchUnits =
    availableUnits.length > 0
      ? availableUnits
      : sortedWohnungen.filter((item) => item.nr !== wohnung.nr)
  const switchTitle =
    availableUnits.length > 0
      ? `${availableUnits.length} verfügbare Wohnungen im Überblick.`
      : 'Weitere Wohnungen im Überblick.'
  const copy = getApartmentCopy(wohnung)
  const outdoor = getWohnungOutdoorLabel(wohnung)
  const isSold = wohnung.status === 'verkauft'
  const inquiryHref = buildInquiryHref(wohnung)
  const mailSubject = encodeURIComponent(`${wohnung.top} - ${project.name}`)
  const facts = [
    { label: 'Wohnungsnummer', value: wohnung.top },
    { label: 'Wohnfläche', value: formatM2(wohnung.wohnflaeche) },
    { label: 'Zimmer', value: `${wohnung.zimmer} Zimmer` },
    { label: 'Etage', value: getWohnungFloorLabel(wohnung) },
    { label: 'Freifläche', value: outdoor || 'nicht hinterlegt' },
    {
      label: 'Kaufpreis',
      value: (
        <PriceAmount
          gross={wohnung.kpGesamt}
          investorNet={wohnung.kpGesamtInvestorNet}
          status={wohnung.status}
          unavailableDisplay="status"
          soldClassName="text-danger"
        />
      ),
    },
    { label: 'Status', value: WOHNUNG_STATUS_LABELS[wohnung.status] },
    { label: 'Ausrichtung', value: 'siehe Exposé' },
    {
      label: 'Keller / Stellplatz',
      value: `nicht unterkellert / ${wohnung.parkplaetze} Freistellplatz${
        wohnung.parkplaetze === 1 ? '' : 'e'
      }`,
    },
  ]

  return (
    <>
      <JsonLd wohnung={wohnung} />
      <a href="#main-content" className="skip-link">
        Zum Inhalt springen
      </a>
      <Navigation />
      <main id="main-content" tabIndex={-1} className="bg-bg">
        <section className="relative min-h-[72svh] overflow-hidden bg-ink pt-24 text-white">
          <Image
            src="/img/hero-rendering-night.jpg"
            alt={`${project.name} am Achensee als Visualisierung für ${wohnung.top}`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/86 via-ink/48 to-ink/18" />
          <div className="section-shell relative z-10 flex min-h-[72svh] flex-col justify-end pb-12 pt-20">
            <Link
              href="/#wohnungen"
              className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/82 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ArrowLeft size={17} aria-hidden="true" />
              Zurück zur Übersicht
            </Link>
            <p className="eyebrow text-accent2">Wohnung Feldweg 499c</p>
            <div className="mt-4 flex flex-wrap items-end gap-4">
              <h1 className="max-w-5xl text-balance break-words font-serif text-[2.65rem] font-semibold leading-[0.98] sm:text-6xl md:text-8xl">
                {wohnung.top}
              </h1>
              <span
                className={`mb-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${statusClasses[wohnung.status]}`}
              >
                {WOHNUNG_STATUS_LABELS[wohnung.status]}
              </span>
            </div>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/86 sm:text-lg sm:leading-8">
              {copy.lead}
            </p>
            <div className="mt-8 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <HeroStat icon={Ruler} label="Wohnfläche" value={formatM2(wohnung.wohnflaeche)} />
              <HeroStat icon={BedDouble} label="Zimmer" value={`${wohnung.zimmer} Zimmer`} />
              <HeroStat icon={Home} label="Etage" value={getWohnungFloorLabel(wohnung)} />
              <HeroStat icon={Trees} label="Freifläche" value={outdoor || 'siehe Exposé'} />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={inquiryHref}>
                <Send size={18} aria-hidden="true" />
                {isSold ? 'Alternative anfragen' : 'Wohnung anfragen'}
              </ButtonLink>
              <ButtonLink
                href="/#wohnungen"
                variant="secondary"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20"
              >
                <ArrowLeft size={18} aria-hidden="true" />
                Übersicht
              </ButtonLink>
            </div>
          </div>
        </section>

        <section className="border-y border-line bg-surface py-16 md:py-20">
          <div className="section-shell">
            <div className="mb-6">
              <PriceModeToggle />
              {!isSold && <InvestorFinancingNote className="mt-3" />}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label} className="rounded-md border border-line bg-bg p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{fact.label}</p>
                  <p className="mt-2 break-words font-semibold leading-6 text-ink">{fact.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32">
          <div className="section-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="eyebrow">Beschreibung</p>
              <h2 className="mt-4 text-balance break-words font-serif text-[2.35rem] leading-[1.04] text-ink sm:text-5xl">
                Kompakte Wohnfläche mit klarer Alltagslogik.
              </h2>
            </div>
            <div className="grid gap-8 text-lg leading-8 text-muted">
              <p>{copy.layout}</p>
              <p>{copy.target}</p>
              <div className="grid gap-4 border-y border-line py-6 sm:grid-cols-3">
                {wohnung.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-start gap-3 text-base font-semibold leading-6 text-ink">
                    <Leaf className="mt-1 h-4 w-4 shrink-0 text-accent2" aria-hidden="true" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
              {!isSold && (
                <div className="grid gap-3 rounded-md border border-line bg-surface p-5 text-base leading-7">
                  <PriceModeToggle />
                  <PriceRow
                    label="KP Wohnung"
                    value={
                      <PriceAmount
                        gross={wohnung.kpWohnung}
                        investorNet={wohnung.kpWohnungInvestorNet}
                        status={wohnung.status}
                      />
                    }
                  />
                  <PriceRow
                    label="KP Parkplätze"
                    value={
                      <PriceAmount
                        gross={wohnung.kpParkplaetze}
                        investorNet={wohnung.kpParkplaetzeInvestorNet}
                        status={wohnung.status}
                      />
                    }
                  />
                  <PriceRow
                    label="KP gesamt"
                    value={
                      <PriceAmount
                        gross={wohnung.kpGesamt}
                        investorNet={wohnung.kpGesamtInvestorNet}
                        status={wohnung.status}
                      />
                    }
                    emphasized
                  />
                  <InvestorFinancingNote className="border-t border-line pt-3" />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="border-y border-line bg-surface py-24 md:py-32">
          <div className="section-shell">
            <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <p className="eyebrow">Bilder</p>
                <h2 className="mt-4 text-balance break-words font-serif text-[2.35rem] leading-[1.04] text-ink sm:text-5xl">
                  Bildergalerie zu {wohnung.top}.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-muted">
                Visualisierungen zeigen beispielhafte Stimmungen und Einrichtungsideen. Verbindlich bleiben die finalen Vertragsunterlagen.
              </p>
            </div>
            <WohnungDetailGallery
              galleryId={`wohnung-gallery-${getWohnungSlug(wohnung)}`}
              items={getGalleryItems(wohnung)}
            />
          </div>
        </section>

        <section className="py-24 md:py-32">
          <div className="section-shell grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <div>
              <p className="eyebrow">Grundriss</p>
              <h2 className="mt-4 text-balance break-words font-serif text-[2.35rem] leading-[1.04] text-ink sm:text-5xl">
                Grundriss {wohnung.top}
              </h2>
              <a
                href={wohnung.grundriss}
                className="relative mt-8 block aspect-[19/13] overflow-hidden rounded-md border border-line bg-surface shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label={`Grundriss ${wohnung.top} vergrößern`}
              >
                <Image
                  src={wohnung.grundriss}
                  alt={`Grundriss ${wohnung.top} der Vallis Achen Residenzen`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain p-4"
                />
              </a>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={wohnung.grundriss}
                  download
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-accent/25 bg-surface px-5 py-3 text-sm font-semibold text-accent shadow-soft transition hover:border-accent hover:bg-accent/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  <Download size={18} aria-hidden="true" />
                  Grundriss herunterladen
                </a>
                <ButtonLink href={downloads.expose} variant="secondary">
                  <Download size={18} aria-hidden="true" />
                  Exposé herunterladen
                </ButtonLink>
              </div>
            </div>

            <div className="rounded-md border border-line bg-surface p-6 shadow-soft md:p-8">
              <p className="eyebrow">Energieausweis</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-ink">Energiekennwerte</h2>
              <div className="mt-6 grid gap-3">
                <EnergyRow label="Energieeffizienzklasse" value={LEGAL.energy.energyClass} />
                <EnergyRow label="Heizwärmebedarf" value={LEGAL.energy.hwb} />
                <EnergyRow label="Gesamtenergieeffizienz-Faktor" value={LEGAL.energy.fgee} />
                <EnergyRow label="Heizungsart" value={LEGAL.energy.heating} />
                <EnergyRow label="Ausweisdatum" value={LEGAL.energy.certificateDate} />
                <EnergyRow label="Gültig bis" value={LEGAL.energy.validUntil} />
                <EnergyRow label="ZEUS-Nr." value={LEGAL.energy.zeusNumber} />
                <EnergyRow label="Bauweise" value="Massivwand mit zusätzlichem Wärmedämmsystem" />
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href={downloads.energieausweis} variant="secondary">
                  <Download size={18} aria-hidden="true" />
                  Energieausweis herunterladen
                </ButtonLink>
                <ButtonLink href={downloads.energieausweisUploadProtokoll} variant="secondary">
                  <Download size={18} aria-hidden="true" />
                  Upload-Protokoll
                </ButtonLink>
                <ButtonLink href={downloads.pruefergebnisBaubehoerde} variant="secondary">
                  <Download size={18} aria-hidden="true" />
                  Prüfergebnis Baubehörde
                </ButtonLink>
                <ButtonLink href={downloads.bab} variant="secondary">
                  <Download size={18} aria-hidden="true" />
                  Bau- und Ausstattungsbeschreibung
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-line bg-surface py-24 md:py-32">
          <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="eyebrow">Lage & Anfrage</p>
              <h2 className="mt-4 text-balance break-words font-serif text-[2.35rem] leading-[1.04] text-ink sm:text-5xl">
                Feldweg 499c in Achenkirch.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                Die Adresse verbindet ruhige Wohnlage mit der Nähe zum Achensee, alpinen Wegen und regionaler Infrastruktur. Jenbach, Innsbruck und München bleiben gut erreichbar.
              </p>
              <div className="mt-8 grid gap-3 text-muted sm:grid-cols-2">
                <InfoLine icon={MapPin} text="A-6215 Achenkirch, Feldweg 499c" />
                <InfoLine icon={Car} text="ca. 5 km zum See" />
                <InfoLine icon={Building2} text="6 Eigentumswohnungen" />
                <InfoLine icon={ImageIcon} text="Grundriss und Visualisierungen verfügbar" />
              </div>
            </div>

            <div className="rounded-md border border-line bg-bg p-6 shadow-soft md:p-8">
              <p className="eyebrow">Kontakt</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-ink">
                {isSold ? 'Alternative anfragen.' : `${wohnung.top} anfragen.`}
              </h2>
              <p className="mt-4 leading-7 text-muted">
                Das Kontaktformular wird mit der passenden Wohnung vorbelegt. Alternativ erreichen Sie GRASL Immobilien direkt per Telefon oder E-Mail.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href={inquiryHref}>
                  <Send size={18} aria-hidden="true" />
                  Zum Kontaktformular
                </ButtonLink>
                <ButtonLink href={`mailto:${contact.email}?subject=${mailSubject}`} variant="secondary">
                  <Mail size={18} aria-hidden="true" />
                  E-Mail senden
                </ButtonLink>
              </div>
              <div className="mt-8 grid gap-3 border-t border-line pt-6 text-sm text-muted">
                <a href={`tel:${contact.telefon}`} className="font-semibold text-ink hover:text-accent">
                  {contact.telefonDisplay}
                </a>
                <a href={`mailto:${contact.email}`} className="font-semibold text-ink hover:text-accent">
                  {contact.email}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24" aria-labelledby="weitere-einheiten-heading">
          <div className="section-shell">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <p className="eyebrow">Verfügbare Einheiten</p>
                <h2
                  id="weitere-einheiten-heading"
                  className="mt-4 text-balance break-words font-serif text-[2.25rem] leading-[1.04] text-ink sm:text-5xl"
                >
                  {switchTitle}
                </h2>
              </div>
              <div className="flex flex-col items-start gap-3 md:items-end">
                <ButtonLink href="/#wohnungen" variant="secondary" className="w-fit">
                  Zur Übersicht
                  <ArrowRight size={18} aria-hidden="true" />
                </ButtonLink>
                <PriceModeToggle />
              </div>
            </div>
            <InvestorFinancingNote className="mb-6" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {switchUnits.map((unit) => (
                <WohnungSwitchCard key={unit.nr} wohnung={unit} isCurrent={unit.nr === wohnung.nr} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

function WohnungSwitchCard({ wohnung, isCurrent }: { wohnung: Wohnung; isCurrent: boolean }) {
  const outdoor = getWohnungOutdoorLabel(wohnung)

  return (
    <Link
      href={getWohnungDetailPath(wohnung)}
      className={`group flex h-full min-w-0 flex-col overflow-hidden rounded-md border bg-surface shadow-soft transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        isCurrent ? 'border-accent/50 ring-2 ring-accent/15' : 'border-line hover:border-accent/40'
      }`}
      aria-current={isCurrent ? 'page' : undefined}
      aria-label={isCurrent ? `${wohnung.top} ist die aktuelle Wohnung` : `${wohnung.top} ansehen`}
    >
      <div className="relative aspect-[19/13] bg-bg">
        <Image
          src={wohnung.grundriss}
          alt={`Grundriss ${wohnung.top}`}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
          className="object-contain p-3 transition duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-3xl leading-none text-ink">{wohnung.top}</h3>
          <div className="flex flex-wrap justify-end gap-2">
            {isCurrent && (
              <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent">
                Aktuell
              </span>
            )}
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses[wohnung.status]}`}>
              {WOHNUNG_STATUS_LABELS[wohnung.status]}
            </span>
          </div>
        </div>
        <dl className="mt-5 grid gap-2 text-sm">
          <SwitchCardFact label="Wohnfläche" value={formatM2(wohnung.wohnflaeche)} />
          <SwitchCardFact label="Zimmer" value={`${wohnung.zimmer}`} />
          <SwitchCardFact label="Freifläche" value={outdoor || 'siehe Exposé'} />
          <SwitchCardFact
            label="Preis"
            value={
              <PriceAmount
                gross={wohnung.kpGesamt}
                investorNet={wohnung.kpGesamtInvestorNet}
                status={wohnung.status}
                unavailableDisplay="status"
                soldClassName="text-danger"
              />
            }
          />
        </dl>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
          {isCurrent ? 'Aktuelle Wohnung' : 'Details ansehen'}
          {!isCurrent && <ArrowRight size={17} aria-hidden="true" />}
        </span>
      </div>
    </Link>
  )
}

function SwitchCardFact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-line pt-2">
      <dt className="text-muted">{label}</dt>
      <dd className="min-w-0 break-words text-right font-semibold text-ink">{value}</dd>
    </div>
  )
}

function HeroStat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="rounded-md border border-white/20 bg-white/10 p-4 backdrop-blur">
      <Icon className="h-5 w-5 text-accent2" aria-hidden="true" />
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">{label}</p>
      <p className="mt-1 break-words font-semibold leading-6 text-white">{value}</p>
    </div>
  )
}

function PriceRow({
  label,
  value,
  emphasized = false,
}: {
  label: string
  value: React.ReactNode
  emphasized?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-muted">{label}</span>
      <span className={`tabular-nums ${emphasized ? 'text-lg font-semibold text-ink' : 'font-medium text-ink'}`}>
        {value}
      </span>
    </div>
  )
}

function EnergyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-t border-line pt-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-5">
      <span className="text-sm text-muted">{label}</span>
      <span className="font-semibold text-ink sm:text-right">{value}</span>
    </div>
  )
}

function InfoLine({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-start gap-3 border-t border-line pt-3">
      <Icon className="mt-1 h-4 w-4 shrink-0 text-accent2" aria-hidden="true" />
      <span>{text}</span>
    </div>
  )
}
