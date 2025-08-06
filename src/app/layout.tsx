import React from 'react';
import { Metadata, Viewport } from 'next';
import './globals.css';
import Navigation from './components/Navigation';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: '%s | Nepal Air Quality',
      default: 'Nepal Air Quality',
    },
    description: 'Real-time air quality monitoring for Nepal',
  };
}

export const generateViewport = (): Viewport => {
  return {
    width: 'device-width',
    initialScale: 1.0,
    themeColor: '#1f2937',
  };
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-900 text-white min-h-screen">
        <Navigation />
        {children}
      </body>
    </html>
  );
}