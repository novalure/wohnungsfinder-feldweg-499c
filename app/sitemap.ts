import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/legal-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      alternates: {
        languages: {
          'de-AT': baseUrl,
        },
      },
    },
    {
      url: `${baseUrl}/datenschutz`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/impressum`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/quellenverzeichnis`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/cookie-richtlinie`,
      lastModified: new Date(),
    },
  ]
}
