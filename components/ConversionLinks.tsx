'use client'

import { Download, Mail, Phone } from 'lucide-react'
import projectConfig from '@/config/project.json'
import { trackEmailClick, trackPdfDownload, trackPhoneClick } from '@/lib/analytics'

export function ConversionLinks({ className = '' }: { className?: string }) {
  const { contact, downloads } = projectConfig

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a
        href="#kontakt"
        className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Mail size={17} aria-hidden="true" />
        Anfrage senden
      </a>
      <a
        href={`tel:${contact.telefon}`}
        className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        onClick={() => trackPhoneClick('section_cta')}
      >
        <Phone size={17} aria-hidden="true" />
        Anrufen
      </a>
      <a
        href={downloads.expose}
        className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        onClick={() => trackPdfDownload('Section CTA Expose', downloads.expose)}
      >
        <Download size={17} aria-hidden="true" />
        Exposé als PDF herunterladen
      </a>
      <a
        href={`mailto:${contact.email}`}
        className="sr-only"
        onClick={() => trackEmailClick(contact.email)}
      >
        E-Mail
      </a>
    </div>
  )
}
