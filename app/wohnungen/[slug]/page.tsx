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
import { SITE_URL } from '@/lib/legal-config'
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
  const status = WOHNUNG_STATUS_LABELS[wohnung.status]
  const price = wohnung.status === 'verkauft' ? status : formatEUR(wohnung.kpGesamt)
  const description = `${wohnung.top} in Achenkirch: ${formatM2(wohnung.wohnflaeche)}, ${wohnung.zimmer} Zimmer, ${getWohnungFloorLabel(wohnung)}, ${getWohnungOutdoorLabel(wohnung)}. Grundriss, Bilder, Energieausweis und Anfrage. Kaufpreis: ${price}.`

  return {
    title: `${wohnung.top} kaufen | Feldweg 499c Achenkirch`,
    description,
    alternates: {
      canonical: path,
      languages: {
        'de-AT': path,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${wohnung.top} | ${projectConfig.project.name}`,
      description,
      url: `${SITE_URL}${path}`,
      locale: 'de_AT',
      type: 'website',
      images: [
        {
          url: '/img/og-image.jpg',
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
      images: ['/img/og-image.jpg'],
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
