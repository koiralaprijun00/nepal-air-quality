import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import Navigation from './components/Navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Metadata, Viewport } from 'next';
import { getTranslations } from 'next-intl/server';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

// Specify default locale and supported locales
const locales = ['en', 'np'];
const defaultLocale = 'en';

interface LayoutProps {
  params: {
    locale: string;
  };
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export const generateMetadata = async ({
  params,
}: LayoutProps): Promise<Metadata> => {
  const { locale } = await params; // Await params
  const t = await getTranslations('site');

  return {
    title: {
      template: `%s | ${t('title')}`,
      default: t('title'),
    },
    description: t('description'),
    themeColor: '#ffffff',
  };
};

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
  const { locale } = await params; // Await params

  // Validate locale and get messages
  if (!locales.includes(locale)) notFound();
  
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className={`${inter.className} antialiased bg-gray-50 min-h-screen`}>
        <Navigation />
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
