import "./globals.css"
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Metadata } from 'next'
import Navigation from './components/Navigation';

export const metadata: Metadata = {
  title: 'Nepal Air Quality - Real-time Pollution Monitoring',
  description: 'Monitor real-time air quality and pollution levels across cities in Nepal.',
  keywords: 'nepal, air quality, pollution, AQI, kathmandu, pokhara, air monitoring',
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className="antialiased bg-gray-50">
      <Navigation />
        {children}
      </body>
    </html>
  )
}