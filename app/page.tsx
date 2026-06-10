import { OnePager } from '@/components/OnePager'
import projectConfig from '@/config/project.json'
import { WOHNUNGEN } from '@/components/sections/data'
import { SITE_URL } from '@/lib/legal-config'

const { project, company } = projectConfig

function JsonLd() {
  const listings = WOHNUNGEN.map((wohnung) => ({
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: `${project.name} ${wohnung.top}`,
    url: `${SITE_URL}/#wohnungen`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: project.address,
      addressCountry: 'AT',
    },
    floorSize: {
      '@type': 'QuantitativeValue',
      value: wohnung.wohnflaeche,
      unitCode: 'MTK',
    },
    numberOfRooms: wohnung.zimmer,
    offers: {
      '@type': 'Offer',
      price: wohnung.kpGesamt,
      priceCurrency: 'EUR',
      availability:
        wohnung.status === 'verkauft'
          ? 'https://schema.org/SoldOut'
          : 'https://schema.org/InStock',
    },
  }))

  const graph = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: company.name,
      legalName: company.legalName,
      address: company.address,
      url: SITE_URL,
      logo: company.logoSvg,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: project.name,
      address: project.address,
    },
    ...listings,
  ]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}

export default function Home() {
  return (
    <>
      <JsonLd />
      <OnePager />
    </>
  )
}
