import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nepal-air-quality.vercel.app'
  
  // List of major cities
  const cities = [
    'kathmandu',
    'pokhara',
    'lalitpur',
    'biratnagar',
    'bharatpur'
  ]

  // List of supported locales
  const locales = ['en', 'np']

  // Generate city URLs for each locale
  const cityUrls = cities.flatMap(city => 
    locales.map(locale => ({
      url: `${baseUrl}/${locale}/city/${city}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))
  )

  // Generate base URLs for each locale
  const baseUrls = locales.map(locale => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }))

  return [
    ...baseUrls,
    ...cityUrls,
  ]
} 