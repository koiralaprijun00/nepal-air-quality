import { notFound } from 'next/navigation';
import Navigation from './components/Navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Metadata, Viewport } from 'next';
import { getTranslations } from 'next-intl/server';
import '../globals.css';

// Specify default locale and supported locales
const locales = ['en', 'np'];
const defaultLocale = 'en';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'site' });

  return {
    title: {
      template: `%s | ${t('title')}`,
      default: t('title'),
    },
    description: t('description'),
    themeColor: '#ffffff',
  };
}

export const generateViewport = (): Viewport => {
  return {
    width: 'device-width',
    initialScale: 1.0,
  };
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  if (!locales.includes(params.locale)) notFound();
  
  const messages = await getMessages({ locale: params.locale });

  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      <div className="antialiased bg-gray-50 min-h-screen">
        <Navigation />
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
