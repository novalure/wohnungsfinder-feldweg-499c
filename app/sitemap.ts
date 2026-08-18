import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/legal-config'
import { getWohnungDetailPath, WOHNUNGEN } from '@/components/sections/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL
  const lastModified = new Date()
  return [
    {
      url: baseUrl,
      lastModified,
      alternates: {
        languages: {
          'de-AT': baseUrl,
        },
      },
    },
    ...WOHNUNGEN.map((wohnung) => ({
      url: `${baseUrl}${getWohnungDetailPath(wohnung)}`,
      lastModified,
      alternates: {
        languages: {
          'de-AT': `${baseUrl}${getWohnungDetailPath(wohnung)}`,
        },
      },
    })),
    {
      url: `${baseUrl}/datenschutz`,
      lastModified,
    },
    {
      url: `${baseUrl}/impressum`,
      lastModified,
    },
    {
      url: `${baseUrl}/quellenverzeichnis`,
      lastModified,
    },
    {
      url: `${baseUrl}/cookie-richtlinie`,
      lastModified,
    },
  ]
}
