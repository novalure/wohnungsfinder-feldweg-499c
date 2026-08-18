import { OnePager } from '@/components/OnePager'
import projectConfig from '@/config/project.json'
import { WOHNUNGEN } from '@/components/sections/data'
import { SITE_URL } from '@/lib/legal-config'

const { project, company, bautraeger } = projectConfig

const projectAddress = {
  '@type': 'PostalAddress',
  streetAddress: 'Feldweg 499c',
  postalCode: '6215',
  addressLocality: 'Achenkirch',
  addressRegion: 'Tirol',
  addressCountry: 'AT',
}

function JsonLd() {
  const listings = WOHNUNGEN.map((wohnung) => ({
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: `${project.name} ${wohnung.top}`,
    url: `${SITE_URL}/#wohnungen`,
    address: projectAddress,
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
      '@type': 'RealEstateAgent',
      name: company.name,
      legalName: company.legalName,
      address: company.address,
      url: SITE_URL,
      logo: company.logoSvg,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: bautraeger.name,
      address: bautraeger.address,
      description: bautraeger.role,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: project.name,
      address: projectAddress,
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Bauwerber und Grundeigentümer',
          value: bautraeger.name,
        },
        {
          '@type': 'PropertyValue',
          name: 'Energiekennwert',
          value: project.hwb,
        },
      ],
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
