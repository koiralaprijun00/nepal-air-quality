import "./globals.css"
import 'mapbox-gl/dist/mapbox-gl.css';
import Head from "next/head"

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Head>
      <link href='https://api.mapbox.com/mapbox-gl-js/v3.10.0/mapbox-gl.css' rel='stylesheet' />
      </Head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}