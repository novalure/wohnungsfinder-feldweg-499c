import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.example.at'
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
  ]
}
