type EventParams = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

export function trackEvent(name: string, params: EventParams = {}) {
  if (typeof window === 'undefined') return
  window.gtag?.('event', name, params)
  window.fbq?.('trackCustom', name, params)
}

export function trackSectionView(sectionId: string) {
  trackEvent('view_section', { section_id: sectionId })
}

export function trackPdfDownload(label: string, url: string) {
  trackEvent('pdf_download', { label, url })
}

export function trackPhoneClick(label: string) {
  trackEvent('phone_click', { label })
}

export function trackEmailClick(email: string) {
  trackEvent('email_click', { email })
}
