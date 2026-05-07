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
  const interests = useMemo(
    () => [...WOHNUNGEN.map((wohnung) => wohnung.top), 'noch unentschlossen'],
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
    const recaptchaToken = await getRecaptchaToken()
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, recaptchaToken }),
    })

    if (!response.ok) {
      throw new Error('Lead konnte nicht gesendet werden.')
    }

    trackEvent('lead_submit', { source: 'contact_form' })
    setSent(true)
  }

  return (
    <section id="kontakt" className="py-28 md:py-36">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="eyebrow">Kontakt</p>
          <h2 className="mt-4 text-balance break-words font-serif text-[2.45rem] leading-[1.02] text-ink sm:text-5xl md:text-6xl">
            Wir freuen uns auf Ihre Anfrage.
          </h2>
          <div className="mt-10 rounded-md border border-line bg-surface p-6 shadow-soft">
            <div className="flex gap-5">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-bg">
                <Image
                  src={contact.portrait}
                  alt={`Portrait ${contact.ansprechpartner}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-serif text-3xl text-ink">{contact.ansprechpartner}</p>
                <p className="mt-1 text-sm font-semibold text-accent">{contact.rolle}</p>
                <p className="mt-3 text-sm text-muted">Auch am Wochenende erreichbar</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              <a
                href={`tel:${contact.telefon}`}
                className="inline-flex items-center gap-3 text-ink hover:text-accent"
                onClick={() => trackPhoneClick('kontakt_telefon')}
              >
                <Phone size={18} />
                {contact.telefonDisplay}
              </a>
              <a
                href={`tel:${contact.mobil}`}
                className="inline-flex items-center gap-3 text-ink hover:text-accent"
                onClick={() => trackPhoneClick('kontakt_mobil')}
              >
                <Smartphone size={18} />
                {contact.mobilDisplay}
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-3 text-ink hover:text-accent"
                onClick={() => trackEmailClick(contact.email)}
              >
                <Mail size={18} />
                {contact.email}
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-line bg-surface p-6 shadow-soft md:p-8">
          {sent ? (
            <div className="rounded-md bg-success/10 p-8">
              <p className="eyebrow text-success">Anfrage gesendet</p>
              <h3 className="mt-3 font-serif text-4xl text-ink">Danke — wir melden uns innerhalb von 24 h.</h3>
              <p className="mt-4 leading-7 text-muted">
                Ihre Anfrage wurde übermittelt. Das Vertriebsteam meldet sich mit den
                passenden Unterlagen und nächsten Schritten.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Anrede" error={errors.anrede?.message}>
                  <select {...register('anrede')} className="form-field">
                    <option value="">Optional</option>
                    <option value="Frau">Frau</option>
                    <option value="Herr">Herr</option>
                    <option value="Divers">Divers</option>
                  </select>
                </Field>
                <Field label="Vor- und Nachname" error={errors.name?.message}>
                  <input {...register('name')} className="form-field" autoComplete="name" />
                </Field>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="E-Mail" error={errors.email?.message}>
                  <input {...register('email')} className="form-field" type="email" autoComplete="email" />
                </Field>
                <Field label="Telefon" error={errors.telefon?.message}>
                  <input {...register('telefon')} className="form-field" type="tel" autoComplete="tel" />
                </Field>
              </div>

              <div>
                <p className="text-sm font-semibold text-ink">Interesse</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {interests.map((interest) => (
                    <label key={interest} className="flex items-center gap-3 rounded-md border border-line px-3 py-3 text-sm text-ink">
                      <input
                        type="checkbox"
                        value={interest}
                        className="h-4 w-4 accent-accent"
                        {...register('interesse')}
                      />
                      {interest}
                    </label>
                  ))}
                </div>
                {errors.interesse?.message && (
                  <p className="mt-2 text-sm text-danger">{errors.interesse.message}</p>
                )}
              </div>

              <Field label="Nachricht" error={errors.nachricht?.message}>
                <textarea {...register('nachricht')} className="form-field min-h-36 resize-y" />
              </Field>

              <input
                {...register('website')}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <label className="flex gap-3 text-sm leading-6 text-muted">
                <input type="checkbox" className="mt-1 h-4 w-4 accent-accent" {...register('datenschutz')} />
                <span>
                  Ich habe die{' '}
                  <Link href="/datenschutz" className="font-semibold text-accent underline-offset-4 hover:underline">
                    Datenschutzbestimmungen
                  </Link>{' '}
                  gelesen und akzeptiere die Verarbeitung meiner Angaben.
                </span>
              </label>
              {errors.datenschutz?.message && (
                <p className="text-sm text-danger">{errors.datenschutz.message}</p>
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
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-ink">{label}</span>
      {children}
      {error && <span className="text-sm text-danger">{error}</span>}
    </label>
  )
}
