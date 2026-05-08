'use client'

import { Button } from './ui/Button'

export function CookieSettingsButton() {
  return (
    <Button
      type="button"
      onClick={() => {
        window.dispatchEvent(new Event('cookie-consent:open'))
      }}
    >
      Cookie-Einstellungen jetzt öffnen
    </Button>
  )
}
