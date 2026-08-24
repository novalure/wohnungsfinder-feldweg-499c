'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from './ui/Button'
import { trackEvent } from '@/lib/analytics'
import { BUYER_TYPE_LABELS, type LeadInput } from '@/lib/validation'

export function ExitIntent() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [kaeuferart, setKaeuferart] = useState<LeadInput['kaeuferart'] | ''>('')
  const [accepted, setAccepted] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('exit-intent-seen')) return
    const onMouseLeave = (event: MouseEvent) => {
      if (event.clientY <= 0 && window.innerWidth >= 1024) {
        localStorage.setItem('exit-intent-seen', 'true')
        setOpen(true)
      }
    }
    document.addEventListener('mouseleave', onMouseLeave)
    return () => document.removeEventListener('mouseleave', onMouseLeave)
  }, [])

  async function submit() {
    if (!email || !kaeuferart || !accepted) return
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Exposé-Anfrage',
        email,
        telefon: 'nicht angegeben',
        interesse: ['Exposé'],
        kaeuferart,
        nachricht: 'Bitte senden Sie mir das Exposé per E-Mail zu.',
        datenschutz: true,
        website: '',
      }),
    })
    if (!response.ok) return
    trackEvent('lead_submit', { source: 'exit_intent' })
    setSent(true)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 hidden items-center justify-center bg-ink/45 p-6 backdrop-blur-sm lg:flex">
      <div className="relative w-full max-w-md rounded-md bg-surface p-8 shadow-soft">
        <button
          type="button"
          className="absolute right-4 top-4 text-muted hover:text-ink"
          onClick={() => setOpen(false)}
          aria-label="Schließen"
        >
          <X />
        </button>
        {sent ? (
          <div>
            <p className="eyebrow">Exposé</p>
            <h2 className="mt-3 font-serif text-4xl text-ink">Danke</h2>
            <p className="mt-4 leading-7 text-muted">
              Wir melden uns mit den Unterlagen und den nächsten Schritten.
            </p>
          </div>
        ) : (
          <div>
            <p className="eyebrow">Unterlagen erhalten</p>
            <h2 className="mt-3 font-serif text-4xl text-ink">
              Exposé direkt per E-Mail
            </h2>
            <p className="mt-4 leading-7 text-muted">
              Hinterlassen Sie Ihre E-Mail-Adresse. Wir senden Ihnen die Unterlagen
              zum Projekt persönlich zu.
            </p>
            <input
              type="email"
              className="mt-6 w-full rounded-md border border-line bg-bg px-4 py-3 outline-none focus:border-accent"
              placeholder="E-Mail-Adresse"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <fieldset className="mt-4">
              <legend className="text-sm font-semibold text-ink">
                Nutzung <span className="text-xs font-semibold text-accent">(Pflichtfeld)</span>
              </legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {Object.entries(BUYER_TYPE_LABELS).map(([value, label]) => (
                  <label
                    key={value}
                    className="flex items-center gap-3 rounded-md border border-line px-3 py-3 text-sm text-ink"
                  >
                    <input
                      type="radio"
                      name="exit-kaeuferart"
                      value={value}
                      checked={kaeuferart === value}
                      className="h-4 w-4 accent-accent"
                      onChange={() => setKaeuferart(value as LeadInput['kaeuferart'])}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="mt-4 flex gap-3 text-sm leading-6 text-muted">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-accent"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
              />
              Ich habe die Datenschutzerklärung zur Kenntnis genommen.
            </label>
            <Button className="mt-5 w-full" onClick={submit} disabled={!email || !kaeuferart || !accepted}>
              Exposé anfordern
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
