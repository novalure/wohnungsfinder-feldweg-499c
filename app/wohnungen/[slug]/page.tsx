import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { WohnungDetailPage } from '@/components/wohnungen/WohnungDetailPage'
import {
  getWohnungBySlug,
  getWohnungDetailPath,
  getWohnungFloorLabel,
  getWohnungOutdoorLabel,
  getWohnungSlug,
  WOHNUNGEN,
  WOHNUNG_STATUS_LABELS,
} from '@/components/sections/data'
import { absUrl } from '@/lib/site'
import { formatEUR, formatM2 } from '@/components/sections/format'
import projectConfig from '@/config/project.json'

type Props = {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return WOHNUNGEN.map((wohnung) => ({
    slug: getWohnungSlug(wohnung),
  }))
}

export function generateMetadata({ params }: Props): Metadata {
  const wohnung = getWohnungBySlug(params.slug)

  if (!wohnung) {
    return {
      title: 'Wohnung nicht gefunden | Vallis Achen Residenzen',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const path = getWohnungDetailPath(wohnung)
  const detailUrl = absUrl(path)
  const isSold = wohnung.status === 'verkauft'
  const status = WOHNUNG_STATUS_LABELS[wohnung.status]
  const outdoor = getWohnungOutdoorLabel(wohnung)
  const price = isSold ? status : formatEUR(wohnung.kpGesamt)
  const description = `${wohnung.top} in Achenkirch am Achensee: ${formatM2(wohnung.wohnflaeche)}, ${wohnung.zimmer} Zimmer, ${getWohnungFloorLabel(wohnung)}, ${outdoor || 'Freifläche laut Exposé'}, ${wohnung.parkplaetze} Stellplatz${wohnung.parkplaetze === 1 ? '' : 'e'}. Status: ${status}. Kaufpreis gesamt: ${price}.`

  return {
    title: `${wohnung.top}: ${wohnung.zimmer}-Zimmer-Wohnung ${formatM2(wohnung.wohnflaeche)} in Achenkirch | ${status}`,
    description,
    alternates: {
      canonical: path,
      languages: {
        'de-AT': path,
      },
    },
    robots: {
      index: !isSold,
      follow: true,
    },
    openGraph: {
      title: `${wohnung.top} | ${projectConfig.project.name}`,
      description,
      url: detailUrl,
      locale: 'de_AT',
      siteName: 'Vallis Achen Residenzen',
      type: 'website',
      images: [
        {
          url: absUrl('/img/og-image.jpg'),
          width: 1200,
          height: 630,
          alt: `${projectConfig.project.name} ${wohnung.top}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${wohnung.top} | ${projectConfig.project.name}`,
      description,
      images: [absUrl('/img/og-image.jpg')],
    },
  }
}

export default function WohnungPage({ params }: Props) {
  const wohnung = getWohnungBySlug(params.slug)

  if (!wohnung) {
    notFound()
  }

  return <WohnungDetailPage wohnung={wohnung} />
}
