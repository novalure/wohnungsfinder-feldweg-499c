'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { WohnungsStatus } from '@/components/sections/data'
import { formatEUR, formatInvestorEUR } from '@/components/sections/format'

type PriceMode = 'eigennutzer' | 'anleger'

type PriceModeContextValue = {
  mode: PriceMode
  setMode: (mode: PriceMode) => void
}

const STORAGE_KEY = 'vallis-price-mode'
const PriceModeContext = createContext<PriceModeContextValue | null>(null)

function parsePriceMode(value: string | null): PriceMode | null {
  if (value === 'anleger' || value === 'eigennutzer') return value
  return null
}

function readStoredMode(): PriceMode | null {
  try {
    return parsePriceMode(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

function writeStoredMode(mode: PriceMode) {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    // localStorage can be unavailable in private or restricted browser contexts.
  }
}

export function PriceModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<PriceMode>('eigennutzer')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const modeFromUrl = parsePriceMode(params.get('preis'))

    if (modeFromUrl) {
      setModeState(modeFromUrl)
      writeStoredMode(modeFromUrl)
      return
    }

    const storedMode = readStoredMode()
    if (storedMode) setModeState(storedMode)
  }, [])

  const setMode = useCallback((nextMode: PriceMode) => {
    setModeState(nextMode)
    writeStoredMode(nextMode)
  }, [])

  const value = useMemo(() => ({ mode, setMode }), [mode, setMode])

  return <PriceModeContext.Provider value={value}>{children}</PriceModeContext.Provider>
}

export function usePriceMode() {
  const context = useContext(PriceModeContext)
  if (!context) throw new Error('usePriceMode must be used inside PriceModeProvider')
  return context
}

export function PriceModeToggle({ className = '' }: { className?: string }) {
  const { mode, setMode } = usePriceMode()

  return (
    <div className={className}>
      <div
        className="inline-flex rounded-md border border-line bg-bg p-1 shadow-soft"
        aria-label="Preisdarstellung wählen"
      >
        {(['eigennutzer', 'anleger'] as const).map((option) => {
          const active = mode === option
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              className={`min-h-10 rounded-[4px] px-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:px-4 ${
                active
                  ? 'bg-accent text-white'
                  : 'text-muted hover:bg-surface hover:text-ink'
              }`}
              onClick={() => setMode(option)}
            >
              {option === 'eigennutzer' ? 'Eigennutzer' : 'Anleger'}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function InvestorFinancingNote({ className = '' }: { className?: string }) {
  const { mode } = usePriceMode()

  if (mode !== 'anleger') return null

  return (
    <div className={`max-w-3xl text-sm leading-6 text-muted ${className}`}>
      <p>
        <strong className="font-semibold text-ink">
          Anleger finanzieren ausschließlich den Nettokaufpreis. Die Umsatzsteuer (20 %) wird im Wege der USt-Überrechnung direkt über die Finanzamtskonten verrechnet und ist vom Käufer nicht vorzufinanzieren.
        </strong>
      </p>
      <p className="mt-1 text-xs leading-5">
        Voraussetzung ist die umsatzsteuerpflichtige Vermietung durch den Käufer. Die Abwicklung erfolgt im Rahmen der Vertragserrichtung; eine individuelle steuerliche Beratung wird empfohlen.
      </p>
    </div>
  )
}

export function PriceAmount({
  gross,
  investorNet,
  status = 'verfuegbar',
  unavailableDisplay = 'gross',
  soldClassName = '',
}: {
  gross: number
  investorNet: number
  status?: WohnungsStatus
  unavailableDisplay?: 'gross' | 'status'
  soldClassName?: string
}) {
  const { mode } = usePriceMode()

  if (status === 'verkauft' && unavailableDisplay === 'status') {
    return <span className={soldClassName}>verkauft</span>
  }

  const value =
    mode === 'anleger' && status === 'verfuegbar'
      ? formatInvestorEUR(investorNet)
      : formatEUR(gross)

  return <>{value}</>
}
