'use client'

import { openConsentSettings } from '@/lib/consent'
import { Button } from './ui/Button'

export function CookieSettingsButton() {
  return (
    <Button
      type="button"
      onClick={openConsentSettings}
    >
      Cookie-Einstellungen jetzt öffnen
    </Button>
  )
}
