'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Mail, Phone, Send, Smartphone } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import projectConfig from '@/config/project.json'
import { WOHNUNGEN } from './data'
import { leadSchema, type LeadInput } from '@/lib/validation'
import { trackEmailClick, trackEvent, trackPhoneClick } from '@/lib/analytics'
import { Button } from '@/components/ui/Button'

type Props = {
  prefillTop: string | null
}

async function getRecaptchaToken() {
  const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  if (!key || typeof window === 'undefined') return ''
  return ''
}

export function Kontakt({ prefillTop }: Props) {
  const { contact } = projectConfig
  const [sent, setSent] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const hasMobile = Boolean(contact.mobil && contact.mobilDisplay)
  const interests = useMemo(
    () => [
      ...WOHNUNGEN.map((wohnung) => ({
        label: wohnung.top,
        status: wohnung.status,
      })),
      { label: 'noch unentschlossen', status: 'verfuegbar' as const },
    ],
    [],
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      anrede: '',
      name: '',
      email: '',
      telefon: '',
      interesse: [],
      nachricht: '',
      datenschutz: false,
      website: '',
    },
  })

  useEffect(() => {
    if (!prefillTop) return
    const selected = watch('interesse') || []
    const next = Array.from(new Set([...selected, prefillTop]))
    setValue('interesse', next, { shouldValidate: true })
    if (prefillTop === 'noch unentschlossen') {
      setValue('nachricht', 'Bitte senden Sie mir weitere Informationen zum Projekt.', {
        shouldDirty: true,
      })
    } else {
      setValue('nachricht', `Ich interessiere mich für ${prefillTop}.`, {
        shouldDirty: true,
      })
    }
  }, [prefillTop, setValue, watch])

  async function onSubmit(values: LeadInput) {
    setSubmitError(null)
    const recaptchaToken = await getRecaptchaToken()
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, recaptchaToken }),
      })

      if (!response.ok) {
        setSubmitError('Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns per Telefon.')
        return
      }

      trackEvent('lead_submit', { source: 'contact_form' })
      setSent(true)
    } catch {
      setSubmitError('Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns per Telefon.')
    }
  }

  return (
    <section id="kontakt" className="py-28 md:py-36">
      <div className="section-shell grid min-w-0 gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="min-w-0">
          <p className="eyebrow">Kontakt</p>
          <h2 className="mt-4 text-balance break-words font-serif text-[2.45rem] leading-[1.02] text-ink sm:text-5xl md:text-6xl">
            Wir freuen uns auf Ihre Anfrage.
          </h2>
          <div className="mt-10 max-w-full overflow-hidden rounded-md border border-line bg-surface p-4 shadow-soft sm:p-6">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-bg">
                <Image
                  src={contact.portrait}
                  alt={`Portrait ${contact.ansprechpartner}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="break-words font-serif text-2xl text-ink sm:text-3xl">{contact.ansprechpartner}</p>
                <p className="mt-1 text-sm font-semibold text-accent">{contact.rolle}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              <a
                href={`tel:${contact.telefon}`}
                className="inline-flex min-h-6 min-w-0 items-center gap-3 break-all text-ink hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={() => trackPhoneClick('kontakt_telefon')}
              >
                <Phone size={18} aria-hidden="true" />
                {contact.telefonDisplay}
              </a>
              {hasMobile && (
                <a
                  href={`tel:${contact.mobil}`}
                  className="inline-flex min-h-6 min-w-0 items-center gap-3 break-all text-ink hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  onClick={() => trackPhoneClick('kontakt_mobil')}
                >
                  <Smartphone size={18} aria-hidden="true" />
                  {contact.mobilDisplay}
                </a>
              )}
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex min-h-6 min-w-0 items-center gap-3 break-all text-ink hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={() => trackEmailClick(contact.email)}
              >
                <Mail size={18} aria-hidden="true" />
                {contact.email}
              </a>
            </div>
          </div>
        </div>

        <div className="min-w-0 max-w-full overflow-hidden rounded-md border border-line bg-surface p-4 shadow-soft sm:p-6 md:p-8">
          {sent ? (
            <div className="rounded-md bg-success/10 p-8" role="status" aria-live="polite">
              <p className="eyebrow text-success">Anfrage gesendet</p>
              <h3 className="mt-3 font-serif text-4xl text-ink">Danke — wir melden uns innerhalb von 24 h.</h3>
              <p className="mt-4 leading-7 text-muted">
                Ihre Anfrage wurde übermittelt. Das Vertriebsteam meldet sich mit den
                passenden Unterlagen und nächsten Schritten.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="grid min-w-0 gap-5" noValidate>
              <p className="text-sm leading-6 text-muted">
                Felder mit dem Hinweis Pflichtfeld müssen ausgefüllt werden.
              </p>
              <div className="grid min-w-0 gap-5 md:grid-cols-2">
                <Field id="lead-anrede" label="Anrede" error={errors.anrede?.message}>
                  <select
                    id="lead-anrede"
                    {...register('anrede')}
                    className="form-field"
                    aria-invalid={Boolean(errors.anrede)}
                    aria-describedby={errors.anrede ? 'lead-anrede-error' : undefined}
                  >
                    <option value="">Optional</option>
                    <option value="Frau">Frau</option>
                    <option value="Herr">Herr</option>
                    <option value="Divers">Divers</option>
                  </select>
                </Field>
                <Field id="lead-name" label="Vor- und Nachname" error={errors.name?.message} required>
                  <input
                    id="lead-name"
                    {...register('name')}
                    className="form-field"
                    autoComplete="name"
                    required
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'lead-name-error' : undefined}
                  />
                </Field>
              </div>

              <div className="grid min-w-0 gap-5 md:grid-cols-2">
                <Field id="lead-email" label="E-Mail" error={errors.email?.message} required>
                  <input
                    id="lead-email"
                    {...register('email')}
                    className="form-field"
                    type="email"
                    autoComplete="email"
                    required
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'lead-email-error' : undefined}
                  />
                </Field>
                <Field id="lead-telefon" label="Telefon" error={errors.telefon?.message} required>
                  <input
                    id="lead-telefon"
                    {...register('telefon')}
                    className="form-field"
                    type="tel"
                    autoComplete="tel"
                    required
                    aria-invalid={Boolean(errors.telefon)}
                    aria-describedby={errors.telefon ? 'lead-telefon-error' : undefined}
                  />
                </Field>
              </div>

              <fieldset aria-describedby={errors.interesse?.message ? 'lead-interesse-error' : undefined}>
                <legend className="text-sm font-semibold text-ink">
                  Interesse <span className="text-xs font-semibold text-accent">(Pflichtfeld)</span>
                </legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {interests.map((interest) => {
                    const isSold = interest.status === 'verkauft'

                    return (
                      <label
                        key={interest.label}
                        className={`flex min-w-0 items-center gap-3 rounded-md border px-3 py-3 text-sm ${
                          isSold
                            ? 'cursor-not-allowed border-danger/35 bg-danger/10 text-muted'
                            : 'border-line text-ink'
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={interest.label}
                          disabled={isSold}
                          className="h-4 w-4 accent-accent disabled:cursor-not-allowed disabled:opacity-45"
                          aria-invalid={Boolean(errors.interesse)}
                          {...register('interesse')}
                        />
                        <span className="min-w-0 break-words">{interest.label}</span>
                        {isSold && (
                          <span className="ml-auto rounded-full bg-danger px-2 py-0.5 text-xs font-semibold text-white">
                            verkauft
                          </span>
                        )}
                      </label>
                    )
                  })}
                </div>
                {errors.interesse?.message && (
                  <p id="lead-interesse-error" className="mt-2 text-sm text-danger" role="alert">
                    {errors.interesse.message}
                  </p>
                )}
              </fieldset>

              <Field id="lead-nachricht" label="Nachricht" error={errors.nachricht?.message}>
                <textarea
                  id="lead-nachricht"
                  {...register('nachricht')}
                  className="form-field min-h-36 resize-y"
                  aria-invalid={Boolean(errors.nachricht)}
                  aria-describedby={errors.nachricht ? 'lead-nachricht-error' : undefined}
                />
              </Field>

              <input
                {...register('website')}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <label className="flex min-w-0 gap-3 text-sm leading-6 text-muted">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-accent"
                  {...register('datenschutz')}
                  required
                  aria-invalid={Boolean(errors.datenschutz)}
                  aria-describedby={errors.datenschutz ? 'lead-datenschutz-error' : undefined}
                />
                <span className="min-w-0 break-words">
                  Ich habe die{' '}
                  <Link href="/datenschutz" className="font-semibold text-accent underline-offset-4 hover:underline">
                    Datenschutzerklärung
                  </Link>{' '}
                  zur Kenntnis genommen.
                </span>
              </label>
              {errors.datenschutz?.message && (
                <p id="lead-datenschutz-error" className="text-sm text-danger" role="alert">
                  {errors.datenschutz.message}
                </p>
              )}

              {submitError && (
                <p className="rounded-md bg-danger/10 px-4 py-3 text-sm font-semibold text-danger" role="alert">
                  {submitError}
                </p>
              )}

              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                <Send size={18} />
                {isSubmitting ? 'Wird gesendet ...' : 'Anfrage senden'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Field({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label htmlFor={id} className="grid min-w-0 gap-2">
      <span className="text-sm font-semibold text-ink">
        {label}
        {required && <span className="text-xs font-semibold text-accent"> (Pflichtfeld)</span>}
      </span>
      {children}
      {error && (
        <span id={`${id}-error`} className="text-sm text-danger" role="alert">
          {error}
        </span>
      )}
    </label>
  )
}
