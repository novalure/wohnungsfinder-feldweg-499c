import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vallis Achen Residenzen',
    short_name: 'Vallis Achen',
    description: 'Eigentumswohnungen am Achensee in Achenkirch.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#F6F1E8',
    theme_color: '#314C3A',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
