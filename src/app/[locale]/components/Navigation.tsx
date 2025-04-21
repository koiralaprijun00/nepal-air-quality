// src/app/components/Navigation.tsx
'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const t = useTranslations('navigation');

  return (
    <nav className="bg-gray-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex items-center">
              <Image 
                src="/nepali-hawa.png" 
                alt="Nepali Hawa" 
                width={150} 
                height={40}
                className="h-10 w-auto transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href={`/${locale}`} isActive={pathname === `/${locale}`}>
              {t('home')}
            </NavLink>
            <NavLink href={`/${locale}/blog`} isActive={pathname === `/${locale}/blog`}>
              {t('about')}
            </NavLink>
            <LanguageSwitcher />
          </div>
          
          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center space-x-4">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg 
                className="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
            <MobileNavLink href={`/${locale}`} isActive={pathname === `/${locale}`}>
              Dashboard
            </MobileNavLink>
            <MobileNavLink href={`/${locale}/blog`} isActive={pathname === `/${locale}/blog`}>
              Learn About AQI
            </MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

interface NavLinkProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, isActive, children }) => {
  return (
    <Link 
      href={href}
      className={`px-1 py-2 text-base font-medium border-b-2 ${
        isActive 
          ? 'border-blue-500 text-blue-600' 
          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
      }`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink: React.FC<NavLinkProps> = ({ href, isActive, children }) => {
  return (
    <Link 
      href={href}
      className={`block px-3 py-2 rounded-md text-base font-medium ${
        isActive 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  );
};

export default Navigation;