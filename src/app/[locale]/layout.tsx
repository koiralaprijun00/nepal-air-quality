
import React from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Metadata, Viewport } from 'next';
import '../globals.css';
import Navigation from './components/Navigation';

const locales = ['en', 'np'];

type Props = {
  children: React.ReactNode;
  params: { locale: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'site' });

  return {
    title: {
      template: `%s | ${t('title')}`,
      default: t('title'),
    },
    description: t('description'),
  };
}

export const generateViewport = (): Viewport => {
  return {
    width: 'device-width',
    initialScale: 1.0,
    themeColor: '#1f2937',
  };
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  // Validate locale
  if (!locales.includes(resolvedParams.locale)) notFound();
  
  const messages = await getMessages({ locale: resolvedParams.locale });

  return (
    <NextIntlClientProvider locale={resolvedParams.locale} messages={messages}>
      <div className="antialiased bg-gray-900 text-white min-h-screen">
        <Navigation />
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
