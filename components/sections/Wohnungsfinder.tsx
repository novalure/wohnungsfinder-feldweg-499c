'use client'

import Image from 'next/image'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { ChevronDown, Image as ImageIcon, Send, X } from 'lucide-react'
import projectConfig from '@/config/project.json'
import { trackEvent } from '@/lib/analytics'
import { WOHNUNGEN, type Wohnung, type WohnungsStatus } from './data'
import { formatEUR, formatM2 } from './format'

type Props = {
  onAnfrage?: (top: string, nr: number) => void
}

const statusLabels: Record<WohnungsStatus, string> = {
  verfuegbar: 'verfügbar',
  reserviert: 'reserviert',
  verkauft: 'verkauft',
}

const statusClasses: Record<WohnungsStatus, string> = {
  verfuegbar: 'bg-success/10 text-success',
  reserviert: 'bg-warn/15 text-[#8A6A18]',
  verkauft: 'bg-muted/10 text-muted',
}

export default function Wohnungsfinder({ onAnfrage }: Props) {
  const [activeApt, setActiveApt] = useState<number | null>(null)
  const [hoveredApt, setHoveredApt] = useState<number | null>(null)
  const [lightboxApt, setLightboxApt] = useState<number | null>(null)

  const sortedWohnungen = useMemo<Wohnung[]>(
    () => [...WOHNUNGEN].sort((a, b) => a.nr - b.nr),
    [],
  )

  const toggleActive = useCallback((nr: number) => {
    setActiveApt((current) => (current === nr ? null : nr))
    trackEvent('wohnung_detail_open', { wohnung_nr: nr, top: `Top ${nr}` })
  }, [])

  const handleEnter = useCallback((nr: number) => setHoveredApt(nr), [])
  const handleLeave = useCallback(() => setHoveredApt(null), [])
  const openLightbox = useCallback((nr: number) => setLightboxApt(nr), [])
  const closeLightbox = useCallback(() => setLightboxApt(null), [])

  useEffect(() => {
    if (lightboxApt === null) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [lightboxApt, closeLightbox])

  const isHighlighted = (nr: number) => hoveredApt === nr || activeApt === nr

  const onRowKeyDown = (event: ReactKeyboardEvent<HTMLTableRowElement>, nr: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleActive(nr)
    }
  }

  return (
    <section id="wohnungen" className="bg-surface py-28 md:py-36">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="eyebrow">Wohnungen</p>
          <h2 className="mt-4 font-serif text-5xl leading-tight text-ink md:text-6xl">
            Sechs Einheiten. Klare Auswahl. Persönliche Beratung.
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted">
            Wählen Sie eine Wohnung im Plan oder in der Preisliste. Details,
            Grundriss und Preisaufstellung öffnen sich direkt in der Übersicht.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-10">
          <div className="lg:col-span-3">
            <div
              className="relative w-full overflow-hidden rounded-md bg-bg shadow-soft"
              style={{ aspectRatio: '1672 / 941' }}
            >
              <Image
                src="/skizze_feldweg499c.png"
                alt="Front-Skizze Feldweg 499c mit sechs markierten Wohnungen"
                fill
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="select-none object-cover"
                draggable={false}
              />

              {sortedWohnungen.map((wohnung) => {
                const active = isHighlighted(wohnung.nr)
                return (
                  <button
                    key={wohnung.nr}
                    type="button"
                    aria-label={`${wohnung.top} – Details anzeigen`}
                    aria-pressed={activeApt === wohnung.nr}
                    onMouseEnter={() => handleEnter(wohnung.nr)}
                    onMouseLeave={handleLeave}
                    onFocus={() => handleEnter(wohnung.nr)}
                    onBlur={handleLeave}
                    onClick={() => toggleActive(wohnung.nr)}
                    className="absolute flex cursor-pointer items-center justify-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent2"
                    style={{
                      top: wohnung.hotspot.top,
                      left: wohnung.hotspot.left,
                      width: wohnung.hotspot.width,
                      height: wohnung.hotspot.height,
                      backgroundColor: active ? 'rgba(184,153,104,0.42)' : 'transparent',
                      border: active ? '2px solid #B89968' : '2px solid transparent',
                      transition: 'all 200ms ease',
                    }}
                  >
                    {active && (
                      <span
                        className="pointer-events-none text-3xl font-bold text-white md:text-4xl"
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.35)' }}
                      >
                        {wohnung.nr}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            <p className="mt-3 text-sm text-muted">
              Hotspot oder Tabellenzeile anklicken, um Details zur Wohnung zu sehen.
            </p>
          </div>

          <div className="lg:col-span-2">
            <div className="overflow-x-auto rounded-md border border-line shadow-soft">
              <table className="w-full min-w-[680px] text-sm">
                <thead>
                  <tr className="bg-bg">
                    <TableHead>Top</TableHead>
                    <TableHead>Zimmer</TableHead>
                    <TableHead align="right">ca. Fläche</TableHead>
                    <TableHead align="right">KP Wohnung</TableHead>
                    <TableHead align="right">KP gesamt</TableHead>
                    <th className="w-8 px-2 py-3" aria-hidden="true" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {sortedWohnungen.map((wohnung) => {
                    const isOpen = activeApt === wohnung.nr
                    const isHover = isHighlighted(wohnung.nr)
                    const detailId = `wohnung-detail-${wohnung.nr}`
                    return (
                      <FragmentRow key={wohnung.nr}>
                        <tr
                          role="button"
                          tabIndex={0}
                          aria-expanded={isOpen}
                          aria-controls={detailId}
                          onMouseEnter={() => handleEnter(wohnung.nr)}
                          onMouseLeave={handleLeave}
                          onFocus={() => handleEnter(wohnung.nr)}
                          onBlur={handleLeave}
                          onClick={() => toggleActive(wohnung.nr)}
                          onKeyDown={(event) => onRowKeyDown(event, wohnung.nr)}
                          className="cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent2 focus-visible:ring-inset"
                          style={{
                            backgroundColor: isHover ? 'rgba(184,153,104,0.12)' : 'transparent',
                            boxShadow: isHover
                              ? 'inset 2px 0 0 0 #B89968'
                              : 'inset 0 0 0 0 transparent',
                          }}
                        >
                          <td className="px-3 py-3 font-semibold text-ink">
                            <span>{wohnung.top}</span>
                            <StatusBadge status={wohnung.status} />
                          </td>
                          <td className="px-3 py-3 text-muted">{wohnung.zimmer}</td>
                          <td className="px-3 py-3 text-right tabular-nums text-muted">
                            {formatM2(wohnung.wohnflaeche)}
                          </td>
                          <td className="px-3 py-3 text-right tabular-nums font-medium text-muted">
                            {formatEUR(wohnung.kpWohnung)}
                          </td>
                          <td className="px-3 py-3 text-right tabular-nums font-semibold text-ink">
                            {formatEUR(wohnung.kpGesamt)}
                          </td>
                          <td className="px-2 py-3 text-muted">
                            <ChevronDown
                              size={18}
                              className="transition-transform duration-200"
                              style={{
                                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              }}
                            />
                          </td>
                        </tr>
                        <tr aria-hidden={!isOpen}>
                          <td colSpan={6} className="p-0">
                            <div
                              id={detailId}
                              className={`accordion-grid ${isOpen ? 'is-open' : ''}`}
                            >
                              <div className="accordion-content">
                                <DetailPanel
                                  wohnung={wohnung}
                                  onOpenLightbox={() => openLightbox(wohnung.nr)}
                                  onAnfrage={onAnfrage}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      </FragmentRow>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs leading-6 text-muted">
              Bei erfolgreichem Vertragsabschluss fällt eine Provision von 3 % des
              Kaufpreises zzgl. 20 % USt an, gemäß Immobilienmaklerverordnung BGBl.
              262 und 297/1996. Diese Provision gilt auch bei Weitergabe der
              Informationen an Dritte.
            </p>
          </div>
        </div>

        {lightboxApt !== null && (
          <Lightbox
            wohnung={sortedWohnungen.find((wohnung) => wohnung.nr === lightboxApt)!}
            onClose={closeLightbox}
          />
        )}
      </div>
    </section>
  )
}

function TableHead({
  children,
  align = 'left',
}: {
  children: React.ReactNode
  align?: 'left' | 'right'
}) {
  return (
    <th
      className={`px-3 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
    >
      {children}
    </th>
  )
}

function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function StatusBadge({ status }: { status: WohnungsStatus }) {
  return (
    <span
      className={`ml-2 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusClasses[status]}`}
    >
      {statusLabels[status]}
    </span>
  )
}

function DetailPanel({
  wohnung,
  onOpenLightbox,
  onAnfrage,
}: {
  wohnung: Wohnung
  onOpenLightbox: () => void
  onAnfrage?: (top: string, nr: number) => void
}) {
  const hwb = projectConfig.project.hwb

  return (
    <div className="border-t border-line bg-bg px-4 py-5 md:px-6 md:py-6">
      {wohnung.status === 'reserviert' && (
        <p className="mb-4 rounded-md bg-warn/15 px-4 py-3 text-sm font-semibold text-[#7A5A10]">
          Hohe Nachfrage — sichern Sie sich Ihre Wohnung jetzt.
        </p>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <dl className="space-y-2 text-sm">
            <DLItem label="Wohnfläche" value={formatM2(wohnung.wohnflaeche)} />
            {wohnung.terrasse !== null && (
              <DLItem label="Terrasse" value={formatM2(wohnung.terrasse)} />
            )}
            {wohnung.balkon !== null && <DLItem label="Balkon" value={formatM2(wohnung.balkon)} />}
            {wohnung.garten > 0 && <DLItem label="Garten" value={formatM2(wohnung.garten)} />}
            <DLItem label="Nutzfläche gewichtet" value={formatM2(wohnung.nflGewichtet)} />
            <DLItem label="Inkl. Parkplätze" value={`${wohnung.parkplaetze} Stk.`} />
            <DLItem label="HWB" value={hwb} />
            <div className="my-2 h-px bg-line" />
            <DLItem label="KP Wohnung" value={formatEUR(wohnung.kpWohnung)} />
            <DLItem label="KP Parkplätze" value={formatEUR(wohnung.kpParkplaetze)} />
            <DLItem label="KP gesamt" value={formatEUR(wohnung.kpGesamt)} emphasized />
          </dl>
          <ul className="mt-5 grid gap-2 text-sm text-muted">
            {wohnung.highlights.map((highlight) => (
              <li key={highlight}>• {highlight}</li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#263f31]"
            onClick={() => onAnfrage?.(wohnung.top, wohnung.nr)}
          >
            <Send size={17} />
            {wohnung.top} anfragen
          </button>
        </div>

        <div className="flex flex-col">
          <button
            type="button"
            onClick={onOpenLightbox}
            aria-label={`Grundriss ${wohnung.top} vergrößern`}
            className="group relative block w-full overflow-hidden rounded-md border border-line bg-surface transition-shadow hover:shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent2"
          >
            <Image
              src={wohnung.grundriss}
              alt={`Grundriss ${wohnung.top}`}
              width={760}
              height={520}
              className="block h-auto w-full"
              loading="lazy"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-sm text-white opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
              <ImageIcon size={18} className="mr-2" />
              Grundriss vergrößern
            </span>
          </button>
          <p className="mt-2 text-xs text-muted">
            Auf den Grundriss klicken, um ihn zu vergrößern.
          </p>
        </div>
      </div>
    </div>
  )
}

function DLItem({
  label,
  value,
  emphasized = false,
}: {
  label: string
  value: string
  emphasized?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className={`tabular-nums ${emphasized ? 'text-base font-semibold text-ink' : 'font-medium text-ink'}`}>
        {value}
      </dd>
    </div>
  )
}

function Lightbox({ wohnung, onClose }: { wohnung: Wohnung; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Grundriss ${wohnung.top}`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 md:p-8"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Schließen"
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <X size={24} />
      </button>
      <div onClick={(event) => event.stopPropagation()} className="max-h-full w-full max-w-6xl">
        <Image
          src={wohnung.grundriss}
          alt={`Grundriss ${wohnung.top} vergrößert`}
          width={1600}
          height={1100}
          className="h-auto max-h-[90vh] w-full rounded-md object-contain shadow-2xl"
        />
        <p className="mt-3 text-center text-sm text-white/90">{wohnung.top} · Grundriss</p>
      </div>
    </div>
  )
}
