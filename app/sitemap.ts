import type { MetadataRoute } from 'next'
import { absUrl } from '@/lib/site'
import {
  CONTENT_UPDATED_AT,
  getWohnungDetailPath,
  WOHNUNGEN,
} from '@/components/sections/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(CONTENT_UPDATED_AT)
  const indexableWohnungen = WOHNUNGEN.filter((wohnung) => wohnung.status !== 'verkauft')

  return [
    {
      url: absUrl('/'),
      lastModified,
      alternates: {
        languages: {
          'de-AT': absUrl('/'),
        },
      },
    },
    ...indexableWohnungen.map((wohnung) => ({
      url: absUrl(getWohnungDetailPath(wohnung)),
      lastModified,
      alternates: {
        languages: {
          'de-AT': absUrl(getWohnungDetailPath(wohnung)),
        },
      },
    })),
  ]
}
