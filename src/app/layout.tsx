import "./globals.css"
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Metadata } from 'next'

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
        <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/v3.10.0/mapbox-gl.css" />
      </head>
      <body className="antialiased bg-gray-50">
        {children}
        <footer className="text-center py-4 mt-12 text-gray-600 text-sm">
          <div className="max-w-7xl mx-auto px-4">
            <p>&copy; {new Date().getFullYear()} Nepal Air Quality Monitoring. All rights reserved.</p>
            <p className="mt-1">Data is for demonstration purposes only.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}