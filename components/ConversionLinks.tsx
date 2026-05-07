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
        className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white"
      >
        <Mail size={17} />
        Anfrage senden
      </a>
      <a
        href={`tel:${contact.telefon}`}
        className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink"
        onClick={() => trackPhoneClick('section_cta')}
      >
        <Phone size={17} />
        Anrufen
      </a>
      <a
        href={downloads.expose}
        className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink"
        onClick={() => trackPdfDownload('Section CTA Expose', downloads.expose)}
      >
        <Download size={17} />
        Exposé
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
