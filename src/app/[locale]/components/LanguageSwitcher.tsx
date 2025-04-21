'use client'

import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

const LanguageSwitcher = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';
  
  // Add error handling for useTranslations
  let t;
  try {
    t = useTranslations('common');
  } catch (error) {
    console.error('Translation context not found:', error);
    t = (key: string) => key; // Fallback function
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const switchLanguage = (locale: string) => {
    // Get the current path without the locale
    const pathWithoutLocale = pathname.split('/').slice(2).join('/');
    // Create new path with the new locale
    const newPath = `/${locale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`;
    router.push(newPath);
  };

  return (
    <div className="relative group">
      <button
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none border border-gray-200 rounded-md hover:border-gray-300 hover:bg-zinc-200 transition-colors"
        onClick={() => switchLanguage(currentLocale === 'en' ? 'np' : 'en')}
      >
        <span className="text-base">
          {currentLocale === 'en' ? '🇳🇵' : '🇬🇧'}
        </span>
        <span className="text-xs">
          {currentLocale === 'en' ? 'नेपाली' : 'English'}
        </span>
      </button>
    </div>
  );
};

export default LanguageSwitcher; 