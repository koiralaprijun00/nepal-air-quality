import "./globals.css"
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Metadata } from 'next'
import Navigation from './components/Navigation';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nepal Air Quality - Real-time Air Pollution Monitoring',
  description: 'Track real-time air quality index (AQI) and pollution levels across Nepal. Get detailed air quality data for Kathmandu, Pokhara, and other major cities.',
  keywords: 'nepal air quality, air pollution nepal, aqi nepal, kathmandu air quality, pokhara air quality, nepal pollution, air quality index',
  authors: [{ name: 'Nepal Air Quality Team' }],
  creator: 'Nepal Air Quality Team',
  publisher: 'Nepal Air Quality Team',
  openGraph: {
    title: 'Nepal Air Quality - Real-time Air Pollution Monitoring',
    description: 'Track real-time air quality index (AQI) and pollution levels across Nepal. Get detailed air quality data for Kathmandu, Pokhara, and other major cities.',
    url: 'https://nepal-air-quality.vercel.app',
    siteName: 'Nepal Air Quality',
    images: [
      {
        url: 'https://nepal-air-quality.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nepal Air Quality Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nepal Air Quality - Real-time Air Pollution Monitoring',
    description: 'Track real-time air quality index (AQI) and pollution levels across Nepal.',
    images: ['https://nepal-air-quality.vercel.app/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
  alternates: {
    canonical: 'https://nepal-air-quality.vercel.app',
  },
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}