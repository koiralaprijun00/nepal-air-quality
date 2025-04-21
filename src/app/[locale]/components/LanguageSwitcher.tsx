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
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
    router.push(newPath);
  };

  return (
    <div className="relative group">
      <button
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none"
        onClick={() => switchLanguage(currentLocale === 'en' ? 'np' : 'en')}
      >
        <GlobeAltIcon className="h-5 w-5" />
        <span>{isMounted ? t('language') : 'Language'}</span>
        <span className="ml-1 text-xs">
          {currentLocale === 'en' ? 'ने' : 'EN'}
        </span>
      </button>
    </div>
  );
};

export default LanguageSwitcher; 