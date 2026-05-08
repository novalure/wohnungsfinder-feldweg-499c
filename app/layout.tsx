import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import 'leaflet/dist/leaflet.css'
import 'photoswipe/style.css'
import '../styles/globals.css'
import projectConfig from '@/config/project.json'
import { CookieBanner } from '@/components/CookieBanner'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  weight: ['400', '500', '600', '700'],
})

const project = projectConfig.project

export const metadata: Metadata = {
  metadataBase: new URL('https://www.example.at'),
  title: `${project.name} — Eigentumswohnungen am Achensee | ${project.ortKurz}`,
  description:
    'Eigentumswohnungen am Achensee in Tirol mit Bergblick, ruhiger Architektur und persönlicher Beratung durch GRASL Immobilien.',
  alternates: {
    canonical: '/',
    languages: {
      'de-AT': '/',
    },
  },
  openGraph: {
    title: `${project.name} — Eigentumswohnungen am Achensee`,
    description:
      'Sechs exklusive Eigentumswohnungen am Achensee. Exposé anfragen und persönliche Beratung sichern.',
    locale: 'de_AT',
    type: 'website',
    images: [
      {
        url: '/img/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${project.name} am Achensee`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${project.name} — Eigentumswohnungen am Achensee`,
    description: 'Wohnbauprojekt mit 6 Eigentumswohnungen in Tirol.',
    images: ['/img/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-AT" className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
