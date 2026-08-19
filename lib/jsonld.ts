import projectConfig from '@/config/project.json'
import {
  CONTENT_UPDATED_AT,
  getAvailableWohnungen,
  getWohnungDetailPath,
  getWohnungFloorLabel,
  getWohnungOutdoorLabel,
  WOHNUNGEN,
  WOHNUNG_STATUS_LABELS,
  type Wohnung,
} from '@/components/sections/data'
import { formatEUR, formatM2 } from '@/components/sections/format'
import { LEGAL } from '@/lib/legal-config'
import { absUrl, SOCIAL_IMAGE_PATH } from '@/lib/site'

type JsonLdNode = Record<string, unknown>

const AGENT_ID = absUrl('/#grasl')
const PROJECT_ID = absUrl('/#projekt')
const WEBSITE_ID = absUrl('/#website')

const projectAddress: JsonLdNode = {
  '@type': 'PostalAddress',
  streetAddress: 'Feldweg 499c',
  postalCode: '6215',
  addressLocality: 'Achenkirch',
  addressRegion: 'Tirol',
  addressCountry: 'AT',
}

function apartmentId(wohnung: Wohnung) {
  return `${absUrl(getWohnungDetailPath(wohnung))}#apartment`
}

function listingId(wohnung: Wohnung) {
  return `${absUrl(getWohnungDetailPath(wohnung))}#listing`
}

function offerId(wohnung: Wohnung) {
  return `${absUrl(getWohnungDetailPath(wohnung))}#offer`
}

function availabilityFor(wohnung: Wohnung) {
  if (wohnung.status === 'verkauft') return 'https://schema.org/SoldOut'
  if (wohnung.status === 'reserviert') return 'https://schema.org/PreOrder'
  return 'https://schema.org/InStock'
}

function parkingLabel(wohnung: Wohnung) {
  return `${wohnung.parkplaetze} Freistellplatz${wohnung.parkplaetze === 1 ? '' : 'e'}`
}

function buildAgent(): JsonLdNode {
  return {
    '@type': 'RealEstateAgent',
    '@id': AGENT_ID,
    name: LEGAL.controller.businessDesignation,
    legalName: LEGAL.controller.officeName,
    url: LEGAL.controller.web,
    logo: absUrl(projectConfig.company.logoSvg),
    image: absUrl(SOCIAL_IMAGE_PATH),
    telephone: LEGAL.controller.phone,
    email: LEGAL.controller.email,
    vatID: LEGAL.controller.uid,
    founder: {
      '@type': 'Person',
      name: LEGAL.controller.name,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: LEGAL.controller.street,
      postalCode: '6130',
      addressLocality: 'Schwaz',
      addressRegion: 'Tirol',
      addressCountry: 'AT',
    },
    areaServed: ['Achenkirch', 'Achensee', 'Schwaz', 'Tirol'],
  }
}

function buildDeveloper(): JsonLdNode {
  return {
    '@type': 'Organization',
    '@id': absUrl('/#bautraeger'),
    name: projectConfig.bautraeger.name,
    address: projectConfig.bautraeger.address,
    description: projectConfig.bautraeger.role,
  }
}

function buildApartment(wohnung: Wohnung): JsonLdNode {
  const outdoor = getWohnungOutdoorLabel(wohnung)

  return {
    '@type': 'Apartment',
    '@id': apartmentId(wohnung),
    name: `${projectConfig.project.name} ${wohnung.top}`,
    url: absUrl(getWohnungDetailPath(wohnung)),
    address: projectAddress,
    containedInPlace: { '@id': PROJECT_ID },
    floorLevel: getWohnungFloorLabel(wohnung),
    floorSize: {
      '@type': 'QuantitativeValue',
      value: wohnung.wohnflaeche,
      unitCode: 'MTK',
    },
    numberOfRooms: wohnung.zimmer,
    numberOfBedrooms: 1,
    numberOfBathroomsTotal: 1,
    image: [absUrl('/img/projekt-visualisierung-neu.jpg'), absUrl(wohnung.grundriss)],
    amenityFeature: [
      {
        '@type': 'LocationFeatureSpecification',
        name: outdoor || 'Freifläche laut Exposé',
        value: Boolean(outdoor),
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: parkingLabel(wohnung),
        value: true,
      },
    ],
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'HWB',
        value: LEGAL.energy.hwb,
      },
      {
        '@type': 'PropertyValue',
        name: 'fGEE',
        value: LEGAL.energy.fgee,
      },
      {
        '@type': 'PropertyValue',
        name: 'Nutzfläche gewichtet',
        value: formatM2(wohnung.nflGewichtet),
      },
    ],
  }
}

function buildOffer(wohnung: Wohnung): JsonLdNode {
  const offer: JsonLdNode = {
    '@type': 'Offer',
    '@id': offerId(wohnung),
    url: absUrl(getWohnungDetailPath(wohnung)),
    availability: availabilityFor(wohnung),
    businessFunction: 'https://schema.org/Sell',
    seller: { '@id': AGENT_ID },
    itemOffered: { '@id': apartmentId(wohnung) },
  }

  if (wohnung.status !== 'verkauft') {
    offer.price = wohnung.kpGesamt
    offer.priceCurrency = 'EUR'
    offer.priceSpecification = [
      {
        '@type': 'UnitPriceSpecification',
        name: 'Kaufpreis Wohnung',
        price: wohnung.kpWohnung,
        priceCurrency: 'EUR',
      },
      {
        '@type': 'UnitPriceSpecification',
        name: 'Kaufpreis Stellplätze',
        price: wohnung.kpParkplaetze,
        priceCurrency: 'EUR',
      },
    ]
  }

  return offer
}

function buildListing(wohnung: Wohnung): JsonLdNode {
  const outdoor = getWohnungOutdoorLabel(wohnung)
  const status = WOHNUNG_STATUS_LABELS[wohnung.status]
  const priceText = wohnung.status === 'verkauft' ? status : formatEUR(wohnung.kpGesamt)

  return {
    '@type': 'RealEstateListing',
    '@id': listingId(wohnung),
    url: absUrl(getWohnungDetailPath(wohnung)),
    name: `${projectConfig.project.name} ${wohnung.top}`,
    description: `${wohnung.top} in Achenkirch am Achensee: ${formatM2(wohnung.wohnflaeche)}, ${wohnung.zimmer} Zimmer, ${getWohnungFloorLabel(wohnung)}, ${outdoor || 'Freifläche laut Exposé'}, ${parkingLabel(wohnung)}. Status: ${status}. Kaufpreis gesamt: ${priceText}.`,
    datePosted: CONTENT_UPDATED_AT,
    dateModified: CONTENT_UPDATED_AT,
    inLanguage: 'de-AT',
    image: [absUrl('/img/projekt-visualisierung-neu.jpg'), absUrl(wohnung.grundriss)],
    about: { '@id': apartmentId(wohnung) },
    mainEntity: { '@id': apartmentId(wohnung) },
    mainEntityOfPage: absUrl(getWohnungDetailPath(wohnung)),
    offers: { '@id': offerId(wohnung) },
    provider: { '@id': AGENT_ID },
    publisher: { '@id': AGENT_ID },
  }
}

function buildApartmentComplex(): JsonLdNode {
  return {
    '@type': 'ApartmentComplex',
    '@id': PROJECT_ID,
    name: projectConfig.project.name,
    description:
      'Wohnbauprojekt mit sechs 2-Zimmer-Eigentumswohnungen am Feldweg 499c in Achenkirch am Achensee. Vertrieb und Beratung erfolgen durch GRASL Immobilien in Schwaz.',
    url: absUrl('/'),
    image: absUrl(SOCIAL_IMAGE_PATH),
    numberOfAccommodationUnits: WOHNUNGEN.length,
    numberOfAvailableAccommodationUnits: getAvailableWohnungen().length,
    address: projectAddress,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Fußbodenheizung', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Freistellplätze', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Balkon oder Garten', value: true },
    ],
    containsPlace: WOHNUNGEN.map((wohnung) => ({ '@id': apartmentId(wohnung) })),
  }
}

function buildWebsite(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: projectConfig.project.name,
    url: absUrl('/'),
    inLanguage: 'de-AT',
    publisher: { '@id': AGENT_ID },
  }
}

function buildBreadcrumb(wohnung: Wohnung): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absUrl(getWohnungDetailPath(wohnung))}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Startseite',
        item: absUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Wohnungen',
        item: absUrl('/#wohnungen'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: wohnung.top,
        item: absUrl(getWohnungDetailPath(wohnung)),
      },
    ],
  }
}

export function buildHomeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebsite(),
      buildAgent(),
      buildDeveloper(),
      buildApartmentComplex(),
      ...WOHNUNGEN.flatMap((wohnung) => [
        buildApartment(wohnung),
        buildOffer(wohnung),
        buildListing(wohnung),
      ]),
    ],
  }
}

export function buildWohnungDetailJsonLd(wohnung: Wohnung) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildAgent(),
      buildApartmentComplex(),
      buildApartment(wohnung),
      buildOffer(wohnung),
      buildListing(wohnung),
      buildBreadcrumb(wohnung),
    ],
  }
}
