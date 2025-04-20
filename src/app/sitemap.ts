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

  // Generate city URLs
  const cityUrls = cities.map(city => ({
    url: `${baseUrl}/city/${city}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...cityUrls,
  ]
} 